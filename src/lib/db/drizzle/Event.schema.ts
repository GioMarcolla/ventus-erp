import { pgTable, varchar, timestamp, uuid, index, text, boolean, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';

export const events = pgTable(
    'events',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // e.g., "Festa da Polenta 2026", "Almoço Beneficente"
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),

        // Planning & BI Metrics
        maxCapacity: integer('max_capacity'), // How many people can the club hold for this?
        targetRevenueCents: integer('target_revenue_cents'), // Financial goal for the BI dashboard
        estimatedAttendance: integer('estimated_attendance'), // What we expected vs. what we got
        budget: integer('budget'), // Financial goal

        // When the event is actually happening
        startDateTime: timestamp('start_date', { withTimezone: true }).notNull(),
        endDateTime: timestamp('end_date', { withTimezone: true }),

        // Status logic:
        // isActive = visible in PDV for attribution
        // isLocked = archived, no more transactions can be linked
        isActive: boolean('is_active').default(true).notNull(),
        isLocked: boolean('is_locked').default(false).notNull(),

        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [index('events_active_idx').on(table.isActive), index('events_date_idx').on(table.startDateTime)],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
