import { varchar, text, pgTable } from 'drizzle-orm/pg-core';

export const addressColumns = {
    street: varchar('street', { length: 255 }).notNull(),
    number: varchar('number', { length: 20 }).notNull(),
    apartment: varchar('apartment', { length: 50 }),
    district: varchar('bairro', { length: 100 }).notNull(), // Corrigido 'district'
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    country: varchar('country', { length: 100 }).default('Brasil').notNull(),
    cep: varchar('cep', { length: 20 }),
    reference: text('reference'),
};

// Criamos uma tabela "fake" apenas para inferir o tipo
const tempTable = pgTable('temp_address', addressColumns);

// Agora inferimos o tipo da tabela completa
export type Address = typeof tempTable.$inferSelect;
