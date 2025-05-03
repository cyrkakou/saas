import type { Config } from 'drizzle-kit';

export default {
  schema: './infrastructure/database/drizzle/schema.ts',
  out: './infrastructure/database/drizzle/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'sqlite.db',
  },
} satisfies Config;
