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
    return result.length > 0 ? result[0] as Report : null;
  }

  async findByType(type: ReportType): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.type, type)) as Report[];
  }

  async findByOrganization(organizationId: string): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.organizationId, organizationId)) as Report[];
  }

  async findByCreator(userId: string): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.createdById, userId)) as Report[];
  }

  async findAll(): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports) as Report[];
  }

  async findPublic(): Promise<Report[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.reports).where(eq(schema.reports.isPublic, 1)) as Report[];
  }

  async create(data: CreateReportInput): Promise<Report> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.reports).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Report object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Report;
  }

  async update(id: string, data: UpdateReportInput): Promise<Report> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.reports)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.reports.id, id));

    // Fetch the updated report
    const result = await db.select().from(schema.reports).where(eq(schema.reports.id, id)).limit(1);
    return result.length > 0 ? result[0] as Report : {
      ...data,
      id,
      updatedAt: now
    } as Report;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the report exists first
    const existingReport = await db.select().from(schema.reports).where(eq(schema.reports.id, id)).limit(1);
    const exists = existingReport.length > 0;

    // Delete the report
    await db.delete(schema.reports).where(eq(schema.reports.id, id));

    // Return true if the report existed before deletion
    return exists;
  }
}
