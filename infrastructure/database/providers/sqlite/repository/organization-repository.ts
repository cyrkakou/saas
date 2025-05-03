import { eq } from 'drizzle-orm';
import { OrganizationRepository } from '@/core/domain/repositories/organization-repository.interface';
import { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/core/domain/entities/organization';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteOrganizationRepository implements OrganizationRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Organization | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.organizations).where(eq(schema.organizations.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.organizations).where(eq(schema.organizations.name, name)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<Organization[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.organizations);
  }

  async create(data: CreateOrganizationInput): Promise<Organization> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    const result = await db.insert(schema.organizations).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateOrganizationInput): Promise<Organization> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db
      .update(schema.organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.organizations.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.delete(schema.organizations).where(eq(schema.organizations.id, id)).returning();
    return result.length > 0;
  }
}
