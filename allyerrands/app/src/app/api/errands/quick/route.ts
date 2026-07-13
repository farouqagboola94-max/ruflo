import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const quickSchema = z.object({
  title: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = quickSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
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

    // Smart priority detection from title
    let priority: 'low' | 'medium' | 'high' = 'medium';
    const titleLower = parsed.data.title.toLowerCase();
    if (titleLower.includes('urgent') || titleLower.includes('!!!') || titleLower.includes('asap')) priority = 'high';
    else if (titleLower.includes('low') || titleLower.startsWith('~')) priority = 'low';

    const errand = await db.errand.create({
      data: {
        title: parsed.data.title.trim(),
        priority,
        status: 'open',
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        userId,
      },
      include: {
        tags: { include: { tag: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        _count: { select: { subtasks: true, notes: true } },
      },
    });

    await db.activity.create({
      data: { action: 'created', errandId: errand.id, details: `Quick-created "${errand.title}"` },
    });

    return NextResponse.json(errand, { status: 201 });
  } catch (error) {
    console.error('Quick add failed:', error);
    return NextResponse.json({ error: 'Failed to create errand' }, { status: 500 });
  }
}