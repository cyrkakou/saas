import { eq } from 'drizzle-orm';
import { ReportRepository } from '@/core/domain/repositories/report-repository.interface';
import { Report, CreateReportInput, UpdateReportInput, ReportType } from '@/core/domain/entities/report';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteReportRepository implements ReportRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Report | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.reports).where(eq(schema.reports.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByType(type: ReportType): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.type, type));
  }

  async findByOrganization(organizationId: string): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.organizationId, organizationId));
  }

  async findByCreator(userId: string): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.createdById, userId));
  }

  async findAll(): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports);
  }

  async findPublic(): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.isPublic, 1));
  }

  async create(data: CreateReportInput): Promise<Report> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    const result = await db.insert(schema.reports).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateReportInput): Promise<Report> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db
      .update(schema.reports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.reports.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.delete(schema.reports).where(eq(schema.reports.id, id)).returning();
    return result.length > 0;
  }
}
