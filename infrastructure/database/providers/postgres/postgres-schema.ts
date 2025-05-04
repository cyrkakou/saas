import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { AuditAction, EntityType } from '@/core/domain/entities/audit-log';

// Create enums for PostgreSQL
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const planEnum = pgEnum('plan', ['free', 'basic', 'premium']);
export const statusEnum = pgEnum('status', ['active', 'canceled', 'expired']);
export const actionEnum = pgEnum('action', Object.values(AuditAction) as [string, ...string[]]);
export const entityTypeEnum = pgEnum('entity_type', Object.values(EntityType) as [string, ...string[]]);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  password: text('password').notNull(),
  role: roleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: planEnum('plan').default('free').notNull(),
  status: statusEnum('status').default('active').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).defaultNow().notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: actionEnum('action').notNull(),
  entityType: entityTypeEnum('entity_type').notNull(),
  entityId: text('entity_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
