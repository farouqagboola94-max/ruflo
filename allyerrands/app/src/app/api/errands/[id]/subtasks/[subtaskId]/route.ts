import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const toggleSchema = z.object({
  completed: z.boolean(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const { id, subtaskId } = await params;
    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }
    const subtask = await db.subtask.update({
      where: { id: subtaskId, errandId: id },
      data: { completed: parsed.data.completed },
    });
    // Recalculate parent progress
    const all = await db.subtask.findMany({ where: { errandId: id } });
    const total = all.length;
    const done = all.filter(s => s.completed).length;
    await db.errand.update({ where: { id }, data: { progress: total > 0 ? Math.round((done / total) * 100) : 0 } });
    return NextResponse.json(subtask);
  } catch (error) {
    console.error('Failed to update subtask:', error);
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const { id, subtaskId } = await params;
    await db.subtask.delete({ where: { id: subtaskId, errandId: id } });
    const all = await db.subtask.findMany({ where: { errandId: id } });
    const total = all.length;
    const done = all.filter(s => s.completed).length;
    await db.errand.update({ where: { id }, data: { progress: total > 0 ? Math.round((done / total) * 100) : 0 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete subtask:', error);
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
  }
}