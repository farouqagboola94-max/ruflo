import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const settingsSchema = z.object({
  defaultView: z.string().optional(),
  defaultSort: z.string().optional(),
  showCharts: z.boolean().optional(),
  compactMode: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ defaultView: 'all', defaultSort: 'newest', showCharts: true, compactMode: false });
    }
    const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
    if (!user) return NextResponse.json({ defaultView: 'all', defaultSort: 'newest', showCharts: true, compactMode: false });

    let settings = await db.userSettings.findUnique({ where: { userId: user.id } });
    if (!settings) {
      settings = await db.userSettings.create({ data: { userId: user.id } });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const settings = await db.userSettings.upsert({
      where: { userId: user.id },
      update: parsed.data,
      create: { userId: user.id, ...parsed.data },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}