import MemberTable from '@/components/Members/MembersTable';
import { GetAllMemberReturnType, getAllMembers } from '@/lib/services/Members.services';
import { FC, ReactElement } from 'react';

/**
 * A functional component that renders a Members table page.
 * It fetches all members from the Members service and renders a MemberTable component.
 * If there is an error while fetching the members, it throws an error with the message.
 *
 * @returns {Promise<ReactElement>} A React element representing the Members table page.
 */
const MembrosPage: FC = async (): Promise<ReactElement> => {
    const { data: members, success, error }: GetAllMemberReturnType = await getAllMembers();

    if (!members || !success || error) {
        throw new Error(error?.message || 'Falha ao carregar membros.');
    }

    return <MemberTable className="h-full grow" members={members} />;
};

export default MembrosPage;
