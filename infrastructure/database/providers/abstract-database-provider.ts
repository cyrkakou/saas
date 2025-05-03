import { DatabaseProvider, DatabaseConfig } from './database-provider.interface';

/**
 * Abstract database provider class
 * This class provides a base implementation for database providers
 */
export abstract class AbstractDatabaseProvider<T = any> implements DatabaseProvider<T> {
  protected config: DatabaseConfig;
  protected db: T | null = null;
  protected schema: any = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Get the database instance
   */
  getDb(): T {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  /**
   * Get the database schema
   */
  getSchema(): any {
    if (!this.schema) {
      throw new Error('Schema not initialized');
    }
    return this.schema;
  }

  /**
   * Initialize the database
   * This method should be implemented by concrete providers
   */
  abstract initialize(): Promise<void>;

  /**
   * Run migrations
   * This method should be implemented by concrete providers
   */
  abstract migrate(): Promise<void>;

  /**
   * Close the database connection
   * This method should be implemented by concrete providers
   */
  abstract close(): Promise<void>;
}
