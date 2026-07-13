import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/trash — list soft-deleted errands
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userWhere = session?.user?.email ? { email: session.user.email as string } : undefined;
    const user = userWhere ? await db.user.findUnique({ where: userWhere, select: { id: true } }) : null;

    const where: Record<string, unknown> = { deletedAt: { not: null } };
    if (user) where.userId = user.id;

    const trashed = await db.errand.findMany({
      where,
      orderBy: { deletedAt: 'desc' },
      include: { tags: { include: { tag: true } }, category: { select: { id: true, name: true, color: true } } },
    });

    return NextResponse.json(trashed);
  } catch (error) {
    console.error('Failed to fetch trash:', error);
    return NextResponse.json({ error: 'Failed to fetch trash' }, { status: 500 });
  }
}