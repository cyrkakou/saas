import { z } from 'zod';

// Setting entity schema
export const SettingSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1),
  value: z.string(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Setting entity type
export type Setting = z.infer<typeof SettingSchema>;

// Create setting input schema
export const CreateSettingSchema = SettingSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateSettingInput = z.infer<typeof CreateSettingSchema>;

// Update setting input schema
export const UpdateSettingSchema = SettingSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type UpdateSettingInput = z.infer<typeof UpdateSettingSchema>;
