import { DatabaseProvider, DatabaseConfig, DatabaseProviderType } from './interfaces/database-provider.interface';

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
      // Dynamically import to avoid circular dependencies
      const { SQLiteProvider } = await import('../providers/sqlite/sqlite-provider');
      provider = new SQLiteProvider(config);
      break;
    case 'mysql':
      // Dynamically import to avoid circular dependencies
      const { MySQLProvider } = await import('../providers/mysql/mysql-provider');
      provider = new MySQLProvider(config);
      break;
    case 'postgres':
      // Dynamically import to avoid circular dependencies
      const { PostgresProvider } = await import('../providers/postgres/postgres-provider');
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
