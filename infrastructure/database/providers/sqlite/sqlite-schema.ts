import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { AuditAction, EntityType } from '@/core/domain/entities/audit-log';

// Roles table
export const roles = sqliteTable('roles', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Permissions table
export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull().unique(),
  description: text('description'),
  resource: text('resource').notNull(),
  action: text('action', { enum: ['create', 'read', 'update', 'delete', 'manage'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Role permissions junction table
export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  };
});

// Organizations table
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  logo: text('logo'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  password: text('password').notNull(),
  roleId: text('role_id').references(() => roles.id),
  organizationId: text('organization_id').references(() => organizations.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan', { enum: ['free', 'basic', 'premium'] }).default('free').notNull(),
  status: text('status', { enum: ['active', 'canceled', 'expired'] }).default('active').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Settings table
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Reports table
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['financial', 'usage', 'performance', 'custom'] }).notNull(),
  config: text('config').notNull(), // JSON configuration for the report
  createdById: text('created_by_id').references(() => users.id),
  organizationId: text('organization_id').references(() => organizations.id),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Audit logs table
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action', { enum: Object.values(AuditAction) }).notNull(),
  entityType: text('entity_type', { enum: Object.values(EntityType) }).notNull(),
  entityId: text('entity_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  organizationId: text('organization_id').references(() => organizations.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
