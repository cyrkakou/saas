import { DatabaseProvider, DatabaseConfig, DatabaseProviderType } from './database-provider.interface';
import { SQLiteProvider } from './sqlite-provider';
import { MySQLProvider } from './mysql-provider';
import { PostgresProvider } from './postgres-provider';

/**
 * Factory function to create a database provider
 * @param config Database configuration
 * @returns Database provider instance
 */
export async function createDatabaseProvider(
  config: DatabaseConfig
): Promise<DatabaseProvider> {
  let provider: DatabaseProvider;

  switch (config.type) {
    case 'sqlite':
      provider = new SQLiteProvider(config);
      break;
    case 'mysql':
      provider = new MySQLProvider(config);
      break;
    case 'postgres':
      provider = new PostgresProvider(config);
      break;
    default:
      throw new Error(`Unsupported database provider type: ${config.type}`);
  }

  // Initialize the provider
  await provider.initialize();

  return provider;
}

/**
 * Load database configuration from environment variables
 * @returns Database configuration
 */
export function loadDatabaseConfig(): DatabaseConfig {
  const providerType = (process.env.DATABASE_PROVIDER || 'sqlite') as DatabaseProviderType;
  
  const config: DatabaseConfig = {
    type: providerType,
  };

  // Add provider-specific configuration
  switch (providerType) {
    case 'sqlite':
      config.filePath = process.env.DATABASE_URL?.replace('file:', '') || 'sqlite.db';
      break;
    case 'mysql':
    case 'postgres':
      if (process.env.DATABASE_URL) {
        config.url = process.env.DATABASE_URL;
      } else {
        config.host = process.env.DATABASE_HOST;
        config.port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined;
        config.username = process.env.DATABASE_USERNAME;
        config.password = process.env.DATABASE_PASSWORD;
        config.database = process.env.DATABASE_NAME;
        config.ssl = process.env.DATABASE_SSL === 'true';
      }
      break;
  }

  return config;
}
