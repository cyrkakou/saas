import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { AbstractDatabaseProvider } from '../../core/abstract-database-provider';
import { DatabaseConfig } from '../../core/interfaces/database-provider.interface';
import * as mysqlSchema from './mysql-schema';
import path from 'path';

/**
 * MySQL database provider
 */
export class MySQLProvider extends AbstractDatabaseProvider<ReturnType<typeof drizzle>> {
  private connection: mysql.Pool | null = null;

  constructor(config: DatabaseConfig) {
    super(config);
    this.schema = mysqlSchema;
  }

  /**
   * Initialize the MySQL database
   */
  async initialize(): Promise<void> {
    try {
      // Create the connection pool
      this.connection = mysql.createPool({
        host: this.config.host || 'localhost',
        port: this.config.port || 3306,
        user: this.config.username,
        password: this.config.password,
        database: this.config.database,
        ssl: this.config.ssl ? { rejectUnauthorized: true } : undefined,
        connectionLimit: 10,
      });

      // Create the Drizzle ORM instance
      this.db = drizzle(this.connection, { schema: this.schema });

      // Test the connection
      await this.connection.query('SELECT 1');
      console.log(`MySQL database connected to ${this.config.host}:${this.config.port}/${this.config.database}`);
    } catch (error) {
      console.error('Error initializing MySQL database:', error);
      throw error;
    }
  }

  /**
   * Run migrations for MySQL
   */
  async migrate(): Promise<void> {
    if (!this.db || !this.connection) {
      throw new Error('Database not initialized');
    }

    try {
      // Run migrations
      await migrate(this.db, {
        migrationsFolder: path.join(process.cwd(), 'infrastructure/database/providers/mysql/migrations'),
      });
      console.log('MySQL migrations completed');
    } catch (error) {
      console.error('Error running MySQL migrations:', error);
      throw error;
    }
  }

  /**
   * Close the MySQL database connection
   */
  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      this.db = null;
      console.log('MySQL database connection closed');
    }
  }
}
