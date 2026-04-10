import SideNav from '@/components/SideNav';
import LiveTime from '@/components/ui/LiveTime';
import UserAvatar from '@/components/UserAvatar';
import { FC, HTMLAttributes } from 'react';

interface DashboardLayoutProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="flex h-screen w-full overflow-hidden bg-transparent">
                <SideNav />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="bg-bg-dark relative flex min-h-16 items-center justify-between overflow-hidden border-b border-gray-200 px-8 py-4">
                        <div className="absolute top-0 left-0 z-40 flex min-h-[200%] origin-top-left translate-x-20 -translate-y-30 rotate-45 flex-row gap-0">
                            <div className="bg-accent shadow-ribbon z-30 h-100 min-h-full min-w-20"></div>
                            <div className="shadow-ribbon z-20 h-100 min-h-full min-w-10 bg-white"></div>
                            <div className="bg-contrast shadow-ribbon z-10 h-100 min-h-full min-w-10"></div>
                        </div>
                        <div className="ml-40">
                            <h1 className="text-sm tracking-widest">Circulo Ítaliano - Jaragua do Sul/SC</h1>
                            <LiveTime className="text-ink-light text-xs tracking-widest" dateTimeLocale="pt-BR" />
                        </div>
                        <UserAvatar />
                    </header>

                    <main className="bg-bg-light grow overflow-y-scroll p-4">{children}</main>
                </div>
            </div>
        </>
    );
};

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
