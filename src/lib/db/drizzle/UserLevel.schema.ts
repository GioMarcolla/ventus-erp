import { pgTable, varchar, integer, timestamp, text, index } from 'drizzle-orm/pg-core';

export const userLevels = pgTable(
    'user_levels',
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

        // 'admin', 'gerente', 'padrao', 'pdv'
        code: varchar('code', { length: 20 }).notNull().unique(),

        // Hierarchy: 100 (Admin) -> 400 (PDV)
        levelNumber: integer('level_number').notNull().unique(),

        name: varchar('name', { length: 50 }).notNull(),
        description: text('description'),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [index('user_levels_code_idx').on(table.code), index('user_levels_number_idx').on(table.levelNumber)],
);

export type UserLevel = typeof userLevels.$inferSelect;
export type NewUserLevel = typeof userLevels.$inferInsert;

// --- SEED DATA (Synced with LevelNumberMap) ---
export const defaultUserLevels: NewUserLevel[] = [
    {
        code: 'admin',
        levelNumber: 100,
        name: 'Administrador',
        description: 'Acesso total ao sistema e configurações.',
    },
    {
        code: 'gerente',
        levelNumber: 200,
        name: 'Gerente',
        description: 'Gerencia usuários e visualiza relatórios financeiros.',
    },
    {
        code: 'padrao',
        levelNumber: 300,
        name: 'Padrão',
        description: 'Acesso básico para criação de registros próprios.',
    },
    {
        code: 'pdv',
        levelNumber: 400,
        name: 'PDV',
        description: 'Operação exclusiva de terminal de venda (Fichas).',
    },
];
