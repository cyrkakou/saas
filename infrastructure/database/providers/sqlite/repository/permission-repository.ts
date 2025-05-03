import { eq } from 'drizzle-orm';
import { PermissionRepository } from '@/core/domain/repositories/permission-repository.interface';
import { Permission, CreatePermissionInput, UpdatePermissionInput } from '@/core/domain/entities/permission';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLitePermissionRepository implements PermissionRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Permission | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.permissions).where(eq(schema.permissions.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.permissions).where(eq(schema.permissions.name, name)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.permissions).where(eq(schema.permissions.resource, resource));
  }

  async findAll(): Promise<Permission[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.permissions);
  }

  async create(data: CreatePermissionInput): Promise<Permission> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    const result = await db.insert(schema.permissions).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdatePermissionInput): Promise<Permission> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db
      .update(schema.permissions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.permissions.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.delete(schema.permissions).where(eq(schema.permissions.id, id)).returning();
    return result.length > 0;
  }
}
