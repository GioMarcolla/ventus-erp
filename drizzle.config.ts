import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Carrega o .env.local de forma explícita
dotenv.config({
    path: '.env.local',
});

export default defineConfig({
    // Dica: Se tiver muitos arquivos, garanta que o caminho esteja exato.
    schema: './src/lib/db/drizzle/*.schema.ts',

    out: './drizzle',

    dialect: 'postgresql',

    dbCredentials: {
        url: process.env.SUPABASE_DIRECT_URL!,
    },

    // O 'breakpoints: true' ajuda a não deixar migrações parciais se algo falhar no meio.
    breakpoints: true,

    // O Drizzle 1.0 melhorou o 'tablesFilter'. Se você usa o schema 'public' do Supabase,
    // ele ignora as tabelas internas do Postgres por padrão, mas manter seu filtro é seguro.
    tablesFilter: ['!pgmigrations', '!pg_stat_*'],

    // 6. Logs e Segurança
    verbose: true,
    strict: true,
});
