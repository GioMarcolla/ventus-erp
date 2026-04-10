'use server';

import { db } from '@/lib/db/client';
import { Member, members, NewMember } from '@/lib/db/drizzle/Member.schema';
import { desc, isNull, and, eq, SQL } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getAndValidateCurrentUser } from '@/lib/services/Auth.services';
import { DBErrorType, getDbErrorMessage } from '@/lib/utils/dbError.utils';

type BaseDBActionReturnType<T> = {
    success: boolean;
    data?: T;
    error?: DBErrorType;
};

export type GetAllMemberReturnType = BaseDBActionReturnType<Member[]>;
export type UpdateMemberReturnType = BaseDBActionReturnType<Member>;
export type InsertMemberReturnType = BaseDBActionReturnType<Member>;


/**
 * Returns all members from the database.
 *
 * @returns A promise that resolves with an object containing a success flag and either an array of members or an error message.
 */
export const getAllMembers = async (): Promise<GetAllMemberReturnType> => {
    try {
        const listMembers = await db
            .select()
            .from(members)
            .where(isNull(members.deletedAt))
            .orderBy(desc(members.createdAt));

        return { success: true, data: listMembers };
    } catch (err) {
        return { success: false, error: getDbErrorMessage(err) };
    }
};

/**
 * Atualiza um membro com verificação de nível de acesso
 */
export const updateMember = async (memberId: string, data: Partial<NewMember>): Promise<UpdateMemberReturnType> => {
    const { user, success } = await getAndValidateCurrentUser();
    if (!success || !user)
        return {
            success: false,
            error: {
                message: 'Sessão expirada. Faça login novamente.',
                constraint: null,
            },
        };

    // Construção dinâmica de filtros (Padrão 1.0)
    const conditions: SQL[] = [eq(members.id, memberId)];

    // Se não for Admin (200+), só pode editar o que ele mesmo criou
    if (user.levelNumber < 200) {
        conditions.push(eq(members.createdBy, user.id));
    }

    try {
        const [updatedMember] = await db
            .update(members)
            .set({
                ...data,
                updatedAt: new Date(),
                updatedBy: user.id,
            })
            .where(and(...conditions))
            .returning();

        if (!updatedMember) {
            return {
                success: false,
                error: {
                    message: 'Membro não encontrado ou você não tem permissão para editá-lo.',
                    constraint: null,
                },
            };
        }

        revalidatePath('/dashboard/membros');
        return { success: true, data: updatedMember };
    } catch (err) {
        return { success: false, error: getDbErrorMessage(err) };
    }
};

/**
 * Cria um novo membro
 */
export const createNewMember = async (data: NewMember): Promise<InsertMemberReturnType> => {
    const { user, success } = await getAndValidateCurrentUser();
    if (!success || !user)
        return {
            success: false,
            error: {
                message: 'Sessão expirada. Faça login novamente.',
                constraint: null,
            },
        };

    try {
        const [newMember] = await db
            .insert(members)
            .values({
                ...data,
                createdBy: user.id,
                createdAt: new Date(), // Opcional se você tiver defaultNow() no banco
            })
            .returning();

        revalidatePath('/dashboard/membros');
        return { success: true, data: newMember };
    } catch (err) {
        return {
            success: false,
            error: getDbErrorMessage(err),
        };
    }
};
