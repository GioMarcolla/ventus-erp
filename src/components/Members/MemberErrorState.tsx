'use client';

import { FC, HTMLAttributes, ReactElement, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertTriangle, IconArrowBack, IconRefresh } from '@tabler/icons-react';

interface MemberErrorStateProps extends HTMLAttributes<HTMLDivElement> {
    reset?: () => void;
}

const MemberErrorState: FC<MemberErrorStateProps> = ({ reset }): ReactElement => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [isPending, startTransition] = useTransition();

    const handleRetry = () => {
        if (!isPending)
            startTransition(() => {
                setIsOpen(() => false);
                router.refresh(); // O router.refresh() força o Next.js a tentar rodar o Server Component de novo
                if (reset) reset();
            });
    };

    if (!isOpen)
        return (
            <div className="flex w-full items-center justify-center p-4">
                <button
                    onClick={() => handleRetry()}
                    className="text-ink-light bg-rosso flex flex-row items-center justify-center gap-2 rounded-full px-6 py-2 italic hover:cursor-pointer hover:brightness-125"
                    disabled={isPending}
                >
                    <IconRefresh size={20} className="animate-reverse-spin text-rosso-light" />
                    <span className="text-rosso-light font-medium">Tentar novamente</span>
                </button>
            </div>
        );

    return (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm duration-300">
            <div className="animate-in zoom-in-95 bg-bg-light w-full max-w-md rounded-3xl p-8 text-start shadow-2xl duration-300">
                <div className="bg-rosso-light text-rosso m-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <IconAlertTriangle size={32} />
                </div>

                <h2 className="text-ink-dark mb-4 text-2xl font-black tracking-tight uppercase italic">
                    Conexão instável?
                </h2>

                <p className="text-ink font-medium">Não conseguimos puxar os dados do banco.</p>
                <p className="text-ink font-medium">Pode ser o limite de conexões ou o café do servidor acabou.</p>
                <p className="text-ink font-bold">Quer tentar de novo?</p>

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        onClick={handleRetry}
                        className="bg-verde text-verde-light flex w-full items-center justify-center gap-2 rounded-full py-2 font-bold shadow-lg transition-all hover:cursor-pointer hover:brightness-125 active:scale-95"
                    >
                        <IconRefresh size={20} />
                        Tentar Novamente
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-rosso-light bg-rosso flex w-full items-center justify-center gap-2 rounded-full py-2 font-bold shadow-lg transition-all hover:cursor-pointer hover:brightness-125 active:scale-95"
                    >
                        <IconArrowBack size={20} />
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
};

MemberErrorState.displayName = 'MemberErrorState';

export default MemberErrorState;
