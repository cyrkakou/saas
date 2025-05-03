import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { subscriptions } from '../drizzle/schema';
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository.interface';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '@/core/domain/entities/subscription';
import crypto from 'crypto';

export class SQLiteSubscriptionRepository implements SubscriptionRepository {
  async findById(id: string): Promise<Subscription | null> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<Subscription[]> {
    return await db.select().from(subscriptions);
  }

  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    const now = new Date();
    const result = await db.insert(subscriptions).values({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
    const result = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning();
    return result.length > 0;
  }
}
