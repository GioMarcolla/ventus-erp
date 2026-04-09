import { pgTable, varchar, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const saleCategories = pgTable('sale_categories', {
    id: uuid('id')
        .primaryKey()
        .default(sql`gen_random_uuid()`),

    // The "Ficha" name: e.g., "Ficha de Refrigerante", "Ficha de Macarrão"
    name: varchar('name', { length: 100 }).notNull(),

    // THE Price: This is what is charged at the cashier.
    priceCents: integer('price_cents').notNull(),

    // UI & Organization
    bgColorCode: varchar('bg_color_code', { length: 7 }).default('#ffffff'),
    textColorCode: varchar('text_color_code', { length: 7 }).default('#000000'),

    // Where it sits on the screen
    sortOrder: integer('sort_order').default(0).notNull(),

    isActive: boolean('is_active').default(true).notNull(),
});

export type SaleCategory = typeof saleCategories.$inferSelect;
export type NewSaleCategory = typeof saleCategories.$inferInsert;