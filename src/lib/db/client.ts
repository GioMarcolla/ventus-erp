import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle';

// Server-only connection
const client = postgres(process.env.SUPABASE_URL!, {
    prepare: false, // MANDATORY for port 6543
    ssl: 'require',
});

export const db = drizzle(client, { schema });

export type DB = typeof db;