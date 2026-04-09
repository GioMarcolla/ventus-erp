import MemberTable from '@/components/Members/MembersTable';
import { getAllMembers } from '@/lib/services/Members.services';
import { FC, ReactElement } from 'react';

/**
 * MembrosPage is a page component that renders a table with all members of the Círculo Ítalo-Brasileiro.
 * It also renders a button to add a new member.
 * The table is wrapped in a Suspense component that renders a skeleton while the data is being fetched.
 */
const MembrosPage: FC = async (): Promise<ReactElement> => {
    const members = await getAllMembers();

    return <MemberTable className="h-full grow" initialData={members} />;
};

export default MembrosPage;
