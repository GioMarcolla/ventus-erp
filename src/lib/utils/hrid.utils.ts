import { db } from '@/lib/db/client';
import { sql, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

/**
 * Representa qualquer PgTable que possua obrigatoriamente a coluna 'hrid'.
 * Usamos Record para evitar a re-declaração dos genéricos internos da PgColumn.
 */
type TableWithHRID = PgTable & {
    hrid: PgColumn;
};

export async function createEntityWithHRID<TTable extends TableWithHRID>(
    table: TTable,
    data: Omit<InferInsertModel<TTable>, 'hrid'>,
    prefix: string,
    tableName: string,
): Promise<InferSelectModel<TTable>> {
    /**
     * Construímos o objeto de valores.
     * O TypeScript agora aceita a união porque TTable garante que 'hrid' existe.
     * Usamos a asserção para o modelo de inserção específico da TTable.
     */
    const values = {
        ...data,
        hrid: sql`generate_hrid(${prefix}, ${tableName})`,
    } as InferInsertModel<TTable>;

    const [result] = await db.insert(table).values(values).returning();

    if (!result) {
        throw new Error(`Critical: Insert failed on table ${tableName}. No record returned.`);
    }

    return result as InferSelectModel<TTable>;
}
