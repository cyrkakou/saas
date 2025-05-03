import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Create a database adapter interface for the strategy pattern
export interface DatabaseAdapter {
  getDb(): any;
  getSchema(): typeof schema;
}

// SQLite adapter implementation
export class SQLiteAdapter implements DatabaseAdapter {
  private db: any;

  constructor() {
    const sqlite = new Database('sqlite.db');

    // Create tables if they don't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'active',
        start_date INTEGER NOT NULL,
        end_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        details TEXT,
        ip_address TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    this.db = drizzle(sqlite, { schema });
  }

  getDb() {
    return this.db;
  }

  getSchema() {
    return schema;
  }
}

// Factory function to create the appropriate database adapter
export function createDatabaseAdapter(type: 'sqlite' | 'mysql' | 'postgres' = 'sqlite'): DatabaseAdapter {
  switch (type) {
    case 'sqlite':
      return new SQLiteAdapter();
    case 'mysql':
      // MySQL adapter would be implemented here
      throw new Error('MySQL adapter not implemented yet');
    case 'postgres':
      // PostgreSQL adapter would be implemented here
      throw new Error('PostgreSQL adapter not implemented yet');
    default:
      return new SQLiteAdapter();
  }
}

// Export a singleton instance of the database
export const db = createDatabaseAdapter('sqlite').getDb();
