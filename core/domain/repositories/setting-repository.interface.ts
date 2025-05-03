import { Setting, CreateSettingInput, UpdateSettingInput } from '../entities/setting';

/**
 * Setting repository interface
 */
export interface SettingRepository {
  /**
   * Find a setting by ID
   */
  findById(id: string): Promise<Setting | null>;

  /**
   * Find a setting by key
   */
  findByKey(key: string): Promise<Setting | null>;

  /**
   * Find all settings
   */
  findAll(): Promise<Setting[]>;

  /**
   * Find all public settings
   */
  findPublic(): Promise<Setting[]>;

  /**
   * Create a new setting
   */
  create(data: CreateSettingInput): Promise<Setting>;

  /**
   * Update a setting
   */
  update(id: string, data: UpdateSettingInput): Promise<Setting>;

  /**
   * Delete a setting
   */
  delete(id: string): Promise<boolean>;
}
