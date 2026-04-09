import { defineConfig } from 'drizzle-kit';

const drizzleConfig = defineConfig({
    schema: './src/lib/db/drizzle/*.schema.ts',
    out: './drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    // Folder v3 migrations (No more journal.json conflicts)
    verbose: true,
    strict: true,
    tablesFilter: ['!pgmigrations', '!pg_stat_*'],
});

export default drizzleConfig;
