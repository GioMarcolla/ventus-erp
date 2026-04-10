'use client';

import { FC, ReactElement, useId, useState, useTransition, ReactNode, useEffect } from 'react';
import {
    IconX,
    IconDeviceFloppy,
    IconUser,
    IconCheck,
    IconId,
    IconPhone,
    IconMail,
    IconMapPin,
    IconHash,
    IconRefresh,
} from '@tabler/icons-react';
import { Member } from '@/lib/db/drizzle/Member.schema';
import { getNumbersOnly, maskCPF, maskPhone } from '@/lib/utils/string.utils';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { DBErrorType } from '@/lib/utils/dbError.utils';
import { cn } from '@/lib/utils/tailwind.utils';

interface MemberDetailsFormProps {
    title: string;
    trigger: (onClick: () => void) => ReactNode;
    initialData?: Member;
    onSubmitAction: (data: Member) => Promise<{ success: boolean; error?: DBErrorType }>;
    successMessage?: string;
}

const MemberDetailsForm: FC<MemberDetailsFormProps> = ({
    title,
    trigger,
    initialData,
    onSubmitAction,
    successMessage = 'Operação realizada com sucesso!',
}): ReactElement => {
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, startTransition] = useTransition();
    const [error, setError] = useState<DBErrorType | null>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    const [cpfValue, setCpfValue] = useState('');
    const [telefoneValue, setTelefoneValue] = useState('');

    const handleOpen = () => {
        setError(null);
        setCpfValue(initialData?.cpf ? maskCPF(initialData.cpf) : '');
        setTelefoneValue(initialData?.phone ? maskPhone(initialData.phone) : '');
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setError(null);
        clearForm();
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpfValue(maskCPF(e.target.value));
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelefoneValue(maskPhone(e.target.value));
    };

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const rawData = Object.fromEntries(formData.entries());
            const cleanCPF = getNumbersOnly(String(rawData.cpf));

            const payload = {
                ...initialData,
                firstName: String(rawData.firstName),
                middleName: String(rawData.middleName) || null,
                lastName: String(rawData.lastName),
                email: String(rawData.email) || null,
                phone: String(rawData.phone) || null,
                street: String(rawData.street),
                number: String(rawData.number),
                apartment: String(rawData.apartment) || null,
                distric: String(rawData.distric),
                city: String(rawData.city),
                state: String(rawData.state),
                cep: String(rawData.cep),
                country: 'Brasil',
                reference: String(rawData.reference) || null,
                isActive: rawData.isActive === 'true',
            } as Member;

            // Only add CPF if it's a new member
            // Double protection against unwanted changes
            if (!initialData) {
                payload.cpf = cleanCPF;
            }

            const { success, error: actionError } = await onSubmitAction(payload);

            if (success) {
                setIsModalOpen(true);
            } else if (actionError) {
                setError(actionError);
            }
        });
    };

    const clearForm = () => {
        setCpfValue('');
        setTelefoneValue('');

        const formElement = document.getElementById(id + '-form') as HTMLFormElement;
        if (formElement) {
            formElement.reset();
        }

        setError(null);
    };

    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                    setIsOpen(false);
                }}
                header={successMessage}
                icon={
                    <div className="bg-accent-light text-accent m-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                        <IconCheck size={32} />
                    </div>
                }
                confirmButton={
                    <button className="bg-accent text-accent-light flex w-full items-center justify-center gap-2 rounded-full py-2 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95">
                        Confirmar
                    </button>
                }
            />

            {trigger(handleOpen)}

            <div
                className={cn(
                    'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={() => {
                    if (!isSaving) handleClose();
                }}
            />

            <aside
                className={cn(
                    'bg-bg-light border-bg-dark fixed top-0 right-0 z-50 h-full w-full min-w-2xl border-l-2 text-left shadow-2xl transition-transform duration-500 ease-in-out sm:max-w-md lg:max-w-[33%]',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                {isSaving && (
                    <div className="absolute top-0 right-0 z-10 flex h-full w-full items-center justify-center gap-4 backdrop-blur-lg">
                        <IconRefresh size={36} className="text-ink-light animate-reverse-spin" />
                        <span className="text-ink-light text-2xl font-bold italic">Salvando dados . . .</span>
                    </div>
                )}
                <div className="flex h-full flex-col">
                    <header className="border-bg-dark flex items-center justify-between border-b-2 p-6">
                        <div className="flex items-center gap-3 text-left">
                            <div className="bg-accent/10 text-accent rounded-xl p-2">
                                <IconUser size={24} />
                            </div>
                            <h2 className="text-ink-dark text-left text-xl font-black tracking-tight uppercase italic">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-ink-light hover:text-contrast p-2 transition-colors hover:cursor-pointer"
                        >
                            <IconX size={24} />
                        </button>
                    </header>

                    <form
                        id={id + '-form'}
                        action={handleSubmit}
                        className="grow space-y-6 overflow-y-auto p-8 text-left"
                    >
                        {error && (
                            <div className="bg-contrast-light text-contrast rounded-xl p-4 text-left text-sm font-bold">
                                {error.constraint === 'members_cpf_unique' ? 'CPF já cadastrado' : error.message}
                            </div>
                        )}

                        <div className="space-y-4">
                            <p className="text-ink-light flex items-center gap-2 text-left text-[10px] font-black tracking-widest uppercase">
                                <span className="bg-bg-dark h-px grow"></span> Identificação
                            </p>

                            <div className="flex flex-col gap-1 text-left">
                                <label
                                    htmlFor={`${id}-first-name`}
                                    className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                >
                                    Primeiro Nome
                                </label>
                                <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                    <IconUser className="text-ink-lighter" size={18} />
                                    <input
                                        disabled={isSaving}
                                        id={`${id}-first-name`}
                                        name="firstName"
                                        defaultValue={initialData?.firstName ?? ''}
                                        required
                                        className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                                <label
                                    htmlFor={`${id}-middle-name`}
                                    className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                >
                                    Nome do meio
                                </label>
                                <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                    <IconUser className="text-ink-lighter" size={18} />
                                    <input
                                        disabled={isSaving}
                                        id={`${id}-middle-name`}
                                        name="middleName"
                                        defaultValue={initialData?.middleName ?? ''}
                                        className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                                <label
                                    htmlFor={`${id}-last-name`}
                                    className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                >
                                    Sobrenome
                                </label>
                                <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                    <IconUser className="text-ink-lighter" size={18} />
                                    <input
                                        disabled={isSaving}
                                        id={`${id}-last-name`}
                                        name="lastName"
                                        defaultValue={initialData?.lastName ?? ''}
                                        required
                                        className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-cpf`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        CPF
                                    </label>
                                    <div
                                        className={cn(
                                            'border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors',
                                            error?.constraint === 'members_cpf_unique' &&
                                                'border-contrast ring-contrast/20 border-2 ring-1',
                                        )}
                                    >
                                        <IconId className="text-ink-lighter" size={18} />
                                        <input
                                            id={`${id}-cpf`}
                                            name="cpf"
                                            value={cpfValue}
                                            onChange={handleCpfChange}
                                            required
                                            maxLength={14}
                                            disabled={!!initialData?.cpf || isSaving}
                                            className={cn(
                                                'w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0',
                                                !!initialData?.cpf && 'cursor-not-allowed',
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-phone`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Telefone
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <IconPhone className="text-ink-lighter" size={18} />
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-phone`}
                                            name="phone"
                                            value={telefoneValue}
                                            onChange={handleTelefoneChange}
                                            required
                                            maxLength={15}
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                                <label
                                    htmlFor={`${id}-email`}
                                    className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                >
                                    E-mail
                                </label>
                                <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                    <IconMail className="text-ink-lighter" size={18} />
                                    <input
                                        disabled={isSaving}
                                        id={`${id}-email`}
                                        name="email"
                                        type="email"
                                        defaultValue={initialData?.email ?? ''}
                                        className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                            {/* Status do Membro (Switch Deslizante) */}
                            <div className="space-y-4 pt-2">
                                <p className="text-ink-light flex items-center gap-2 text-left text-[10px] font-black tracking-widest uppercase">
                                    <span className="bg-bg-dark h-px grow"></span> Status da Conta
                                </p>

                                <div className='flex flex-col gap-2'>
                                    <p className="text-ink-dark grow text-sm font-medium">Conta Ativa?</p>

                                    {/* Container do Switch */}
                                    <label
                                        htmlFor={`${id}-active-switch`}
                                        className="relative inline-flex h-8 w-16 cursor-pointer items-center rounded-full transition-colors peer-disabled:cursor-not-allowed"
                                    >
                                        {/* Checkbox Escondido (Controlador) */}
                                        <input
                                            type="checkbox"
                                            id={`${id}-active-switch`}
                                            name="active_checkbox" // Nome temporário para o checkbox
                                            defaultChecked={initialData?.isActive !== false}
                                            disabled={isSaving}
                                            className="peer sr-only"
                                            onChange={e => {
                                                // Atualiza o input hidden real com o valor booleano em string
                                                const hiddenInput = document.getElementById(
                                                    `${id}-active-hidden`,
                                                ) as HTMLInputElement;
                                                if (hiddenInput) hiddenInput.value = String(e.target.checked);
                                            }}
                                        />

                                        {/* Input Hidden Real (O que vai no FormData) */}
                                        <input
                                            type="hidden"
                                            id={`${id}-active-hidden`}
                                            name="isActive" // O nome real do campo no banco
                                            value={String(initialData?.isActive !== false)}
                                        />

                                        {/* O Fundo da Pílula (Muda de cor Verde/Vermelho) */}
                                        <div className="bg-contrast peer-checked:bg-accent absolute inset-0 rounded-full transition-colors peer-disabled:opacity-50"></div>

                                        {/* Ícones de Fundo (X e Check) */}
                                        <div className="text-contrast-light peer-checked:text-accent-light absolute inset-0 flex items-center justify-between px-2">
                                            <IconCheck size={16} strokeWidth={3} />
                                            <IconX size={16} strokeWidth={3} />
                                        </div>

                                        {/* O "Dedão" (Thumb) que desliza */}
                                        <div className="peer-disabled:bg-bg-light absolute left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-8"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 text-left">
                            <p className="text-ink-light flex items-center gap-2 text-left text-[10px] font-black tracking-widest uppercase">
                                <span className="bg-bg-dark h-px grow text-left"></span> <IconMapPin size={14} />{' '}
                                Endereço
                            </p>

                            <div className="grid grid-cols-3 gap-4 text-left">
                                <div className="col-span-1 flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-cep`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        CEP
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-cep`}
                                            name="cep"
                                            defaultValue={initialData?.cep ?? ''}
                                            required
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-street`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Logradouro
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-street`}
                                            name="street"
                                            defaultValue={initialData?.street ?? ''}
                                            required
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-left">
                                <div className="flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-num`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Nº
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <IconHash size={16} className="text-ink-lighter" />
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-num`}
                                            name="number"
                                            defaultValue={initialData?.number ?? ''}
                                            required
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-ap`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Compl.
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-ap`}
                                            name="apartment"
                                            defaultValue={initialData?.apartment ?? ''}
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-bairro`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Bairro
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-bairro`}
                                            name="district"
                                            defaultValue={initialData?.district ?? ''}
                                            required
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-left">
                                <div className="col-span-3 flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-city`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        Cidade
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-city`}
                                            name="city"
                                            defaultValue={initialData?.city ?? ''}
                                            required
                                            className="w-full grow border-none bg-transparent text-left ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 flex flex-col gap-1 text-left">
                                    <label
                                        htmlFor={`${id}-state`}
                                        className="text-ink-dark ml-3 text-left text-[10px] font-bold tracking-wider uppercase"
                                    >
                                        UF
                                    </label>
                                    <div className="border-bg-dark focus-within:border-accent flex items-center gap-2 rounded-full border bg-white px-4 py-2 transition-colors">
                                        <input
                                            disabled={isSaving}
                                            id={`${id}-state`}
                                            name="state"
                                            defaultValue={initialData?.state ?? ''}
                                            required
                                            maxLength={2}
                                            className="w-full grow border-none bg-transparent text-left uppercase ring-0 outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <footer className="border-bg-dark border-t-2 p-6 text-left">
                        <button
                            type="submit"
                            form={id + '-form'}
                            disabled={isSaving}
                            className="bg-accent flex w-full items-center justify-center gap-2 rounded-full py-4 font-black text-white uppercase shadow-lg transition-all hover:cursor-pointer hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving ? (
                                'Processando...'
                            ) : (
                                <>
                                    <IconDeviceFloppy size={20} /> Salvar Cadastro
                                </>
                            )}
                        </button>
                    </footer>
                </div>
            </aside>
        </>
    );
};

MemberDetailsForm.displayName = 'MemberDetailsForm';

export default MemberDetailsForm;
