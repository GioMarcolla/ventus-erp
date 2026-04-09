import { pgTable, varchar, integer, timestamp, text, boolean, index } from 'drizzle-orm/pg-core';

export const permissions = pgTable(
    'permissions',
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
        code: varchar('code', { length: 100 }).notNull().unique(), // e.g., 'transactions.void'
        name: varchar('name', { length: 200 }).notNull(),
        description: text('description'),
        resource: varchar('resource', { length: 50 }).notNull(),
        action: varchar('action', { length: 20 }).notNull(),
        isSystem: boolean('is_system').notNull().default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [index('permissions_code_idx').on(table.code), index('permissions_resource_idx').on(table.resource)],
);

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

export const defaultPermissions: NewPermission[] = [
    // Users & Access
    { code: 'users.manage', name: 'Gerenciar Usuários', resource: 'users', action: 'manage', isSystem: true },
    { code: 'users.read', name: 'Ver Usuários', resource: 'users', action: 'read' },

    // Members
    { code: 'members.create', name: 'Criar Membros', resource: 'members', action: 'create' },
    { code: 'members.read', name: 'Ver Membros', resource: 'members', action: 'read' },
    { code: 'members.update', name: 'Editar Membros', resource: 'members', action: 'update' },

    // Transactions (The Ledger / TRX)
    { code: 'transactions.create', name: 'Registrar Transação', resource: 'transactions', action: 'create' },
    { code: 'transactions.read', name: 'Ver Extrato Ledger', resource: 'transactions', action: 'read' },
    {
        code: 'transactions.void',
        name: 'Estornar Transação',
        resource: 'transactions',
        action: 'manage',
        isSystem: true,
    },

    // Events (The Stage)
    { code: 'events.create', name: 'Criar Eventos', resource: 'events', action: 'create' },
    { code: 'events.manage', name: 'Abrir/Fechar Eventos', resource: 'events', action: 'manage' },

    // Procurement & Inventory
    { code: 'purchase.manage', name: 'Gerenciar Compras', resource: 'purchase_orders', action: 'manage' },
    { code: 'inventory.read', name: 'Ver Estoque', resource: 'inventory', action: 'read' },
];

export const defaultPermissionCodes = defaultPermissions.map(permission => permission.code);