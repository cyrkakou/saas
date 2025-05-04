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
    return result.length > 0 ? result[0] as Setting : null;
  }

  async findByKey(key: string): Promise<Setting | null> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const result = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
    return result.length > 0 ? result[0] as Setting : null;
  }

  async findAll(): Promise<Setting[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.settings) as Setting[];
  }

  async findPublic(): Promise<Setting[]> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    return await db.select().from(schema.settings).where(eq(schema.settings.isPublic, 1)) as Setting[];
  }

  async create(data: CreateSettingInput): Promise<Setting> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    const now = new Date();
    // SQLite doesn't support returning, so we need to insert and then fetch
    const id = createId();
    await db.insert(schema.settings).values({
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    });

    // Return a basic Setting object
    return {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as Setting;
  }

  async update(id: string, data: UpdateSettingInput): Promise<Setting> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to update and then fetch
    const now = new Date();
    await db
      .update(schema.settings)
      .set({ ...data, updatedAt: now })
      .where(eq(schema.settings.id, id));

    // Fetch the updated setting
    const result = await db.select().from(schema.settings).where(eq(schema.settings.id, id)).limit(1);
    return result.length > 0 ? result[0] as Setting : {
      ...data,
      id,
      updatedAt: now
    } as Setting;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.provider.getDb();
    const schema = this.provider.getSchema();
    // SQLite doesn't support returning, so we need to check if the setting exists first
    const existingSetting = await db.select().from(schema.settings).where(eq(schema.settings.id, id)).limit(1);
    const exists = existingSetting.length > 0;

    // Delete the setting
    await db.delete(schema.settings).where(eq(schema.settings.id, id));

    // Return true if the setting existed before deletion
    return exists;
  }
}
