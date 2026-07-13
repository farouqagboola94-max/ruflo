import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Tag name too long'),
  color: z.string().max(7).default('#8b5cf6'),
});

// Helper to get userId from session
async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
  return user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const tags = await db.tag.findMany({
      where: userId ? { userId } : {},
      include: { _count: { select: { errands: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const parsed = tagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const tag = await db.tag.create({
      data: {
        name: parsed.data.name.trim(),
        color: parsed.data.color,
        userId,
      },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 409 });
    }
    console.error('Failed to create tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}