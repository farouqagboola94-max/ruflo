import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/errands/undo — restore a soft-deleted errand
export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const errand = await db.errand.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });

    if (!errand || !errand.deletedAt) {
      return NextResponse.json({ error: 'Errand not found or not deleted' }, { status: 404 });
    }

    const restored = await db.errand.update({
      where: { id },
      data: { deletedAt: null },
    });

    await db.activity.create({
      data: {
        action: 'reopened',
        errandId: id,
        details: 'Restored from trash',
      },
    });

    return NextResponse.json(restored);
  } catch (error) {
    console.error('Failed to undo delete:', error);
    return NextResponse.json({ error: 'Failed to undo delete' }, { status: 500 });
  }
}