import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get database provider from environment variables
const databaseProvider = process.env.DATABASE_PROVIDER || 'sqlite';

// Base configuration
const baseConfig: Partial<Config> = {
  // Schema path depends on the provider
  schema: '',
  dialect: 'sqlite',
};

// Provider-specific configuration
let providerConfig: Partial<Config> = {};

switch (databaseProvider) {
  case 'sqlite':
    providerConfig = {
      schema: './infrastructure/database/providers/sqlite/sqlite-schema.ts',
      out: './infrastructure/database/providers/sqlite/migrations',
      driver: 'better-sqlite3',
      dbCredentials: {
        url: process.env.DATABASE_URL?.replace('file:', '') || 'sqlite.db',
      },
    };
    break;
  case 'mysql':
    providerConfig = {
      schema: './infrastructure/database/providers/mysql/mysql-schema.ts',
      out: './infrastructure/database/providers/mysql/migrations',
      driver: 'mysql2' as any, // Type assertion to avoid TypeScript errors
      dbCredentials: process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL } as any
        : {
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          } as any, // Type assertion to avoid TypeScript errors
    };
    break;
  case 'postgres':
    providerConfig = {
      schema: './infrastructure/database/providers/postgres/postgres-schema.ts',
      out: './infrastructure/database/providers/postgres/migrations',
      driver: 'pg' as any, // Type assertion to avoid TypeScript errors
      dbCredentials: process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL } as any
        : {
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
          } as any, // Type assertion to avoid TypeScript errors
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
