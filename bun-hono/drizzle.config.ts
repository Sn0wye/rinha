import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
  schema: './src/db/schema.ts',
  migrations: {
    table: 'drizzle_migrations'
  },
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  },
  out: './src/db/migrations'
});
