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
    return result.length > 0 ? result[0] as Organization : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.organizations).where(eq(schema.organizations.name, name)).limit(1);
    return result.length > 0 ? result[0] as Organization : null;
  }

  async findAll(): Promise<Organization[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.organizations) as Organization[];
  }

  async create(data: CreateOrganizationInput): Promise<Organization> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.organizations).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Organization object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Organization;
  }

  async update(id: string, data: UpdateOrganizationInput): Promise<Organization> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.organizations)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.organizations.id, id));

    // Fetch the updated organization
    const result = await db.select().from(schema.organizations).where(eq(schema.organizations.id, id)).limit(1);
    return result.length > 0 ? result[0] as Organization : {
      ...data,
      id,
      updatedAt: now
    } as Organization;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the organization exists first
    const existingOrg = await db.select().from(schema.organizations).where(eq(schema.organizations.id, id)).limit(1);
    const exists = existingOrg.length > 0;

    // Delete the organization
    await db.delete(schema.organizations).where(eq(schema.organizations.id, id));

    // Return true if the organization existed before deletion
    return exists;
  }
}
