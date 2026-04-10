'use client';

import { cn } from '@/lib/utils/tailwind.utils';
import { FC, HTMLAttributes, ReactElement, useEffect, useState } from 'react';

interface LiveTimeProps extends HTMLAttributes<HTMLDivElement> {
    dateTimeLocale: Intl.LocalesArgument;
    hour12?: boolean;
    timeZone?: string;
}

const LiveTime: FC<LiveTimeProps> = ({
    dateTimeLocale,
    hour12,
    timeZone = 'America/Sao_Paulo',
    className,
}): ReactElement => {
    const [time, setTime] = useState<Date | null>(null);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: timeZone,
        hour12: hour12,
    };

    useEffect(() => {
        // Atualiza a cada segundo
        const timer = setInterval(() => {
            setTime(new Date());
        }, 50);

        // Limpa o intervalo ao desmontar o componente
        return () => clearInterval(timer);
    }, []);

    if (!time) return <></>;

    const formattedDate = time.toLocaleDateString(dateTimeLocale, {
        ...options,
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const formattedTime = time.toLocaleTimeString(dateTimeLocale, {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <p className={cn('text-ink-dark font-medium', className)}>
            {formattedTime} - {formattedDate}
        </p>
    );
};

export default LiveTime;
