import { pgTable, varchar, uuid, boolean, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const transactionSources = pgTable(
    'transaction_sources',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // e.g., 'Venda PDV', 'Compra Fornecedor', 'Mensalidade'
        name: varchar('name', { length: 100 }).notNull(),

        /**
         * The HRID Prefix
         * 'SE' (Sale Event), 'PO' (Purchase Order), 'ME' (Member), 'TR' (Transfer)
         * This is used by the generateHRID() function.
         */
        prefix: varchar('prefix', { length: 5 }).notNull().unique(),

        // 'in' (Entrada) or 'out' (Saída)
        direction: varchar('direction', { length: 3 }).notNull(),

        isActive: boolean('is_active').default(true).notNull(),
    },
    table => [
        index('trans_source_prefix_idx').on(table.prefix),
        // Sassy Guardrail: Database level protection against typos
        sql`CONSTRAINT direction_check CHECK (direction IN ('in', 'out'))`,
    ],
);

export type TransactionSource = typeof transactionSources.$inferSelect;
export type NewTransactionSource = typeof transactionSources.$inferInsert;
