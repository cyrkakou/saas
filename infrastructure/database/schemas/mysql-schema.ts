import { mysqlTable, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';
import { AuditAction, EntityType } from '@/core/domain/entities/audit-log';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
});

export const subscriptions = mysqlTable('subscriptions', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: mysqlEnum('plan', ['free', 'basic', 'premium']).default('free').notNull(),
  status: mysqlEnum('status', ['active', 'canceled', 'expired']).default('active').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
});

export const auditLogs = mysqlTable('audit_logs', {
  id: varchar('id', { length: 128 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 128 }).references(() => users.id, { onDelete: 'set null' }),
  action: mysqlEnum('action', Object.values(AuditAction) as [string, ...string[]]).notNull(),
  entityType: mysqlEnum('entity_type', Object.values(EntityType) as [string, ...string[]]).notNull(),
  entityId: varchar('entity_id', { length: 128 }),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
