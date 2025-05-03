import { Permission, CreatePermissionInput, UpdatePermissionInput } from '../entities/permission';

/**
 * Permission repository interface
 */
export interface PermissionRepository {
  /**
   * Find a permission by ID
   */
  findById(id: string): Promise<Permission | null>;

  /**
   * Find a permission by name
   */
  findByName(name: string): Promise<Permission | null>;

  /**
   * Find permissions by resource
   */
  findByResource(resource: string): Promise<Permission[]>;

  /**
   * Find all permissions
   */
  findAll(): Promise<Permission[]>;

  /**
   * Create a new permission
   */
  create(data: CreatePermissionInput): Promise<Permission>;

  /**
   * Update a permission
   */
  update(id: string, data: UpdatePermissionInput): Promise<Permission>;

  /**
   * Delete a permission
   */
  delete(id: string): Promise<boolean>;
}
