import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Category name too long'),
  color: z.string().max(7).default('#8b5cf6'),
  icon: z.string().max(30).default('folder'),
});

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
  return user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    const categories = await db.category.findMany({
      where: userId ? { userId } : {},
      include: { _count: { select: { errands: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const maxOrder = await db.category.findFirst({
      where: userId ? { userId } : {},
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const category = await db.category.create({
      data: {
        name: parsed.data.name.trim(),
        color: parsed.data.color,
        icon: parsed.data.icon,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        userId,
      },
      include: { _count: { select: { errands: true } } },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}