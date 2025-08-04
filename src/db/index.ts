import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get database URL from environment or throw error
const getDatabaseUrl = () => {
  if (isBrowser) {
    // In browser, we should not directly access database
    throw new Error('Database operations should be done server-side');
  }
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  return dbUrl;
};

let db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!db && !isBrowser) {
    const sql = neon(getDatabaseUrl());
    db = drizzle(sql, { schema });
  }
  return db;
};

// Export for backward compatibility
export { db as default };
