import { pgTable, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { userLevels } from '@/lib/db/drizzle/UserLevel.schema';
import { permissions } from '@/lib/db/drizzle/Permission.schema';

export const levelPermissions = pgTable(
    'level_permissions',
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

        levelId: integer('level_id')
            .notNull()
            .references(() => userLevels.id), // Direct reference is cleaner

        permissionId: integer('permission_id')
            .notNull()
            .references(() => permissions.id),

        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [
        index('level_permissions_level_idx').on(table.levelId),
        index('level_permissions_permission_idx').on(table.permissionId),

        // NEW: Proper Drizzle syntax for composite unique
        // Prevents "Admin" from having "users.create" twice.
        uniqueIndex('level_perm_composite_idx').on(table.levelId, table.permissionId),
    ],
);

export type LevelPermission = typeof levelPermissions.$inferSelect;
export type NewLevelPermission = typeof levelPermissions.$inferInsert;

/** * UPDATED SEED: Including the Transaction (HRID) and Event logic
 * We added 'transactions.read' and 'events.manage'
 */
export const defaultLevelPermissions = {
    admin: [
        'users.manage',
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
        'members.create',
        'members.read',
        'members.update',
        'members.delete',
        'slips.create',
        'slips.edit',
        'slips.close',
        'financial.read',
        'reports.read',
        'transactions.read',
        'transactions.void', // New: Can see ledger and cancel HRIDs
        'events.manage', // New: Can create and close parties
    ],

    gerente: [
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
        'members.create',
        'members.read',
        'members.update',
        'members.delete',
        'slips.create',
        'slips.edit',
        'slips.close',
        'financial.read',
        'reports.read',
        'transactions.read',
        'events.manage',
    ],

    padrao: [
        'members.create',
        'members.read',
        'members.update',
        'slips.create',
        'slips.edit',
        'transactions.read', // Can check their own history
    ],

    pdv: [
        'slips.create',
        'slips.edit',
        'slips.close',
        'transactions.create', // Needs this to trigger the generateHRID helper
    ],
};
