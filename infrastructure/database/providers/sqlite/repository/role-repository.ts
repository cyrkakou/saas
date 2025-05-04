import { eq, and, inArray } from 'drizzle-orm';
import { RoleRepository } from '@/core/domain/repositories/role-repository.interface';
import { Role, CreateRoleInput, UpdateRoleInput } from '@/core/domain/entities/role';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteRoleRepository implements RoleRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Role | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.roles).where(eq(schema.roles.id, id)).limit(1);
    return result.length > 0 ? result[0] as Role : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.roles).where(eq(schema.roles.name, name)).limit(1);
    return result.length > 0 ? result[0] as Role : null;
  }

  async findAll(): Promise<Role[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.roles) as Role[];
  }

  async create(data: CreateRoleInput): Promise<Role> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.roles).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Role object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Role;
  }

  async update(id: string, data: UpdateRoleInput): Promise<Role> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.roles)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.roles.id, id));

    // Fetch the updated role
    const result = await db.select().from(schema.roles).where(eq(schema.roles.id, id)).limit(1);
    return result.length > 0 ? result[0] as Role : {
      ...data,
      id,
      updatedAt: now
    } as Role;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the role exists first
    const existingRole = await db.select().from(schema.roles).where(eq(schema.roles.id, id)).limit(1);
    const exists = existingRole.length > 0;

    // Delete the role
    await db.delete(schema.roles).where(eq(schema.roles.id, id));

    // Return true if the role existed before deletion
    return exists;
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();

    // First, check if the role exists
    const role = await this.findById(roleId);
    if (!role) {
      return false;
    }

    // Insert the role-permission relationships
    const values = permissionIds.map(permissionId => ({
      roleId,
      permissionId
    }));

    try {
      await db.insert(schema.rolePermissions).values(values);
      return true;
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      return false;
    }
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();

    try {
      await db.delete(schema.rolePermissions)
        .where(
          and(
            eq(schema.rolePermissions.roleId, roleId),
            inArray(schema.rolePermissions.permissionId, permissionIds)
          )
        );
      return true;
    } catch (error) {
      console.error('Error removing permissions from role:', error);
      return false;
    }
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();

    const result = await db.select({ permissionId: schema.rolePermissions.permissionId })
      .from(schema.rolePermissions)
      .where(eq(schema.rolePermissions.roleId, roleId));

    return result.map(row => row.permissionId);
  }
}
