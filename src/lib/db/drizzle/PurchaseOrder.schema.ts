import { pgTable, varchar, timestamp, uuid, index, text, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { fornecedores } from '@/lib/db/drizzle/Fornecedor.schema';

export const purchaseOrders = pgTable(
    'purchase_orders',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // Document ID: Generated at creation (e.g., PO202604090001)
        hrid: varchar('hrid', { length: 25 }).unique().notNull(),

        fornecedorId: uuid('fornecedor_id')
            .notNull()
            .references(() => fornecedores.id),

        // Status flow: draft -> pending -> received -> cancelled
        // 'paid' is verified by checking the Ledger (TRX) for this HRID
        status: varchar('status', { length: 20 }).default('pending').notNull(),

        invoiceNumber: varchar('invoice_number', { length: 100 }),
        totalAmountCents: integer('total_amount_cents').notNull().default(0),
        notes: text('notes'),

        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        receivedAt: timestamp('received_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [index('po_hrid_idx').on(table.hrid), index('po_fornecedor_idx').on(table.fornecedorId)],
);

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;