import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note too long'),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = await db.note.findMany({
      where: { errandId: id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
      userId = user?.id ?? null;
    }

    const note = await db.note.create({
      data: {
        content: parsed.data.content,
        errandId: id,
        userId,
      },
    });

    await db.activity.create({
      data: { action: 'updated', errandId: id, details: 'Added a note' },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}