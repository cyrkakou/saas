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
    return result.length > 0 ? result[0] as Permission : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.permissions).where(eq(schema.permissions.name, name)).limit(1);
    return result.length > 0 ? result[0] as Permission : null;
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.permissions).where(eq(schema.permissions.resource, resource)) as Permission[];
  }

  async findAll(): Promise<Permission[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.permissions) as Permission[];
  }

  async create(data: CreatePermissionInput): Promise<Permission> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.permissions).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Permission object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Permission;
  }

  async update(id: string, data: UpdatePermissionInput): Promise<Permission> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.permissions)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.permissions.id, id));

    // Fetch the updated permission
    const result = await db.select().from(schema.permissions).where(eq(schema.permissions.id, id)).limit(1);
    return result.length > 0 ? result[0] as Permission : {
      ...data,
      id,
      updatedAt: now
    } as Permission;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the permission exists first
    const existingPerm = await db.select().from(schema.permissions).where(eq(schema.permissions.id, id)).limit(1);
    const exists = existingPerm.length > 0;

    // Delete the permission
    await db.delete(schema.permissions).where(eq(schema.permissions.id, id));

    // Return true if the permission existed before deletion
    return exists;
  }
}
