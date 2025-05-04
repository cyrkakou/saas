import { eq } from 'drizzle-orm';
import { UserRepository } from '@/core/domain/repositories/user-repository.interface';
import { User, CreateUserInput, UpdateUserInput } from '@/core/domain/entities/user';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteUserRepository implements UserRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<User | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result.length > 0 ? result[0] as User : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result.length > 0 ? result[0] as User : null;
  }

  async findAll(): Promise<User[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.users) as User[];
  }

  async create(data: CreateUserInput): Promise<User> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.users).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic User object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as User;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.users)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.users.id, id));

    // Fetch the updated user
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result.length > 0 ? result[0] as User : {
      ...data,
      id,
      updatedAt: now
    } as User;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the user exists first
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    const exists = existingUser.length > 0;

    // Delete the user
    await db.delete(schema.users).where(eq(schema.users.id, id));

    // Return true if the user existed before deletion
    return exists;
  }
}
