'use server';

import {
    createNewMember,
    InsertMemberReturnType,
    updateMember,
    UpdateMemberReturnType,
} from '@/lib/services/Members.services';
import { revalidatePath } from 'next/cache';
import { Member } from '@/lib/db/drizzle';

/**
 * Cria um novo membro no banco de dados.
 *
 * @param formData Dados do membro a ser criado.
 * @returns Uma promessa que resolve em um objeto do tipo InsertMemberReturnType.
 * Se a cria o do membro for bem bem sucedida, a promessa resolve com um objeto contendo a chave 'success' com valor true e a chave 'data' com o objeto do membro criado.
 * Se a cria o do membro falhar, a promessa resolve com um objeto contendo a chave 'success' com valor false e a chave 'error' com a mensagem de erro.
 */
const createNewMemberAction = async (formData: Member): Promise<InsertMemberReturnType> => {
    try {
        const res = await createNewMember(formData);

        // Limpamos o cache da página de membros para refletir os novos dados
        if (res.success) revalidatePath('/dashboard/membros');

        return res;
    } catch (err) {
        return {
            success: false,
            error: {
                message: 'Erro ao processar action membro: ' + err,
                constraint: null,
            },
        };
    }
};

/**
 * Atualiza um membro no banco de dados.
 *
 * @param formData Dados do membro a ser atualizado.
 * @returns Uma promessa que resolve em um objeto do tipo UpdateMemberReturnType.
 * Se a atualiza o do membro for bem bem sucedida, a promessa resolve com um objeto contendo a chave 'success' com valor true e a chave 'data' com o objeto do membro atualizado.
 * Se a atualiza o do membro falhar, a promessa resolve com um objeto contendo a chave 'success' com valor false e a chave 'error' com a mensagem de erro.
 */
const updateMemberAction = async (formData: Member): Promise<UpdateMemberReturnType> => {
    try {
        const res = await updateMember(formData.id, formData);

        // Limpamos o cache da página de membros para refletir os novos dados
        if (res.success) revalidatePath('/dashboard/membros');

        return res;
    } catch (err) {
        return {
            success: false,
            error: {
                message: 'Erro ao processar action membro: ' + err,
                constraint: null,
            },
        };
    }
};

export { createNewMemberAction, updateMemberAction };
