import { databaseService } from './core/database-service';

/**
 * Initialize the database
 * This function initializes the database and runs migrations
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Initialize the database service
    await databaseService.initialize();

    // Run migrations
    await databaseService.migrate();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// If this script is run directly, initialize the database
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
