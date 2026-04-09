'use client';

import { FC, ReactElement, useState, useMemo, HTMLAttributes } from 'react';
import type { Member } from '@/lib/db/drizzle/Member.schema';
import { IconArrowsMoveVertical, IconFilter, IconMail, IconSearch } from '@tabler/icons-react';

interface MemberTableProps extends HTMLAttributes<HTMLDivElement> {
    initialData: Member[];
}

const MemberTable: FC<MemberTableProps> = ({ initialData }): ReactElement => {
    const [filters, setFilters] = useState({ name: '', cpf: '', isActive: '' });

    const filtered = useMemo(() => {
        return initialData.filter(m => {
            const matchesName = m.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesCPF = m.cpf.includes(filters.cpf.replace(/\D/g, ''));
            const matchesStatus = filters.isActive === '' || String(m.isActive) === filters.isActive;
            return matchesName && matchesCPF && matchesStatus;
        });
    }, [initialData, filters]);

    return (
        <div className="border-bg-dark bg-bg-medium overflow-hidden rounded-3xl border-2 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0 text-left">
                    <thead>
                        <tr>
                            <th className="border-bg-darker border-b p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    Nome
                                </label>
                                <div className="relative">
                                    <IconSearch
                                        className="text-ink absolute top-1/2 left-3 -translate-y-1/2"
                                        size={14}
                                    />
                                    <input
                                        className="text-ink-dark border-bg-darker focus:border-gray-900 w-full rounded-full border bg-white py-2 pr-4 pl-9 text-sm transition-all outline-none"
                                        placeholder="Filtrar..."
                                        onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
                                    />
                                </div>
                            </th>
                            <th className="border-bg-darker w-48 border-b p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    CPF
                                </label>
                                <input
                                    className="text-ink-dark rounded-full border-bg-darker w-full border bg-white px-4 py-2 text-sm transition-all outline-none focus:border-gray-900"
                                    placeholder="000..."
                                    onChange={e => setFilters(f => ({ ...f, cpf: e.target.value }))}
                                />
                            </th>
                            <th className="w-40 border-b border-bg-darker p-5">
                                <label className="text-ink-light mb-2 ml-1 block text-xs font-black uppercase">
                                    Status
                                </label>
                                <select
                                    className="w-full text-ink-light cursor-pointer appearance-none rounded-full border border-bg-darker bg-white px-4 py-2 text-sm outline-none focus:border-slate-900"
                                    onChange={e => setFilters(f => ({ ...f, isActive: e.target.value }))}
                                >
                                    <option value="">TODOS</option>
                                    <option value="true">ATIVO</option>
                                    <option value="false">INATIVO</option>
                                </select>
                            </th>
                            <th className="w-16 border-b border-bg-darker p-5 text-center">
                                <IconFilter size={18} className="mx-auto text-ink" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-bg-light">
                        {filtered.map(member => (
                            <tr key={member.id} className="group transition-all hover:bg-slate-50/80">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-bg-light text-xs font-black text-ink-light">
                                            {member.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{member.name}</p>
                                            <p className="flex items-center gap-1 text-xs text-ink-light">
                                                <IconMail size={12} /> {member.email || '—'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 font-mono text-xs text-ink">
                                    {member.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                </td>
                                <td className="p-5">
                                    <span
                                        className={`rounded-lg px-3 py-1 text-xs font-black tracking-widest uppercase ${
                                            member.isActive
                                                ? 'bg-verde-light text-verde'
                                                : 'bg-rosso-light text-rosso'
                                        }`}
                                    >
                                        {member.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="p-5 text-center">
                                    <button className="text-ink-light transition-colors hover:text-slate-900">
                                        <IconArrowsMoveVertical size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filtered.length === 0 && (
                <div className="bg-bg-medium p-20 text-center">
                    <p className="font-medium text-ink-light italic">Nenhum membro encontrado.</p>
                </div>
            )}
        </div>
    );
};

MemberTable.displayName = 'DashboardMemberTable';

export default MemberTable;
