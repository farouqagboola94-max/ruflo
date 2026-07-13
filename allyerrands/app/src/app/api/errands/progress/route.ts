import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const progressSchema = z.object({
  id: z.string().min(1),
  progress: z.number().int().min(0).max(100),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const errand = await db.errand.update({
      where: { id: parsed.data.id },
      data: { progress: parsed.data.progress },
      include: { _count: { select: { subtasks: true, notes: true } } },
    });

    return NextResponse.json(errand);
  } catch (error) {
    console.error('Failed to update progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}