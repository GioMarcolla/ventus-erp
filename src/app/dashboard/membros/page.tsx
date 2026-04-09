import { FC, ReactElement } from 'react';
import { IconUserPlus } from '@tabler/icons-react';
import MemberTable from '@/components/MembersTable';
import { getAllMembers } from '@/lib/services/Members.services';

const MembrosPage: FC = async ({}): Promise<ReactElement> => {
    const data = await getAllMembers();

    return (
        <section className="animate-in fade-in mx-auto max-w-400 p-8 duration-500">
            {/* Page Header */}
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-ink-dark uppercase italic">Membros</h1>
                    <p className="font-medium">Círculo Ítalo-Brasileiro — Gestão de Base</p>
                </div>

                <button className="flex items-center gap-2 rounded-full bg-verde px-6 py-2 font-bold text-white shadow-lg shadow-gray-300 transition-all hover:brightness-125 active:scale-95">
                    <IconUserPlus size={18} />
                    NOVO MEMBRO
                </button>
            </div>

            {/* The Raw Table Component */}
            <MemberTable initialData={data} />
        </section>
    );
};

MembrosPage.displayName = 'DashboardMembros';

export default MembrosPage;
