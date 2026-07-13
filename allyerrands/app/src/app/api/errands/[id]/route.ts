import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const updateErrandSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(2000, 'Description too long').nullable().optional(),
  status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedMinutes: z.number().int().min(1).max(9999).optional().nullable(),
  categoryId: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const errand = await db.errand.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        subtasks: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
        category: { select: { id: true, name: true, color: true, icon: true } },
        notes: { orderBy: { createdAt: 'desc' } },
        _count: { select: { subtasks: true, notes: true } },
      },
    });
    if (!errand) {
      return NextResponse.json({ error: 'Errand not found' }, { status: 404 });
    }
    return NextResponse.json(errand);
  } catch (error) {
    console.error('Failed to fetch errand:', error);
    return NextResponse.json({ error: 'Failed to fetch errand' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = updateErrandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await db.errand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Errand not found' }, { status: 404 });
    }

    const { tagIds, ...data } = parsed.data;
    const updateData: Record<string, unknown> = { ...data };
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    // Auto-set completedAt based on status change
    if (data.status !== undefined && data.status !== existing.status) {
      if (data.status === 'completed') {
        updateData.completedAt = new Date();
      } else if (existing.status === 'completed') {
        // Status changed away from completed
        updateData.completedAt = null;
      }
    }

    // Handle tag updates
    if (tagIds !== undefined) {
      await db.errandTag.deleteMany({ where: { errandId: id } });
      if (tagIds.length > 0) {
        await db.errandTag.createMany({
          data: tagIds.map(tagId => ({ errandId: id, tagId })),
        });
      }
    }

    const errand = await db.errand.update({
      where: { id },
      data: updateData,
      include: {
        tags: { include: { tag: true } },
        subtasks: { select: { id: true, title: true, completed: true } },
        category: { select: { id: true, name: true, color: true, icon: true } },
        _count: { select: { subtasks: true, notes: true } },
      },
    });

    // Log activity
    const changes: string[] = [];
    if (data.title && data.title !== existing.title) changes.push(`title → "${data.title}"`);
    if (data.status && data.status !== existing.status) changes.push(`status → ${data.status}`);
    if (data.priority && data.priority !== existing.priority) changes.push(`priority → ${data.priority}`);
    if (data.categoryId !== undefined && data.categoryId !== existing.categoryId) changes.push(`category changed`);
    if (changes.length > 0) {
      await db.activity.create({
        data: {
          action: data.status ? 'status_changed' : 'updated',
          errandId: id,
          details: changes.join(', '),
        },
      });
    }

    return NextResponse.json(errand);
  } catch (error) {
    console.error('Failed to update errand:', error);
    return NextResponse.json({ error: 'Failed to update errand' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.errand.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Errand not found' }, { status: 404 });
    }

    // Soft delete
    await db.errand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await db.activity.create({
      data: {
        action: 'deleted',
        errandId: id,
        details: `Deleted "${existing.title}"`,
      },
    });

    return NextResponse.json({ success: true, errand: existing });
  } catch (error) {
    console.error('Failed to delete errand:', error);
    return NextResponse.json({ error: 'Failed to delete errand' }, { status: 500 });
  }
}