import { DatabaseProvider } from './providers/database-provider.interface';
import { createDatabaseProvider, loadDatabaseConfig } from './providers/database-provider-factory';

/**
 * Database service singleton
 * This service manages the database connection and provides access to the database
 */
class DatabaseService {
  private static instance: DatabaseService;
  private provider: DatabaseProvider | null = null;
  private initialized = false;

  private constructor() {}

  /**
   * Get the database service instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize the database service
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Load database configuration from environment variables
      const config = loadDatabaseConfig();

      // Create the database provider
      this.provider = await createDatabaseProvider(config);

      this.initialized = true;
      console.log(`Database service initialized with ${config.type} provider`);
    } catch (error) {
      console.error('Error initializing database service:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  public async migrate(): Promise<void> {
    if (!this.provider) {
      throw new Error('Database service not initialized');
    }

    await this.provider.migrate();
  }

  /**
   * Get the database instance
   */
  public getDb<T = any>(): T {
    if (!this.provider) {
      throw new Error('Database service not initialized');
    }

    return this.provider.getDb();
  }

  /**
   * Get the database schema
   */
  public getSchema(): any {
    if (!this.provider) {
      throw new Error('Database service not initialized');
    }

    return this.provider.getSchema();
  }

  /**
   * Close the database connection
   */
  public async close(): Promise<void> {
    if (this.provider) {
      await this.provider.close();
      this.provider = null;
      this.initialized = false;
      console.log('Database service closed');
    }
  }
}

// Export the database service singleton
export const databaseService = DatabaseService.getInstance();

// Export a convenience function to get the database instance
export function getDb<T = any>(): T {
  return databaseService.getDb<T>();
}

// Export a convenience function to get the database schema
export function getSchema(): any {
  return databaseService.getSchema();
}
