import { eq } from 'drizzle-orm';
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository.interface';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '@/core/domain/entities/subscription';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteSubscriptionRepository implements SubscriptionRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Subscription | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id)).limit(1);
    return result.length > 0 ? result[0] as Subscription : null;
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] as Subscription : null;
  }

  async findAll(): Promise<Subscription[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.subscriptions) as Subscription[];
  }

  async create(data: CreateSubscriptionInput): Promise<Subscription> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.subscriptions).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Subscription object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Subscription;
  }

  async update(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.subscriptions)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.subscriptions.id, id));

    // Fetch the updated subscription
    const result = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id)).limit(1);
    return result.length > 0 ? result[0] as Subscription : {
      ...data,
      id,
      updatedAt: now
    } as Subscription;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the subscription exists first
    const existingSub = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id)).limit(1);
    const exists = existingSub.length > 0;

    // Delete the subscription
    await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, id));

    // Return true if the subscription existed before deletion
    return exists;
  }
}
