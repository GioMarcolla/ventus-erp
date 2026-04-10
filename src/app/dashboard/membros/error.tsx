'use client';

import MemberErrorState from '@/components/Members/MemberErrorState';
import { FC, HTMLAttributes } from 'react';

interface ErrorPageProps extends HTMLAttributes<HTMLDivElement> {
    error: Error & { digest?: string };
    reset: () => void;
}

const ErrorPage: FC<ErrorPageProps> = ({ reset }) => {
    return (
        <div className="border-bg-dark bg-bg-medium flex h-full w-full items-center justify-center rounded-3xl border-2">
            <div className="bg-bg-medium m-auto p-20 text-center">
                <p className="text-ink-light font-medium italic">Ocorreu um erro ao carregar os membros.</p>
                <MemberErrorState reset={reset} />
            </div>
        </div>
    );
};

export default ErrorPage;
