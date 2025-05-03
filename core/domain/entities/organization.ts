import { z } from 'zod';

// Organization entity schema
export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Organization entity type
export type Organization = z.infer<typeof OrganizationSchema>;

// Create organization input schema
export const CreateOrganizationSchema = OrganizationSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

// Update organization input schema
export const UpdateOrganizationSchema = OrganizationSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>;
