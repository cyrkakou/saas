import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { users } from '../drizzle/schema';
import { UserRepository } from '@/core/domain/repositories/user-repository.interface';
import { User, CreateUserInput, UpdateUserInput } from '@/core/domain/entities/user';
import crypto from 'crypto';

export class SQLiteUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async create(data: CreateUserInput): Promise<User> {
    const now = new Date();
    const result = await db.insert(users).values({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }
}
