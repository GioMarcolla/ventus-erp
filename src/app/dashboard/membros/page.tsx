import { FC, ReactElement, Suspense } from 'react';
import { IconUserPlus } from '@tabler/icons-react';
import MemberTable from '@/components/MembersTable';
import { getAllMembers } from '@/lib/services/Members.services';

const TableSkeleton = () => (
    <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-3xl border-2 border-slate-100 bg-slate-50">
        <p className="font-bold tracking-widest text-slate-400 uppercase italic">Carregando Membros...</p>
    </div>
);

const MembrosPage: FC = async ({}): Promise<ReactElement> => {
    const data = await getAllMembers();

    return (
        <section className="animate-in fade-in mx-auto max-w-400 p-8 duration-500">
            {/* Page Header */}
            <div className="mb-10 flex items-end justify-between">
                <div>
                    <h1 className="text-ink-dark text-4xl font-black tracking-tight uppercase italic">Membros</h1>
                    <p className="font-medium">Círculo Ítalo-Brasileiro — Gestão de Base</p>
                </div>

                <button className="bg-verde flex items-center gap-2 rounded-full px-6 py-2 font-bold text-white shadow-lg shadow-gray-300 transition-all hover:brightness-125 active:scale-95">
                    <IconUserPlus size={18} />
                    NOVO MEMBRO
                </button>
            </div>

            <Suspense fallback={<TableSkeleton />}>
                <MemberTable initialData={data} />
            </Suspense>
        </section>
    );
};

MembrosPage.displayName = 'DashboardMembros';

export default MembrosPage;
