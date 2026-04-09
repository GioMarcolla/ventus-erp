import SideNav from '@/components/SideNav';
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
                    <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-bg-dark px-8">
                        <h1 className="text-sm tracking-widest">Dashboard</h1>
                        <UserAvatar />
                    </header>

                    <main className="grow overflow-y-scroll bg-bg-light p-4">{children}</main>
                </div>
            </div>
        </>
    );
};

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
