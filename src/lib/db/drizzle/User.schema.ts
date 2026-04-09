import { pgTable, pgEnum, varchar, integer, timestamp, uuid, index, foreignKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userLevels } from '@/lib/db/drizzle/UserLevel.schema';

export const userStatusValues = ['active', 'suspended', 'inactive'] as const;
export type UserStatus = (typeof userStatusValues)[number];
export const userStatusEnum = pgEnum('user_status', [...userStatusValues]);

export const users = pgTable(
    'users',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        email: varchar('email', { length: 255 }).notNull().unique(),
        username: varchar('username', { length: 255 }).notNull().unique(),

        fullName: varchar('full_name', { length: 200 }).notNull(),
        phone: varchar('phone', { length: 20 }),

        // THE ONLY LINK THAT MATTERS:
        // Everything else about the level (number, name, description)
        // stays in the user_levels table.
        levelId: integer('level_id')
            .notNull()
            .references(() => userLevels.id),

        // This is purely for RLS performance.
        // We sync this via a Trigger in Postgres, not via TypeScript constants.
        levelNumber: integer('level_number').notNull(),

        status: userStatusEnum('status').notNull().default('active'),

        createdBy: uuid('created_by'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    table => [
        index('users_login_email_idx').on(table.email),
        index('users_login_username_idx').on(table.username),
        index('users_level_number_idx').on(table.levelNumber),

        foreignKey({
            columns: [table.createdBy],
            foreignColumns: [table.id],
            name: 'users_created_by_fkey',
        }).onDelete('set null'),
    ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
