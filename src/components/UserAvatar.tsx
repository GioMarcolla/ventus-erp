'use client';

import { FC, ReactElement, useEffect, useState } from 'react';

const UserAvatar: FC = (): ReactElement => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            setIsOpen(false);
        };
    }, []);

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <div className="flex items-center gap-4">
                <div
                    id="user-avatar"
                    className="bg-accent flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    onMouseEnter={() => setIsOpen(true)}
                >
                    AD
                </div>
            </div>
            {isOpen && (
                <div
                    className="absolute bottom-0 h-16 w-16 right-0 translate-y-full bg-black/50"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
