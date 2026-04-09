import { db } from '@/lib/db/client';
import { members, NewMember } from '@/lib/db/drizzle/Member.schema';
import { desc, isNull, and, eq } from 'drizzle-orm';

const getAllMembers = async () => {
    return await db.select().from(members).where(isNull(members.deletedAt)).orderBy(desc(members.createdAt));
};

const updateMember = async (memberId: string, data: Partial<NewMember>, user: { id: string; level: number }) => {
    if (user.level >= 200) {
        return await db.update(members).set(data).where(eq(members.id, memberId));
    }

    return await db
        .update(members)
        .set(data)
        .where(
            and(
                eq(members.id, memberId),
                eq(members.createdBy, user.id), // Only edit if I created! This is double safety after frontend checks.
            ),
        );
};

export { getAllMembers, updateMember };
