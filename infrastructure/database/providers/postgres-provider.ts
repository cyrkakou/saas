import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { AbstractDatabaseProvider } from './abstract-database-provider';
import { DatabaseConfig } from './database-provider.interface';
import * as postgresSchema from '../schemas/postgres-schema';
import path from 'path';

/**
 * PostgreSQL database provider
 */
export class PostgresProvider extends AbstractDatabaseProvider<ReturnType<typeof drizzle>> {
  private client: ReturnType<typeof postgres> | null = null;

  constructor(config: DatabaseConfig) {
    super(config);
    this.schema = postgresSchema;
  }

  /**
   * Initialize the PostgreSQL database
   */
  async initialize(): Promise<void> {
    try {
      // Create the connection
      this.client = postgres({
        host: this.config.host || 'localhost',
        port: this.config.port || 5432,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        ssl: this.config.ssl,
        max: 10,
      });

      // Create the Drizzle ORM instance
      this.db = drizzle(this.client, { schema: this.schema });

      // Test the connection
      await this.client`SELECT 1`;
      console.log(`PostgreSQL database connected to ${this.config.host}:${this.config.port}/${this.config.database}`);
    } catch (error) {
      console.error('Error initializing PostgreSQL database:', error);
      throw error;
    }
  }

  /**
   * Run migrations for PostgreSQL
   */
  async migrate(): Promise<void> {
    if (!this.db || !this.client) {
      throw new Error('Database not initialized');
    }

    try {
      // Run migrations
      await migrate(this.db, {
        migrationsFolder: path.join(process.cwd(), 'infrastructure/database/migrations/postgres'),
      });
      console.log('PostgreSQL migrations completed');
    } catch (error) {
      console.error('Error running PostgreSQL migrations:', error);
      throw error;
    }
  }

  /**
   * Close the PostgreSQL database connection
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
      this.db = null;
      console.log('PostgreSQL database connection closed');
    }
  }
}
