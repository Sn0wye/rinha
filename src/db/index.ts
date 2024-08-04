import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 200,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000
});

export const db = drizzle(pool, {
  logger: env.NODE_ENV === 'development'
});
