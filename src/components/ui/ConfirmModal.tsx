import { FC, HTMLAttributes, ReactElement, ReactNode, useEffect } from 'react';

interface ConfirmModalProps extends HTMLAttributes<HTMLDivElement> {
    icon?: ReactNode;
    header?: ReactNode | string;
    body?: ReactNode | string;
    confirmButton?: ReactNode;
    cancelButton?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

/**
 * A functional component that renders a confirm modal.
 * It can be used to confirm user actions, such as deleting a resource.
 * The modal can be closed by clicking on the cancel button or pressing the Escape key.
 * The modal can be confirmed by clicking on the confirm button or pressing the Enter key.
 *
 * @param {ConfirmModalProps} props - The props object to pass to the component.
 * @param {ReactNode} props.icon - An optional icon to display in the modal header.
 * @param {ReactNode | string} props.header - The header of the modal.
 * @param {ReactNode | string} props.body - The body of the modal.
 * @param {ReactNode} props.confirmButton - The confirm button of the modal.
 * @param {ReactNode} props.cancelButton - The cancel button of the modal.
 * @param {boolean} props.isOpen - Whether the modal is open or not.
 * @param {() => void} props.onClose - A function to call when the modal is closed.
 * @param {() => void} props.onConfirm - A function to call when the modal is confirmed.
 */
const ConfirmModal: FC<ConfirmModalProps> = ({
    icon,
    header,
    body,
    confirmButton,
    cancelButton,
    isOpen,
    onClose,
    onConfirm,
}): ReactElement | null => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="animate-in fade-in fixed inset-0 z-999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm duration-300">
            <div className="animate-in zoom-in-95 bg-bg-light w-full max-w-md rounded-3xl p-8 text-start shadow-2xl duration-300">
                {icon && icon}

                {header && header instanceof Object ? (
                    <div>{header}</div>
                ) : (
                    <h2 className="text-ink-dark mb-4 text-2xl font-black tracking-tight uppercase italic">{header}</h2>
                )}

                {body && body instanceof Object ? <div>{body}</div> : <p className="text-ink font-medium">{body}</p>}

                {(confirmButton || cancelButton) && (
                    <div className="flex flex-col gap-2 mt-8">
                        {confirmButton && <div onClick={onConfirm}>{confirmButton}</div>}
                        {cancelButton && <div onClick={onClose}>{cancelButton}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;
