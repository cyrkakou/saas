import { AuditLog, CreateAuditLogInput } from '../entities/audit-log';

export interface AuditLogRepository {
  findById(id: string): Promise<AuditLog | null>;
  findByUserId(userId: string): Promise<AuditLog[]>;
  findByEntityId(entityId: string): Promise<AuditLog[]>;
  findAll(limit?: number, offset?: number): Promise<AuditLog[]>;
  create(data: CreateAuditLogInput): Promise<AuditLog>;
}
