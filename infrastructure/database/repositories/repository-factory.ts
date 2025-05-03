import { UserRepository } from '@/core/domain/repositories/user-repository.interface';
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository.interface';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log-repository.interface';
import { DrizzleUserRepository } from './user-repository';
import { DrizzleSubscriptionRepository } from './subscription-repository';
import { DrizzleAuditLogRepository } from './audit-log-repository';

/**
 * Repository factory
 * This factory creates repository instances based on the current database provider
 */
class RepositoryFactory {
  private static instance: RepositoryFactory;
  private userRepository: UserRepository | null = null;
  private subscriptionRepository: SubscriptionRepository | null = null;
  private auditLogRepository: AuditLogRepository | null = null;

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
  public getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new DrizzleUserRepository();
    }
    return this.userRepository;
  }

  /**
   * Get the subscription repository
   */
  public getSubscriptionRepository(): SubscriptionRepository {
    if (!this.subscriptionRepository) {
      this.subscriptionRepository = new DrizzleSubscriptionRepository();
    }
    return this.subscriptionRepository;
  }

  /**
   * Get the audit log repository
   */
  public getAuditLogRepository(): AuditLogRepository {
    if (!this.auditLogRepository) {
      this.auditLogRepository = new DrizzleAuditLogRepository();
    }
    return this.auditLogRepository;
  }

  /**
   * Reset all repositories
   * This is useful for testing
   */
  public reset(): void {
    this.userRepository = null;
    this.subscriptionRepository = null;
    this.auditLogRepository = null;
  }
}

// Export the repository factory singleton
export const repositoryFactory = RepositoryFactory.getInstance();

// Export convenience functions to get repositories
export function getUserRepository(): UserRepository {
  return repositoryFactory.getUserRepository();
}

export function getSubscriptionRepository(): SubscriptionRepository {
  return repositoryFactory.getSubscriptionRepository();
}

export function getAuditLogRepository(): AuditLogRepository {
  return repositoryFactory.getAuditLogRepository();
}
