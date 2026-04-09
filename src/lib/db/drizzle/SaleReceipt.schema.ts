import { pgTable, varchar, timestamp, uuid, index, integer, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { members } from '@/lib/db/drizzle/Member.schema';
import { events } from '@/lib/db/drizzle/Event.schema';

export const saleReceipts = pgTable(
    'sale_receipts',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // SE202604090001 - The public identifier
        hrid: varchar('hrid', { length: 25 }).unique().notNull(),

        /**
         * THE FLEXIBLE LINK:
         * This can point to an Event, a Project, or nothing.
         * We keep the FK to 'events' for now as it's our primary cost-center,
         * but by naming it 'attributionId', we signal it's just for reporting.
         */
        attributionId: uuid('attribution_id').references(() => events.id),

        memberCpf: varchar('member_cpf', { length: 11 }).references(() => members.cpf),

        totalAmountCents: integer('total_amount_cents').notNull(),

        status: varchar('status', { length: 20 }).default('active').notNull(),

        notes: text('notes'),

        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [
        index('se_hrid_idx').on(table.hrid),
        index('se_attribution_idx').on(table.attributionId),
        index('se_member_idx').on(table.memberCpf),
    ],
);

export type SaleReceipt = typeof saleReceipts.$inferSelect;
export type NewSaleReceipt = typeof saleReceipts.$inferInsert;