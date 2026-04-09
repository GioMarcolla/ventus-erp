import { cn } from '@/lib/utils/tailwind.utils';
import Image from 'next/image';
import { FC, HTMLAttributes, ReactElement } from 'react';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Logo: FC<LogoProps> = ({ className }): ReactElement => {
    return (
        <div className={cn('h-20 w-20', className)}>
            <Image
                src='/images/logo.png'
                alt="Logo Circulo Italiano de Jaragua do Sul"
                width={100}
                height={100}
                className={'h-full w-full'}
                priority
                fetchPriority="high"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                loading="eager"
                decoding="async"
            />
        </div>
    );
};

Logo.displayName = 'Logo';

export default Logo;
