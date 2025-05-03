import { UserRepository } from '@/core/domain/repositories/user-repository.interface';
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository.interface';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log-repository.interface';
import { RoleRepository } from '@/core/domain/repositories/role-repository.interface';
import { PermissionRepository } from '@/core/domain/repositories/permission-repository.interface';
import { OrganizationRepository } from '@/core/domain/repositories/organization-repository.interface';
import { SettingRepository } from '@/core/domain/repositories/setting-repository.interface';
import { ReportRepository } from '@/core/domain/repositories/report-repository.interface';
import { databaseService } from './database-service';
import { DatabaseProviderType } from './interfaces/database-provider.interface';
import { initializeDatabase } from '@/lib/db-init';
import { SQLiteProvider } from '../providers/sqlite/sqlite-provider';

/**
 * Repository factory
 * This factory creates repository instances based on the current database provider
 */
class RepositoryFactory {
  private static instance: RepositoryFactory;
  private userRepository: UserRepository | null = null;
  private subscriptionRepository: SubscriptionRepository | null = null;
  private auditLogRepository: AuditLogRepository | null = null;
  private roleRepository: RoleRepository | null = null;
  private permissionRepository: PermissionRepository | null = null;
  private organizationRepository: OrganizationRepository | null = null;
  private settingRepository: SettingRepository | null = null;
  private reportRepository: ReportRepository | null = null;
  private providerType: DatabaseProviderType | null = null;

  private constructor() {}

  /**
   * Get the repository factory instance
   */
  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  /**
   * Get the user repository
   */
  public async getUserRepository(): Promise<UserRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.userRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      // In the future, implement MySQL and PostgreSQL repositories
      const { SQLiteUserRepository } = await import('../providers/sqlite/repository/user-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.userRepository = new SQLiteUserRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.userRepository;
  }

  /**
   * Get the subscription repository
   */
  public async getSubscriptionRepository(): Promise<SubscriptionRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.subscriptionRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      // In the future, implement MySQL and PostgreSQL repositories
      const { SQLiteSubscriptionRepository } = await import('../providers/sqlite/repository/subscription-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.subscriptionRepository = new SQLiteSubscriptionRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.subscriptionRepository;
  }

  /**
   * Get the audit log repository
   */
  public async getAuditLogRepository(): Promise<AuditLogRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.auditLogRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // Dynamically import the appropriate repository
      switch (providerType) {
        case 'sqlite':
          const { SQLiteAuditLogRepository } = await import('../providers/sqlite/repository/audit-log-repository');

          // Create a wrapper SQLiteProvider that has the required methods
          const sqliteProvider = {
            getDb: () => databaseService.getDb(),
            getSchema: () => databaseService.getSchema()
          } as SQLiteProvider;

          this.auditLogRepository = new SQLiteAuditLogRepository(sqliteProvider);
          break;
        case 'mysql':
          const { MySQLAuditLogRepository } = await import('../providers/mysql/repository/audit-log-repository');

          // Create a wrapper MySQLProvider that has the required methods
          const mysqlProvider = {
            getDb: () => databaseService.getDb(),
            getSchema: () => databaseService.getSchema()
          } as any; // Use appropriate type when implemented

          this.auditLogRepository = new MySQLAuditLogRepository(mysqlProvider);
          break;
        case 'postgres':
          const { PostgresAuditLogRepository } = await import('../providers/postgres/repository/audit-log-repository');

          // Create a wrapper PostgresProvider that has the required methods
          const postgresProvider = {
            getDb: () => databaseService.getDb(),
            getSchema: () => databaseService.getSchema()
          } as any; // Use appropriate type when implemented

          this.auditLogRepository = new PostgresAuditLogRepository(postgresProvider);
          break;
        default:
          throw new Error(`Unsupported database provider type: ${providerType}`);
      }

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.auditLogRepository;
  }

  /**
   * Get the role repository
   */
  public async getRoleRepository(): Promise<RoleRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.roleRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      const { SQLiteRoleRepository } = await import('../providers/sqlite/repository/role-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.roleRepository = new SQLiteRoleRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.roleRepository;
  }

  /**
   * Get the permission repository
   */
  public async getPermissionRepository(): Promise<PermissionRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.permissionRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      const { SQLitePermissionRepository } = await import('../providers/sqlite/repository/permission-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.permissionRepository = new SQLitePermissionRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.permissionRepository;
  }

  /**
   * Get the organization repository
   */
  public async getOrganizationRepository(): Promise<OrganizationRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.organizationRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      const { SQLiteOrganizationRepository } = await import('../providers/sqlite/repository/organization-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.organizationRepository = new SQLiteOrganizationRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.organizationRepository;
  }

  /**
   * Get the setting repository
   */
  public async getSettingRepository(): Promise<SettingRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.settingRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      const { SQLiteSettingRepository } = await import('../providers/sqlite/repository/setting-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.settingRepository = new SQLiteSettingRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.settingRepository;
  }

  /**
   * Get the report repository
   */
  public async getReportRepository(): Promise<ReportRepository> {
    // Ensure database is initialized before accessing it
    await initializeDatabase();

    // Check if we need to create a new repository
    if (!this.reportRepository || this.providerTypeChanged()) {
      const providerType = this.getCurrentProviderType();

      // For now, use SQLite repository for all provider types
      const { SQLiteReportRepository } = await import('../providers/sqlite/repository/report-repository');

      // Create a wrapper SQLiteProvider that has the required methods
      const sqliteProvider = {
        getDb: () => databaseService.getDb(),
        getSchema: () => databaseService.getSchema()
      } as SQLiteProvider;

      this.reportRepository = new SQLiteReportRepository(sqliteProvider);

      // Update the current provider type
      this.providerType = providerType;
    }

    return this.reportRepository;
  }

  /**
   * Check if the provider type has changed
   */
  private providerTypeChanged(): boolean {
    return this.providerType !== this.getCurrentProviderType();
  }

  /**
   * Get the current provider type
   */
  private getCurrentProviderType(): DatabaseProviderType {
    return process.env.DATABASE_PROVIDER as DatabaseProviderType || 'sqlite';
  }

  /**
   * Reset all repositories
   * This is useful for testing
   */
  public reset(): void {
    this.userRepository = null;
    this.subscriptionRepository = null;
    this.auditLogRepository = null;
    this.roleRepository = null;
    this.permissionRepository = null;
    this.organizationRepository = null;
    this.settingRepository = null;
    this.reportRepository = null;
    this.providerType = null;
  }
}

// Export the repository factory singleton
export const repositoryFactory = RepositoryFactory.getInstance();

// Export convenience functions to get repositories
export async function getUserRepository(): Promise<UserRepository> {
  return await repositoryFactory.getUserRepository();
}

export async function getSubscriptionRepository(): Promise<SubscriptionRepository> {
  return await repositoryFactory.getSubscriptionRepository();
}

export async function getAuditLogRepository(): Promise<AuditLogRepository> {
  return await repositoryFactory.getAuditLogRepository();
}

export async function getRoleRepository(): Promise<RoleRepository> {
  return await repositoryFactory.getRoleRepository();
}

export async function getPermissionRepository(): Promise<PermissionRepository> {
  return await repositoryFactory.getPermissionRepository();
}

export async function getOrganizationRepository(): Promise<OrganizationRepository> {
  return await repositoryFactory.getOrganizationRepository();
}

export async function getSettingRepository(): Promise<SettingRepository> {
  return await repositoryFactory.getSettingRepository();
}

export async function getReportRepository(): Promise<ReportRepository> {
  return await repositoryFactory.getReportRepository();
}
