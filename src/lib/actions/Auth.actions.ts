'use server';

import { createClient } from '@/lib/db/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ActionState } from '@/lib/types/auth.types';

const login = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    const supabase = await createClient();

    const identifier = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!identifier || !password) {
        return { error: 'Credenciais ausentes', details: 'Preencha todos os campos.' };
    }

    let email = identifier;

    // 1. Check if it's an email or username
    const isEmail = identifier.includes('@');

    if (!isEmail) {
        // Use .ilike for case-insensitive lookup: 'GioMarcolla' === 'giomarcolla'
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .ilike('username', identifier)
            .single();

        if (userError || !userData) {
            console.error('Username lookup failed:', userError);
            return {
                error: 'Acesso negato',
                details: 'Usuário não encontrado no sistema.',
            };
        }
        email = userData.email;
    }

    // 2. Sign in with the resolved email
    const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        console.error('Auth error:', authError.message);
        return {
            error: 'Acesso negado!',
            details: 'As credenciais não conferem.',
        };
    }

    redirect('/dashboard');

    // unreachable, but satisfies TS return type if redirect wasn't there
    return { success: true };
};

/**
 * Log out the current user and clear the session cookies.
 */
const logout = async () => {
    const supabase = await createClient();

    // Revokes the session in Supabase and clears the local cookies
    await supabase.auth.signOut();

    // Revalidate the entire app to ensure protected routes are locked down
    revalidatePath('/', 'layout');
    redirect('/');
};

export { login, logout };
