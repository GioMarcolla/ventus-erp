import AddMemberDrawer from '@/components/Members/AddMemberDrawer';
import { IconUserPlus } from '@tabler/icons-react';
import { FC, HTMLAttributes, ReactElement } from 'react';

interface MembersLayoutProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

/**
 * A functional component that renders a layout for the Members page.
 * It wraps the children in a section element with a maximum width of 400px and a padding of 8px.
 * It also renders a heading with the title "Membros" and a button to add a new member.
 *
 * @param {MembersLayoutProps} props - The props object to pass to the component.
 * @returns {ReactElement} A React element representing the Members layout.
 */
const MembersLayout: FC<MembersLayoutProps> = ({ children }): ReactElement => {
    return (
        <section className="animate-in fade-in flex h-full max-w-full flex-col gap-8 p-8 duration-500">
            <div className="flex shrink items-end justify-between">
                <div>
                    <h1 className="text-ink-dark text-4xl font-black tracking-tight uppercase italic">Membros</h1>
                    <p className="font-medium">Gestão de Membros</p>
                </div>

                <AddMemberDrawer />
            </div>
            {children}
        </section>
    );
};

MembersLayout.displayName = 'MembersLayout';

export default MembersLayout;
