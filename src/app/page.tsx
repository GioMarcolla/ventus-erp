'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { FC, ReactElement } from 'react';
import Logo from '@/components/Logo';
import { login } from '@/lib/actions/Auth.actions';
import { ActionState } from '@/lib/types/auth.types'; // Your new strict type
import { cn } from '@/lib/utils/tailwind.utils';

const HomePage: FC = (): ReactElement => {
    // [state, formAction, isPending]
    // useActionState handles the loading state directly, so we don't need a separate sub-component
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(login, null);

    return (
        <div className="flex h-screen w-full flex-row overflow-hidden bg-white">
            {/* Left Side: Branding Image */}
            <aside className="relative hidden grow basis-1/2 shadow-xl shadow-gray-800/30 md:block">
                <Image
                    src="/images/chiesetta.jpg"
                    alt="Chiesetta alpina, jaragua do sul, santa catarina"
                    fill
                    className="object-cover"
                    loading="eager"
                    priority
                    sizes="50vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                    quality={75}
                />
            </aside>

            {/* Right Side: Login Form */}
            <main className="bg-verde relative flex grow basis-1/2 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-10 shadow-lg shadow-gray-600">
                    <div className="flex flex-col items-center">
                        <Logo className="h-40 w-40" />
                        <h2 className="text-verde text-3xl font-extrabold tracking-tight">Círculo Ítalo-Brasileiro</h2>
                        <p className="mt-2 text-sm font-medium text-gray-500">Sistema de Gestão de Clubes | ERP</p>
                    </div>

                    {/* Sassy Error Alert - Strictly Typed */}
                    {state?.error && (
                        <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50 p-4 duration-300">
                            <p className="text-xs font-black tracking-widest text-red-500 uppercase">{state.error}</p>
                            <p className="text-sm font-semibold text-red-700">{state.details}</p>
                        </div>
                    )}

                    <form action={formAction} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="ml-4 block text-[10px] font-bold tracking-widest text-gray-500 uppercase"
                                >
                                    Email/Usuário
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    className="focus:border-verde focus:ring-verde mt-1 block w-full rounded-full border border-gray-300 px-5 py-3 shadow-sm transition-all focus:ring-1 focus:outline-none sm:text-sm"
                                    placeholder="seu email ou usuario"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="ml-4 block text-[10px] font-bold tracking-widest text-gray-500 uppercase"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="focus:border-verde focus:ring-verde mt-1 block w-full rounded-full border border-gray-300 px-5 py-3 shadow-sm transition-all focus:ring-1 focus:outline-none sm:text-sm"
                                    placeholder="•••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                'group relative flex w-full justify-center rounded-full px-4 py-3 text-sm font-black tracking-widest text-white uppercase transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none',
                                isPending
                                    ? 'cursor-not-allowed bg-gray-400'
                                    : 'bg-verde shadow-md hover:bg-[#007038] hover:shadow-lg active:scale-[0.98]',
                            )}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Verificando...
                                </span>
                            ) : (
                                'Entrare'
                            )}
                        </button>
                    </form>
                </div>

                <div className="absolute bottom-4 text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
                    © 2026 Ventus™ ERP by ZM
                </div>
            </main>
        </div>
    );
};

export default HomePage;
