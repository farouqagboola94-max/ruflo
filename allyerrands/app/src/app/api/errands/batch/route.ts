import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// POST /api/errands/batch — bulk status update, delete, tag, category, restore
const batchSchema = z.object({
  action: z.enum(['status', 'delete', 'tag', 'category', 'restore']),
  ids: z.array(z.string()).min(1),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  tagIds: z.array(z.string()).optional(),
  categoryId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = batchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const { action, ids } = parsed.data;

    if (action === 'delete') {
      const result = await db.errand.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: new Date() },
      });
      await db.activity.createMany({
        data: ids.map(id => ({ action: 'deleted', errandId: id, details: 'Bulk deleted' })),
      });
      return NextResponse.json({ success: true, count: result.count });
    }

    if (action === 'restore') {
      const result = await db.errand.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: null },
      });
      await db.activity.createMany({
        data: ids.map(id => ({ action: 'reopened', errandId: id, details: 'Restored from trash' })),
      });
      return NextResponse.json({ success: true, count: result.count });
    }

    if (action === 'status' && parsed.data.status) {
      const result = await db.errand.updateMany({
        where: { id: { in: ids } },
        data: { status: parsed.data.status },
      });
      await db.activity.createMany({
        data: ids.map(id => ({ action: 'status_changed', errandId: id, details: `Status changed to ${parsed.data.status}` })),
      });
      return NextResponse.json({ success: true, count: result.count });
    }

    if (action === 'tag' && parsed.data.tagIds) {
      await db.errandTag.deleteMany({ where: { errandId: { in: ids } } });
      if (parsed.data.tagIds.length > 0) {
        await db.errandTag.createMany({
          data: ids.flatMap(errandId =>
            parsed.data.tagIds!.map(tagId => ({ errandId, tagId }))
          ),
        });
      }
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === 'category') {
      const result = await db.errand.updateMany({
        where: { id: { in: ids } },
        data: { categoryId: parsed.data.categoryId ?? null },
      });
      return NextResponse.json({ success: true, count: result.count });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Batch operation failed:', error);
    return NextResponse.json({ error: 'Batch operation failed' }, { status: 500 });
  }
}