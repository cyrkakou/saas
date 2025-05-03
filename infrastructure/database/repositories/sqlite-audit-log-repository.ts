import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { auditLogs } from '../drizzle/schema';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log-repository.interface';
import { AuditLog, CreateAuditLogInput } from '@/core/domain/entities/audit-log';
import crypto from 'crypto';

export class SQLiteAuditLogRepository implements AuditLogRepository {
  async findById(id: string): Promise<AuditLog | null> {
    const result = await db.select().from(auditLogs).where(eq(auditLogs.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.userId, userId));
  }

  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.entityId, entityId));
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<AuditLog[]> {
    return await db.select()
      .from(auditLogs)
      .limit(limit)
      .offset(offset)
      .orderBy(auditLogs.createdAt);
  }

  async create(data: CreateAuditLogInput): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }).returning();
    return result[0];
  }
}
