/**
 * Interface for database providers
 * This is the core interface that all database providers must implement
 */
export interface DatabaseProvider<T = any> {
  /**
   * Get the database instance
   */
  getDb(): T;
  
  /**
   * Get the database schema
   */
  getSchema(): any;
  
  /**
   * Initialize the database
   */
  initialize(): Promise<void>;
  
  /**
   * Run migrations
   */
  migrate(): Promise<void>;
  
  /**
   * Close the database connection
   */
  close(): Promise<void>;
}

/**
 * Database provider types
 */
export type DatabaseProviderType = 'sqlite' | 'mysql' | 'postgres';

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  /**
   * Database provider type
   */
  type: DatabaseProviderType;
  
  /**
   * Database connection URL
   */
  url?: string;
  
  /**
   * Database host
   */
  host?: string;
  
  /**
   * Database port
   */
  port?: number;
  
  /**
   * Database username
   */
  username?: string;
  
  /**
   * Database password
   */
  password?: string;
  
  /**
   * Database name
   */
  database?: string;
  
  /**
   * Use SSL for database connection
   */
  ssl?: boolean;
  
  /**
   * SQLite database file path
   */
  filePath?: string;
}
