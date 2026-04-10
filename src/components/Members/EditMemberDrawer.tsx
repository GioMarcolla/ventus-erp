'use client';

import { FC, ReactElement } from 'react';
// import { IconDotsVertical } from '@tabler/icons-react';
import { updateMemberAction } from '@/lib/actions/Members.actions';
import MemberDetailsForm from './MemberDetailsForm';
import { Member } from '@/lib/db/drizzle';

type EditMemberDrawerProps = {
    memberToEdit: Member;
};

/**
 * A functional component that renders a Drawer to add a new member.
 * It wraps a MemberDetailsForm component with a trigger button to open the Drawer.
 * The Drawer will close automatically when the form is submitted successfully.
 * @returns {ReactElement} A React element representing the Drawer to add a new member.
 */
const EditMemberDrawer: FC<EditMemberDrawerProps> = ({ memberToEdit }): ReactElement => {
    return (
        <MemberDetailsForm
            key={memberToEdit?.id ?? 'edit-member'}
            initialData={memberToEdit}
            title="Editar Membro"
            successMessage="Membro editado com sucesso!"
            onSubmitAction={updateMemberAction}
            trigger={onClick => (
                <button
                    onClick={onClick}
                    className="bg-verde flex items-center gap-2 rounded-full px-6 py-2 font-bold text-white shadow-lg hover:cursor-pointer active:scale-95"
                >
                    {/* <IconDotsVertical size={18} /> */}
                    Editar
                </button>
            )}
        />
    );
};

EditMemberDrawer.displayName = 'EditMemberDrawer';

export default EditMemberDrawer;
