import { z } from 'zod';

// Audit log action types
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  FAILED_LOGIN = 'FAILED_LOGIN',
}

// Entity types that can be audited
export enum EntityType {
  USER = 'USER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM',
}

// Audit log entity schema
export const AuditLogSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(), // Optional because system actions might not have a user
  action: z.nativeEnum(AuditAction),
  entityType: z.nativeEnum(EntityType),
  entityId: z.string().optional(), // Optional because some actions might not target a specific entity
  details: z.string().optional(), // JSON string with additional details
  ipAddress: z.string().optional(),
  createdAt: z.date().optional(),
});

// Audit log entity type
export type AuditLog = z.infer<typeof AuditLogSchema>;

// Create audit log input schema
export const CreateAuditLogSchema = AuditLogSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
