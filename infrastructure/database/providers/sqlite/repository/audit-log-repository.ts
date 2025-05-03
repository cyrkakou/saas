import { eq } from 'drizzle-orm';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log-repository.interface';
import { AuditLog, CreateAuditLogInput } from '@/core/domain/entities/audit-log';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteAuditLogRepository implements AuditLogRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<AuditLog | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.userId, userId));
  }

  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.entityId, entityId));
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<AuditLog[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select()
      .from(schema.auditLogs)
      .limit(limit)
      .offset(offset)
      .orderBy(schema.auditLogs.createdAt);
  }

  async create(data: CreateAuditLogInput): Promise<AuditLog> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.insert(schema.auditLogs).values({
      ...data,
      id: createId(),
      createdAt: new Date()
    }).returning();
    return result[0];
  }
}
