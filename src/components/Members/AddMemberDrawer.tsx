'use client';

import { FC, ReactElement } from 'react';
import { IconUserPlus } from '@tabler/icons-react';
import { createNewMemberAction } from '@/lib/actions/Members.actions';
import MemberDetailsForm from './MemberDetailsForm';

/**
 * A functional component that renders a Drawer to add a new member.
 * It wraps a MemberDetailsForm component with a trigger button to open the Drawer.
 * The Drawer will close automatically when the form is submitted successfully.
 * @returns {ReactElement} A React element representing the Drawer to add a new member.
 */
const AddMemberDrawer: FC = (): ReactElement => {
    return (
        <MemberDetailsForm
            key={'new-member'}
            title="Novo Membro"
            successMessage="Novo membro criado com sucesso!"
            onSubmitAction={createNewMemberAction}
            trigger={onClick => (
                <button
                    onClick={onClick}
                    className="bg-verde flex items-center gap-2 rounded-full px-6 py-2 font-bold text-white shadow-lg hover:cursor-pointer active:scale-95"
                >
                    <IconUserPlus size={18} /> NOVO MEMBRO
                </button>
            )}
        />
    );
};

AddMemberDrawer.displayName = 'AddMemberDrawer';

export default AddMemberDrawer;
