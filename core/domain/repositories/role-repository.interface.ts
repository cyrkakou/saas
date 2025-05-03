import { Role, CreateRoleInput, UpdateRoleInput } from '../entities/role';

/**
 * Role repository interface
 */
export interface RoleRepository {
  /**
   * Find a role by ID
   */
  findById(id: string): Promise<Role | null>;

  /**
   * Find a role by name
   */
  findByName(name: string): Promise<Role | null>;

  /**
   * Find all roles
   */
  findAll(): Promise<Role[]>;

  /**
   * Create a new role
   */
  create(data: CreateRoleInput): Promise<Role>;

  /**
   * Update a role
   */
  update(id: string, data: UpdateRoleInput): Promise<Role>;

  /**
   * Delete a role
   */
  delete(id: string): Promise<boolean>;

  /**
   * Assign permissions to a role
   */
  assignPermissions(roleId: string, permissionIds: string[]): Promise<boolean>;

  /**
   * Remove permissions from a role
   */
  removePermissions(roleId: string, permissionIds: string[]): Promise<boolean>;

  /**
   * Get permissions for a role
   */
  getPermissions(roleId: string): Promise<string[]>;
}
