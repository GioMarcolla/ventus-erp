import { varchar, text } from 'drizzle-orm/pg-core';

export const addressColumns = {
    street: varchar('street', { length: 255 }).notNull(),
    number: varchar('number', { length: 20 }).notNull(),
    // For the nonnos living in the city center or gated communities
    apartment: varchar('apartment', { length: 50 }),
    distric: varchar('bairro', { length: 100 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    country: varchar('country', { length: 100 }).default('Brasil').notNull(),
    cep: varchar('cep', { length: 20 }),
    reference: text('reference'),
};

export type Address = {
    [K in keyof typeof addressColumns]: (typeof addressColumns)[K]['_']['data'];
};
