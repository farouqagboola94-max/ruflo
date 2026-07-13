import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const subtaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtasks = await db.subtask.findMany({
      where: { errandId: id },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(subtasks);
  } catch (error) {
    console.error('Failed to fetch subtasks:', error);
    return NextResponse.json({ error: 'Failed to fetch subtasks' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = subtaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const maxOrder = await db.subtask.findFirst({
      where: { errandId: id },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const subtask = await db.subtask.create({
      data: {
        title: parsed.data.title,
        errandId: id,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    });

    // Recalculate parent errand progress
    const allSubtasks = await db.subtask.findMany({ where: { errandId: id } });
    const total = allSubtasks.length;
    const done = allSubtasks.filter(s => s.completed).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    await db.errand.update({ where: { id }, data: { progress } });

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error('Failed to create subtask:', error);
    return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 });
  }
}