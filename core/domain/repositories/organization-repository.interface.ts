import { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '../entities/organization';

/**
 * Organization repository interface
 */
export interface OrganizationRepository {
  /**
   * Find an organization by ID
   */
  findById(id: string): Promise<Organization | null>;

  /**
   * Find an organization by name
   */
  findByName(name: string): Promise<Organization | null>;

  /**
   * Find all organizations
   */
  findAll(): Promise<Organization[]>;

  /**
   * Create a new organization
   */
  create(data: CreateOrganizationInput): Promise<Organization>;

  /**
   * Update an organization
   */
  update(id: string, data: UpdateOrganizationInput): Promise<Organization>;

  /**
   * Delete an organization
   */
  delete(id: string): Promise<boolean>;
}
