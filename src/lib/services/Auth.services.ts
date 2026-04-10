import { User, users } from '@/lib/db/drizzle';
import { createClient } from '@/lib/db/server';
import { db } from '@/lib/db/client';
import { eq } from 'drizzle-orm';

type GetAndValidateCurrentUserType = {
    success: boolean;
    user?: User;
    error?: string;
};

const getAndValidateCurrentUser = async (): Promise<GetAndValidateCurrentUserType> => {
    const supabase = await createClient();
    const {
        data: { user: authUser },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
        return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const [user]: User[] = await db.select().from(users).where(eq(users.id, authUser.id)).limit(1);

    if (!user) return { success: false, error: 'Usuário não encontrado.' };
    if (user.status !== 'active') return { success: false, error: 'Usuário desativado.' };

    return { success: true, user: user };
};

export { getAndValidateCurrentUser };
