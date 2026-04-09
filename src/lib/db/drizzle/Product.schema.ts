import { pgTable, varchar, timestamp, uuid, index, integer, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '@/lib/db/drizzle/User.schema';
import { saleCategories } from '@/lib/db/drizzle/SaleCategory.schema';

export const products = pgTable(
    'products',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),

        name: varchar('name', { length: 255 }).notNull(),

        categoryId: uuid('category_id')
            .notNull()
            .references(() => saleCategories.id),

        // For barcode scanners or quick-codes
        sku: varchar('sku', { length: 50 }).unique(),

        // Financials (Always in Cents)
        salePriceCents: integer('sale_price_cents').notNull().default(0),
        costPriceCents: integer('cost_price_cents').default(0),

        // Inventory Management
        currentStock: integer('current_stock').default(0).notNull(),
        minStockAlert: integer('min_stock_alert').default(5).notNull(),

        // e.g., 'un', 'kg', 'lt'
        unit: varchar('unit', { length: 10 }).default('un').notNull(),

        isActive: boolean('is_active').default(true).notNull(),

        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    table => [
        index('products_category_id_idx').on(table.categoryId),
        index('products_active_idx').on(table.isActive),
        index('products_sku_idx').on(table.sku), // Added for scanner performance
    ],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;