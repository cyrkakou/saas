import { z } from 'zod';

// Permission action enum
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

// Permission entity schema
export const PermissionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  resource: z.string().min(1),
  action: z.enum([
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
    PermissionAction.MANAGE,
  ]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Permission entity type
export type Permission = z.infer<typeof PermissionSchema>;

// Create permission input schema
export const CreatePermissionSchema = PermissionSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreatePermissionInput = z.infer<typeof CreatePermissionSchema>;

// Update permission input schema
export const UpdatePermissionSchema = PermissionSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type UpdatePermissionInput = z.infer<typeof UpdatePermissionSchema>;
