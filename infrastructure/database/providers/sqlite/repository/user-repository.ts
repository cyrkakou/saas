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
    return result.length > 0 ? result[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<User[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.users);
  }

  async create(data: CreateUserInput): Promise<User> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    const result = await db.insert(schema.users).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db
      .update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    return result.length > 0;
  }
}
