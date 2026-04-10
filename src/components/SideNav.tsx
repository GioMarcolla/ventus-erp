'use client';

import {
    IconCoin,
    IconFileDatabase,
    IconFolderDollar,
    IconGlassFull,
    IconHome,
    IconLock,
    IconLogout,
    IconTruck,
    IconTruckLoading,
    IconUserFilled,
    IconUsers,
    IconX,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactElement, useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { logout } from '@/lib/actions/Auth.actions';
import ConfirmModal from '@/components/ui/ConfirmModal';

// interface SideNavProps extends HTMLAttributes<HTMLDivElement> {}

const SideNav: FC = (): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        return () => {
            setIsModalOpen(false);
        };
    }, []);

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(path);
    };

    const ICON_SIZE = 16;

    const navItems = [
        { label: 'Início', href: '/dashboard', icon: <IconHome size={ICON_SIZE} /> },
        { label: 'Membros', href: '/dashboard/membros', icon: <IconUsers size={ICON_SIZE} /> },
        { label: 'Eventos', href: '/dashboard/eventos', icon: <IconGlassFull size={ICON_SIZE} /> },
        { label: 'Mensalidades', href: '/dashboard/mensalidades', icon: <IconCoin size={ICON_SIZE} /> },
        { label: 'Fornecedores', href: '/dashboard/fornecedores', icon: <IconTruck size={ICON_SIZE} /> },
        { label: 'Produtos', href: '/dashboard/produtos', icon: <IconTruckLoading size={ICON_SIZE} /> },
        { label: 'Contas', href: '/dashboard/contas', icon: <IconFolderDollar size={ICON_SIZE} /> },
    ];

    const navItemsGerente = [
        { label: 'Usuários', href: '/dashboard/usuarios', icon: <IconUserFilled size={ICON_SIZE} /> },
    ];

    const navItemsAdmin = [{ label: 'Logs', href: '/dashboard/logs', icon: <IconFileDatabase size={ICON_SIZE} /> }];

    return (
        <aside className="bg-bg-medium flex flex-col border-r border-gray-200">
            <ConfirmModal
                icon={
                    <div className="w-full text-center">
                        <IconLock size={72} className="text-rosso m-auto" />
                    </div>
                }
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    await logout();
                    setIsModalOpen(false);
                }}
                header="Encerrar sessão?"
                body="Tem certeza que deseja encerrar sua sessão? Suas alterações não salvas podem ser perdidas."
                confirmButton={
                    <button className="bg-rosso flex w-full flex-row items-center justify-center gap-2 rounded-full px-6 py-2 italic hover:cursor-pointer hover:brightness-125">
                        <IconLogout size={20} className="text-rosso-light" />
                        <span className="text-rosso-light">Encerrar sessão</span>
                    </button>
                }
                cancelButton={
                    <button className="bg-verde flex w-full flex-row items-center justify-center gap-2 rounded-full px-6 py-2 italic hover:cursor-pointer hover:brightness-125">
                        <IconX size={20} className="text-verde-light" />
                        <span className="text-verde-light">Continuar sessão</span>
                    </button>
                }
            />
            <div className="flex flex-row items-center justify-center p-2">
                <Logo />
            </div>

            {/* Navigation */}
            <nav className="grow p-2">
                {navItems.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-row items-center gap-2 rounded-full px-4 py-2 font-medium transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-verde text-white shadow-md'
                                : 'hover:bg-verde-light hover:text-verde'
                        }`}
                    >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <nav className="mt-auto px-2">
                {navItemsGerente.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-row items-center gap-2 rounded-full p-2 font-medium transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-verde text-white shadow-md'
                                : 'hover:bg-verde-light hover:text-verde'
                        }`}
                    >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <nav className="mb-2 px-2">
                {navItemsAdmin.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-row items-center gap-2 rounded-full p-2 font-medium transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-verde text-white shadow-md'
                                : 'hover:bg-verde-light hover:text-verde'
                        }`}
                    >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User / Logout Area */}
            <div className="border-t border-gray-200 p-2">
                <button
                    className="text-rosso hover:bg-rosso-light hover:text-rosso flex w-full items-center gap-3 rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <IconLogout size={20} />
                    Sair
                </button>
            </div>
        </aside>
    );
};

SideNav.displayName = 'SideNav';

export default SideNav;
