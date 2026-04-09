import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { purchaseOrders } from '@/lib/db/drizzle/PurchaseOrder.schema';
import { products } from '@/lib/db/drizzle/Product.schema';

export const purchaseOrderItems = pgTable('purchase_order_items', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),

    purchaseOrderId: uuid('purchase_order_id')
        .notNull()
        .references(() => purchaseOrders.id, { onDelete: 'cascade' }),

    productId: uuid('product_id')
        .notNull()
        .references(() => products.id),

    quantity: integer('quantity').notNull(),

    // Price at the time of purchase (since Spaten prices fluctuate!)
    unitPriceCents: integer('unit_price_cents').notNull(),

    totalPriceCents: integer('total_price_cents')
        .notNull()
        .generatedAlwaysAs(sql`quantity * unit_price_cents`),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type NewPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;
