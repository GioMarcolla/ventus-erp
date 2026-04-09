import { FC, ReactElement } from 'react';

/**
 * A functional component that renders a loading indicator
 * for the Members table.
 *
 * @returns {ReactElement} A React element representing the loading indicator.
 */
const Loading: FC = (): ReactElement => {
    return (
        <div className="border-bg-dark bg-bg-medium flex h-full w-full animate-pulse items-center justify-center rounded-3xl border-2 shadow-sm">
            <p className="text-ink-light font-bold tracking-widest uppercase italic">Carregando Membros...</p>
        </div>
    );
};

export default Loading;
