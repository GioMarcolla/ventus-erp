import MemberTable from '@/components/Members/MembersTable';
import { getAllMembers } from '@/lib/services/Members.services';

/**
 * MembrosPage is a page component that renders a table with all members of the Círculo Ítalo-Brasileiro.
 * It also renders a button to add a new member.
 * The table is wrapped in a Suspense component that renders a skeleton while the data is being fetched.
 */
export default async function MembrosPage() {
    const members = await getAllMembers();

    return <MemberTable className="h-full grow" initialData={members} />;
}
