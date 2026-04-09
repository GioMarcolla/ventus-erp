'use client';

import { IconAlertCircle, IconLogout, IconX } from '@tabler/icons-react';
import { FC, HTMLAttributes, ReactElement, useEffect } from 'react';

interface ConfirmModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

/**
 * ConfirmModal is a modal component that renders a confirmation dialog
 * with a title, description, and two buttons (Cancel and Confirm).
 * It handles the "Esc" key to close the modal.
 * @param {boolean} isOpen - Whether the modal should be open
 * @param {function} onClose - Callback to close the modal
 * @param {function} onConfirm - Callback to confirm the action
 * @param {string} title - Title of the modal
 * @param {string} description - Description of the modal
 * @returns {ReactElement | null} - The rendered modal or null if isOpen is false
 */
const ConfirmModal: FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
}): ReactElement | null => {
    // Handle "Esc" key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/50">
            {/* Backdrop: Absolute positioning to cover the screen */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal Box: Centered via Flexbox parent */}
            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
                {/* Close Button (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 transition-colors hover:text-slate-600"
                >
                    <IconX size={20} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <IconAlertCircle size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                        <p className="mt-2 leading-relaxed text-slate-500">{description}</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95"
                        >
                            <IconLogout size={18} />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
