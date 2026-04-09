import { pgTable, varchar, timestamp, uuid, index, integer, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { members } from '@/lib/db/drizzle/Member.schema';
import { events } from '@/lib/db/drizzle/Event.schema';
import { transactionSources } from '@/lib/db/drizzle/TransactionSource.schema';

export const transactions = pgTable(
    'transactions',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        /**
         * Human-Readable Transaction Code
         * Logic: [TRX][YYYYMMDD][HHMMSS][STEP0000]
         * Example: TRX202604090245010001
         */
        hrid: varchar('hrid', { length: 22 }).unique().notNull(),

        /**
         * The Link to the Document
         * Points to a SE-HRID (Sale) or PO-HRID (Purchase Order)
         */
        referenceHrid: varchar('reference_hrid', { length: 25 }),

        /**
         * The BI Bucket (Post-Mortem Link)
         * Null = General Bar/Club overhead
         * UUID = Specific Event/Project
         */
        attributionId: uuid('attribution_id').references(() => events.id),

        // Optional link to the member (referenced by their unique Natural Key)
        memberCpf: varchar('member_cpf', { length: 11 }).references(() => members.cpf),

        // Financials
        amountCents: integer('amount_cents').notNull(),

        // References the TransactionSource dictionary (Sale, Purchase, Membership, etc.)
        sourceId: uuid('source_id')
            .notNull()
            .references(() => transactionSources.id),

        paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'pix', 'cash', 'card', 'boleto'
        description: text('description'),

        processedBy: uuid('processed_by')
            .notNull()
            .references(() => users.id),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [
        index('trans_hrid_idx').on(table.hrid),
        index('trans_ref_idx').on(table.referenceHrid),
        index('trans_attribution_idx').on(table.attributionId),
        index('trans_member_idx').on(table.memberCpf),
    ],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
