import { databaseService } from '@/infrastructure/database/core/database-service';

// Flag to track initialization status
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize the database service
 * This function ensures the database is initialized only once
 */
export async function initializeDatabase(): Promise<void> {
  // If already initialized, return immediately
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it to complete
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('Initializing database service...');
      await databaseService.initialize();
      console.log('Database service initialized successfully');
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database service:', error);
      // Reset the promise so we can try again
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

// Initialize the database when this module is imported
// This ensures the database is initialized as early as possible
if (typeof window === 'undefined') {
  // Only run on the server side
  initializeDatabase().catch(error => {
    console.error('Database initialization failed:', error);
  });
}
