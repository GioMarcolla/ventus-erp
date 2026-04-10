'use client';

import { FC, ReactElement, useState, useMemo, HTMLAttributes, useTransition } from 'react';
import type { Member } from '@/lib/db/drizzle/Member.schema';
import { IconFilter, IconMail, IconRefresh, IconSearch } from '@tabler/icons-react';
import { cn } from '@/lib/utils/tailwind.utils';
import EditMemberDrawer from './EditMemberDrawer';
import { useRouter } from 'next/navigation';

interface MemberTableProps extends HTMLAttributes<HTMLDivElement> {
    members: Member[];
    dataErrorMsg?: string | null;
}

/**
 * A table component that renders a list of members.
 * It accepts an array of members, an error message and a className.
 * The component will filter the members according to the search name, CPF and status.
 * If there is an error message, it will render a div with the error message.
 * If there are no members, it will render a div with a message saying that no members were found.
 *
 * @param {MemberTableProps} props - The props object to pass to the component.
 * @param {Member[]} props.members - The array of members to render.
 * @param {string | null} props.dataErrorMsg - The error message to render if there is no members.
 * @param {React.HTMLAttributes<HTMLDivElement>} props.className - The className to pass to the component.
 * @returns {ReactElement} - A React element representing the Members table component.
 */
const MemberTable: FC<MemberTableProps> = ({ members, dataErrorMsg, className }): ReactElement => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState({ searchName: '', cpf: '', isActive: '' });

    const filtered = useMemo(() => {
        return members.filter(m => {
            // Criamos uma string única com o nome completo para a busca
            const fullName = `${m.firstName} ${m.middleName ?? ''} ${m.lastName}`.toLowerCase();
            const matchesName = fullName.includes(filters.searchName.toLowerCase());

            const matchesCPF = m.cpf.includes(filters.cpf.replace(/\D/g, ''));
            const matchesStatus = filters.isActive === '' || String(m.isActive) === filters.isActive;

            return matchesName && matchesCPF && matchesStatus;
        });
    }, [members, filters]);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div
            className={cn(
                'border-bg-dark bg-bg-medium relative flex h-full flex-col gap-0 overflow-hidden rounded-3xl border-2',
                className,
            )}
        >
            {isPending && (
                <div className="absolute top-0 right-0 z-10 flex h-full w-full items-center justify-center gap-4 backdrop-blur-lg">
                    <IconRefresh size={36} className="text-ink-light animate-reverse-spin" />
                    <span className="text-ink-light text-2xl font-bold italic">Buscando dados atualizados . . .</span>
                </div>
            )}
            <div className="grow overflow-x-auto">
                <table className="w-full border-collapse text-left" aria-disabled={isPending}>
                    <thead>
                        <tr>
                            <th className="border-bg-darker border-b p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    Membro
                                </label>
                                <div className="relative">
                                    <IconSearch
                                        className="text-ink absolute top-1/2 left-3 -translate-y-1/2"
                                        size={14}
                                    />
                                    <input
                                        className="text-ink-dark border-bg-darker focus:border-selected w-full rounded-full border bg-white py-2 pr-4 pl-9 text-sm transition-all outline-none"
                                        placeholder="Buscar por nome..."
                                        onChange={e => setFilters(f => ({ ...f, searchName: e.target.value }))}
                                        disabled={!members.length}
                                    />
                                </div>
                            </th>
                            <th className="border-bg-darker w-48 border-b p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    CPF
                                </label>
                                <input
                                    className="text-ink-dark border-bg-darker focus:border-selected w-full rounded-full border bg-white px-4 py-2 text-sm transition-all outline-none"
                                    placeholder="000..."
                                    onChange={e => setFilters(f => ({ ...f, cpf: e.target.value }))}
                                    disabled={!members.length}
                                />
                            </th>
                            <th className="border-bg-darker w-40 border-b p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    Status
                                </label>
                                <select
                                    className="text-ink-light border-bg-darker focus:border-selected w-full cursor-pointer appearance-none rounded-full border bg-white px-4 py-2 text-sm outline-none"
                                    onChange={e => setFilters(f => ({ ...f, isActive: e.target.value }))}
                                    disabled={!members.length}
                                >
                                    <option value="">TODOS</option>
                                    <option value="true">ATIVO</option>
                                    <option value="false">INATIVO</option>
                                </select>
                            </th>
                            <th className="border-bg-darker w-16 border-b p-5 text-center">
                                <IconFilter size={18} className="text-ink mx-auto" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!dataErrorMsg &&
                            filtered.map((member, index) => {
                                return (
                                    <tr
                                        key={member.id}
                                        className={cn(
                                            'group hover:bg-contrast-light border-bg-dark border-b transition-all',
                                            index % 2 === 0 ? 'bg-bg-dark/50' : 'bg-bg-medium',
                                        )}
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="text-ink-light flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-xs font-black uppercase">
                                                    {member.firstName[0]}
                                                    {member.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="leading-tight font-bold text-slate-900">
                                                        {member.firstName} {member.middleName || ''} {member.lastName}
                                                    </p>
                                                    <p className="text-ink-light flex items-center gap-1 text-xs">
                                                        <IconMail size={12} /> {member.email || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-ink p-5 font-mono text-xs">
                                            {member.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                        </td>
                                        <td className="p-5">
                                            <span
                                                className={`rounded-lg px-3 py-1 text-xs font-black tracking-widest uppercase ${
                                                    member.isActive
                                                        ? 'bg-accent-light text-accent'
                                                        : 'bg-contrast-light text-contrast'
                                                }`}
                                            >
                                                {member.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <EditMemberDrawer memberToEdit={member} />
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            {filtered.length === 0 && (
                <div className="bg-bg-medium p-20 text-center">
                    <p className="text-ink-light font-medium italic">Nenhum membro encontrado.</p>
                </div>
            )}
            <div className="border-bg-darker relative flex w-full shrink flex-row items-center justify-center border-t p-4">
                <p className="text-ink-light text-sm">Total de Membros carregados: {filtered.length}</p>
                <button
                    onClick={handleRefresh}
                    className="hover:bg-contrast-light absolute right-2 flex items-center justify-center rounded-md p-2 hover:cursor-pointer"
                >
                    <IconRefresh size={16} className={cn('text-contrast')} />
                </button>
            </div>
        </div>
    );
};

MemberTable.displayName = 'DashboardMemberTable';

export default MemberTable;
