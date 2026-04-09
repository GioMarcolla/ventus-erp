import { pgTable, varchar, timestamp, uuid, index, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { addressColumns } from '@/lib/db/drizzle/Address.schema';

export const fornecedores = pgTable(
    'fornecedores',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // CNPJ or CPF.
        // TIP: Frontend should strip masks before saving (e.g., 12345678000199)
        taxId: varchar('tax_id', { length: 14 }).unique().notNull(),

        name: varchar('name', { length: 255 }).notNull(),
        tradeName: varchar('trade_name', { length: 255 }),

        email: varchar('email', { length: 255 }),
        phone: varchar('phone', { length: 20 }),
        contactPerson: varchar('contact_person', { length: 255 }),

        ...addressColumns,

        isActive: boolean('is_active').default(true).notNull(),

        // Accountability: Who brought them in and who last touched the data
        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        updatedBy: uuid('updated_by') // Added for better auditing
            .references(() => users.id),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [index('fornecedores_name_idx').on(table.name), index('fornecedores_tax_id_idx').on(table.taxId)],
);

export type Fornecedor = typeof fornecedores.$inferSelect;
export type NewFornecedor = typeof fornecedores.$inferInsert;
