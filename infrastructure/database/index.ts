// Export database service
export { databaseService, getDb, getSchema } from './database-service';

// Export database initialization
export { initializeDatabase } from './init-db';

// Export repository factory
export {
  repositoryFactory,
  getUserRepository,
  getSubscriptionRepository,
  getAuditLogRepository,
} from './repositories/repository-factory';

// Export database provider interfaces
export {
  DatabaseProvider,
  DatabaseProviderType,
  DatabaseConfig,
} from './providers/database-provider.interface';

// Export database provider factory
export {
  createDatabaseProvider,
  loadDatabaseConfig,
} from './providers/database-provider-factory';
