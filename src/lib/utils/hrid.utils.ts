import { db } from '@/lib/db/client';
import { sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

/**
 * Generic creator using strict T and I patterns.
 * Solves the overlap error by using a targeted type assertion.
 */
export async function createEntityWithHRID<TTable extends PgTable, TInsert extends TTable['$inferInsert']>(
    table: TTable,
    data: Omit<TInsert, 'hrid'>,
    prefix: string,
    tableName: string,
): Promise<TTable['$inferSelect']> {
    // Construct the values object strictly.
    // We use the unknown-to-TInsert bridge to satisfy the compiler's strict overlap rules.
    const values = {
        ...data,
        hrid: sql`generate_hrid(${prefix}, ${tableName})`,
    } as unknown as TInsert;

    const [result] = await db.insert(table).values(values).returning();

    if (!result) {
        throw new Error(`Critical: Insert failed on table ${tableName}. No record returned.`);
    }

    return result as TTable['$inferSelect'];
}
