import { z } from 'zod';

// User entity schema
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User entity type
export type User = z.infer<typeof UserSchema>;

// Create user input schema
export const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Update user input schema
export const UpdateUserSchema = UserSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
