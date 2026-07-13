import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  tagIds: z.array(z.string()),
});

// POST /api/errands/[id]/tags — set tags for an errand
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    // Delete existing, create new
    await db.errandTag.deleteMany({ where: { errandId: id } });
    await db.errandTag.createMany({
      data: parsed.data.tagIds.map(tagId => ({ errandId: id, tagId })),
    });

    const tags = await db.errandTag.findMany({
      where: { errandId: id },
      include: { tag: true },
    });
    return NextResponse.json(tags.map(et => et.tag));
  } catch (error) {
    console.error('Failed to set tags:', error);
    return NextResponse.json({ error: 'Failed to set tags' }, { status: 500 });
  }
}

// GET /api/errands/[id]/tags — get tags for an errand
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const errandTags = await db.errandTag.findMany({
      where: { errandId: id },
      include: { tag: true },
    });
    return NextResponse.json(errandTags.map(et => et.tag));
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}