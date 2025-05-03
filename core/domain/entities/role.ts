import { z } from 'zod';

// Role entity schema
export const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Role entity type
export type Role = z.infer<typeof RoleSchema>;

// Create role input schema
export const CreateRoleSchema = RoleSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;

// Update role input schema
export const UpdateRoleSchema = RoleSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;

// Role with permissions schema
export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(z.string()).optional(),
});

export type RoleWithPermissions = z.infer<typeof RoleWithPermissionsSchema>;
