import { eq } from 'drizzle-orm';
import { getDb, getSchema } from '../database-service';
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository.interface';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '@/core/domain/entities/subscription';
import { createId } from '@paralleldrive/cuid2';

export class DrizzleSubscriptionRepository implements SubscriptionRepository {
  async findById(id: string): Promise<Subscription | null> {
    const db = getDb();
    const schema = getSchema();
    const result = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const db = getDb();
    const schema = getSchema();
    const result = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<Subscription[]> {
    const db = getDb();
    const schema = getSchema();
    return await db.select().from(schema.subscriptions);
  }

  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    const db = getDb();
    const schema = getSchema();
    const now = new Date();
    const result = await db.insert(schema.subscriptions).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
    const db = getDb();
    const schema = getSchema();
    const result = await db
      .update(schema.subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.subscriptions.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = getDb();
    const schema = getSchema();
    const result = await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, id)).returning();
    return result.length > 0;
  }
}
