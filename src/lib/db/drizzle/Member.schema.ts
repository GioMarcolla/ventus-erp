import { pgTable, varchar, timestamp, uuid, index, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { addressColumns } from '@/lib/db/drizzle/Address.schema';

export const members = pgTable(
    'members',
    {
        // Internal primary key for database relations
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        // The Human Key: Unique, indexed, and strictly 11 digits
        cpf: varchar('cpf', { length: 11 }).unique().notNull(),

        firstName: varchar('first_name', { length: 255 }).notNull(),
        middleName: varchar('middle_name', { length: 255 }),
        lastName: varchar('last_name', { length: 255 }).notNull(),
        email: varchar('email', { length: 255 }),
        phone: varchar('phone', { length: 20 }),

        // Shared address logic
        ...addressColumns,

        isActive: boolean('is_active').default(true).notNull(),

        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),

        updatedBy: uuid('updated_by').references(() => users.id),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    table => [
        index('members_name_idx').on(table.firstName),
        // Explicit index for the unique CPF to ensure lookups are O(1)
        index('members_cpf_idx').on(table.cpf),
        // Sassy Guardrail: Only 11 digits, no dots, no dashes allowed in the DB
        sql`CONSTRAINT cpf_format_check CHECK (cpf ~ '^[0-9]{11}$')`,
    ],
);

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
