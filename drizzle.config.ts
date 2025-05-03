import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get database provider from environment variables
const databaseProvider = process.env.DATABASE_PROVIDER || 'sqlite';

// Base configuration
const baseConfig: Partial<Config> = {
  schema: './infrastructure/database/schemas',
};

// Provider-specific configuration
let providerConfig: Partial<Config> = {};

switch (databaseProvider) {
  case 'sqlite':
    providerConfig = {
      out: './infrastructure/database/migrations/sqlite',
      driver: 'better-sqlite',
      dbCredentials: {
        url: process.env.DATABASE_URL?.replace('file:', '') || 'sqlite.db',
      },
    };
    break;
  case 'mysql':
    providerConfig = {
      out: './infrastructure/database/migrations/mysql',
      driver: 'mysql2',
      dbCredentials: process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          },
    };
    break;
  case 'postgres':
    providerConfig = {
      out: './infrastructure/database/migrations/postgres',
      driver: 'pg',
      dbCredentials: process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          },
    };
    break;
  default:
    throw new Error(`Unsupported database provider: ${databaseProvider}`);
}

// Merge configurations
const config: Config = {
  ...baseConfig,
  ...providerConfig,
} as Config;

export default config;
