import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { AbstractDatabaseProvider } from '../../core/abstract-database-provider';
import { DatabaseConfig } from '../../core/interfaces/database-provider.interface';
import * as sqliteSchema from './sqlite-schema';
import path from 'path';
import fs from 'fs';

/**
 * SQLite database provider
 */
export class SQLiteProvider extends AbstractDatabaseProvider<ReturnType<typeof drizzle>> {
  private sqlite: Database.Database | null = null;

  constructor(config: DatabaseConfig) {
    super(config);
    this.schema = sqliteSchema;
  }

  /**
   * Initialize the SQLite database
   */
  async initialize(): Promise<void> {
    try {
      // Get the database file path
      const filePath = this.config.filePath || 'sqlite.db';
      
      // Create the directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create the SQLite database
      this.sqlite = new Database(filePath);

      // Create the Drizzle ORM instance
      this.db = drizzle(this.sqlite, { schema: this.schema });

      console.log(`SQLite database connected to ${filePath}`);
    } catch (error) {
      console.error('Error initializing SQLite database:', error);
      throw error;
    }
  }

  /**
   * Run migrations for SQLite
   */
  async migrate(): Promise<void> {
    if (!this.db || !this.sqlite) {
      throw new Error('Database not initialized');
    }

    try {
      // Run migrations
      await migrate(this.db, {
        migrationsFolder: path.join(process.cwd(), 'infrastructure/database/providers/sqlite/migrations'),
      });
      console.log('SQLite migrations completed');
    } catch (error) {
      console.error('Error running SQLite migrations:', error);
      throw error;
    }
  }

  /**
   * Close the SQLite database connection
   */
  async close(): Promise<void> {
    if (this.sqlite) {
      this.sqlite.close();
      this.sqlite = null;
      this.db = null;
      console.log('SQLite database connection closed');
    }
  }
}
