// Export database service
export { databaseService, getDb, getSchema } from './core/database-service';

// Export database initialization
export { initializeDatabase } from './init-db';

// Export repository factory
export {
  repositoryFactory,
  getUserRepository,
  getSubscriptionRepository,
  getAuditLogRepository,
  getRoleRepository,
  getPermissionRepository,
  getOrganizationRepository,
  getSettingRepository,
  getReportRepository,
} from './core/repository-factory';

// Export database provider interfaces
export type {
  DatabaseProvider,
  DatabaseProviderType,
  DatabaseConfig,
} from './core/interfaces/database-provider.interface';

// Export database provider factory
export {
  createDatabaseProvider,
  loadDatabaseConfig,
} from './core/factory';

// Export abstract database provider
export { AbstractDatabaseProvider } from './core/abstract-database-provider';

// Export SQLite provider
export { SQLiteProvider } from './providers/sqlite/sqlite-provider';

// Export MySQL provider
export { MySQLProvider } from './providers/mysql/mysql-provider';

// Export PostgreSQL provider
export { PostgresProvider } from './providers/postgres/postgres-provider';
