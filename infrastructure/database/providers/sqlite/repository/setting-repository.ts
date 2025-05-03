import { eq } from 'drizzle-orm';
import { SettingRepository } from '@/core/domain/repositories/setting-repository.interface';
import { Setting, CreateSettingInput, UpdateSettingInput } from '@/core/domain/entities/setting';
import { createId } from '@paralleldrive/cuid2';
import { SQLiteProvider } from '../sqlite-provider';

export class SQLiteSettingRepository implements SettingRepository {
  private provider: SQLiteProvider;

  constructor(provider: SQLiteProvider) {
    this.provider = provider;
  }

  async findById(id: string): Promise<Setting | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.settings).where(eq(schema.settings.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findByKey(key: string): Promise<Setting | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async findAll(): Promise<Setting[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.settings);
  }

  async findPublic(): Promise<Setting[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.settings).where(eq(schema.settings.isPublic, 1));
  }

  async create(data: CreateSettingInput): Promise<Setting> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    const result = await db.insert(schema.settings).values({
      ...data,
      id: createId(),
      createdAt: now,
      updatedAt: now
    }).returning();
    return result[0];
  }

  async update(id: string, data: UpdateSettingInput): Promise<Setting> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db
      .update(schema.settings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.settings.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.delete(schema.settings).where(eq(schema.settings.id, id)).returning();
    return result.length > 0;
  }
}
