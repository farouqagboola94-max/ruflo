import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updates = parsed.data.ids.map((id, index) =>
      db.errand.update({ where: { id }, data: { sortOrder: index } })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder errands:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}