import { db } from '@/lib/db/client';
import { NewPurchaseOrder, purchaseOrders } from '@/lib/db/drizzle/PurchaseOrder.schema';
import { transactions } from '@/lib/db/drizzle/Transaction.schema';
import { eq, sql } from 'drizzle-orm';
import { createEntityWithHRID } from '../utils/hrid.utils';

/**
 * Initialize the PO with a JIT HRID
 */
export async function createPurchaseOrder(data: Omit<NewPurchaseOrder, 'hrid'>) {
    return createEntityWithHRID(purchaseOrders, data, 'PO', 'purchase_orders');
}

/**
 * This is the trigger for Inventory updates later.
 */
export async function receivePurchaseOrder(id: string) {
    return await db
        .update(purchaseOrders)
        .set({
            status: 'received',
            receivedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(purchaseOrders.id, id))
        .returning();
}

/**
 * Create the associated Ledger Transaction.
 */
export async function payPurchaseOrder(
    po: {
        id: string;
        hrid: string;
        totalAmountCents: number;
        fornecedorId: string;
        sourceId: string; // You'll need to pass the 'Purchase' source ID here
    },
    userId: string, // This maps to processedBy
) {
    return await db.transaction(async tx => {
        // 1. Update PO status to 'paid'
        await tx
            .update(purchaseOrders)
            .set({ status: 'paid', updatedAt: new Date() })
            .where(eq(purchaseOrders.id, po.id));

        // 2. Create the Ledger entry
        return await tx
            .insert(transactions)
            .values({
                // Financials
                amountCents: po.totalAmountCents * -1,
                paymentMethod: 'bank_transfer', // Or however you pay suppliers

                // The logic we discussed
                description: `Payment for PO: ${po.hrid}`,
                hrid: sql`generate_hrid('EX', 'transactions')`,

                // Traceability: Crucial for your Post-Mortem link
                referenceHrid: po.hrid,
                sourceId: po.sourceId,

                // THE FIX: Mapping 'userId' to the schema's 'processedBy'
                processedBy: userId,

                // Optional: attributionId could be added here if this PO belongs to an event
            })
            .returning();
    });
}
