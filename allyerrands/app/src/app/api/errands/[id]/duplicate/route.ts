import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/errands/[id]/duplicate — clone an errand
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const original = await db.errand.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        subtasks: true,
        category: { select: { id: true } },
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Errand not found' }, { status: 404 });
    }

    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
      userId = user?.id ?? null;
    }

    const maxOrder = await db.errand.findFirst({
      where: { deletedAt: null, ...(userId ? { userId } : {}) },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const duplicated = await db.errand.create({
      data: {
        title: `${original.title} (copy)`,
        description: original.description,
        status: 'open',
        priority: original.priority,
        dueDate: original.dueDate,
        estimatedMinutes: original.estimatedMinutes,
        categoryId: original.categoryId,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        userId,
        tags: original.tags.length > 0 ? {
          create: original.tags.map(et => ({ tagId: et.tagId })),
        } : undefined,
        subtasks: original.subtasks.length > 0 ? {
          create: original.subtasks.map((st, i) => ({
            title: st.title,
            completed: false,
            sortOrder: i,
          })),
        } : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        subtasks: true,
        _count: { select: { subtasks: true } },
      },
    });

    await db.activity.create({
      data: { action: 'created', errandId: duplicated.id, details: `Duplicated from "${original.title}"` },
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error('Failed to duplicate errand:', error);
    return NextResponse.json({ error: 'Failed to duplicate errand' }, { status: 500 });
  }
}