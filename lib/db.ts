import { databaseService } from '@/infrastructure/database';

// Initialize the database service
export async function initDb() {
  try {
    await databaseService.initialize();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Get the database instance
export function getDb<T = any>() {
  return databaseService.getDb<T>();
}

// Get the database schema
export function getSchema() {
  return databaseService.getSchema();
}
