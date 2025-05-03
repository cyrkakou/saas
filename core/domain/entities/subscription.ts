import { z } from 'zod';

// Subscription entity schema
export const SubscriptionSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  plan: z.enum(['free', 'basic', 'premium']).default('free'),
  status: z.enum(['active', 'canceled', 'expired']).default('active'),
  startDate: z.date(),
  endDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Subscription entity type
export type Subscription = z.infer<typeof SubscriptionSchema>;

// Create subscription input schema
export const CreateSubscriptionSchema = SubscriptionSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;

// Update subscription input schema
export const UpdateSubscriptionSchema = SubscriptionSchema.partial().omit({ 
  id: true, 
  userId: true,
  createdAt: true, 
  updatedAt: true 
});

export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
