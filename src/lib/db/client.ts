import 'server-only';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle';

const queryClient = postgres(process.env.SUPABASE_URL!, {
    prepare: false, // Correto: essencial para port 6543/Supabase
    ssl: 'require',
});

export const db = drizzle({
    client: queryClient,
    schema,
});

export type DB = typeof db;
