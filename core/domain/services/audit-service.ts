import { AuditLog, CreateAuditLogInput, AuditAction, EntityType } from '../entities/audit-log';
import { AuditLogRepository } from '../repositories/audit-log-repository.interface';

export interface AuditService {
  logAction(data: CreateAuditLogInput): Promise<AuditLog>;
  logUserAction(
    userId: string, 
    action: AuditAction, 
    entityType: EntityType, 
    entityId?: string, 
    details?: any, 
    ipAddress?: string
  ): Promise<AuditLog>;
  getUserActivityLogs(userId: string): Promise<AuditLog[]>;
  getEntityLogs(entityId: string): Promise<AuditLog[]>;
}

export class DefaultAuditService implements AuditService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async logAction(data: CreateAuditLogInput): Promise<AuditLog> {
    return await this.auditLogRepository.create(data);
  }

  async logUserAction(
    userId: string, 
    action: AuditAction, 
    entityType: EntityType, 
    entityId?: string, 
    details?: any, 
    ipAddress?: string
  ): Promise<AuditLog> {
    const detailsString = details ? JSON.stringify(details) : undefined;
    
    return await this.auditLogRepository.create({
      userId,
      action,
      entityType,
      entityId,
      details: detailsString,
      ipAddress
    });
  }

  async getUserActivityLogs(userId: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.findByUserId(userId);
  }

  async getEntityLogs(entityId: string): Promise<AuditLog[]> {
    return await this.auditLogRepository.findByEntityId(entityId);
  }
}
