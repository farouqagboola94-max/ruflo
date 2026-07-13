import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const createReminderSchema = z.object({
  type: z.enum(['due_date', 'custom']),
  scheduledAt: z.string().datetime({ message: 'scheduledAt must be a valid datetime string' }),
  minutesBeforeDue: z
    .number()
    .int()
    .min(0)
    .max(525600) // 1 year in minutes
    .optional(),
});

// GET /api/errands/[id]/reminders — list reminders for an errand
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reminders = await db.reminder.findMany({
      where: { errandId: id },
      orderBy: { scheduledAt: 'asc' },
    });
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 },
    );
  }
}

// POST /api/errands/[id]/reminders — create a reminder
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const parsed = createReminderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Verify the errand exists
    const errand = await db.errand.findUnique({ where: { id } });
    if (!errand) {
      return NextResponse.json({ error: 'Errand not found' }, { status: 404 });
    }

    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await db.user.findUnique({
        where: { email: session.user.email as string },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }

    const reminder = await db.reminder.create({
      data: {
        type: parsed.data.type,
        scheduledAt: new Date(parsed.data.scheduledAt),
        errandId: id,
        userId,
      },
    });

    await db.activity.create({
      data: {
        action: 'updated',
        errandId: id,
        details: `Added a ${parsed.data.type} reminder`,
      },
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Failed to create reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 },
    );
  }
}

// DELETE /api/errands/[id]/reminders?reminderId=xxx — delete a specific reminder
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get('reminderId');

    if (!reminderId) {
      return NextResponse.json(
        { error: 'reminderId query parameter is required' },
        { status: 400 },
      );
    }

    // Verify the reminder belongs to this errand
    const reminder = await db.reminder.findFirst({
      where: { id: reminderId, errandId: id },
    });
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    await db.reminder.delete({ where: { id: reminderId } });

    await db.activity.create({
      data: {
        action: 'updated',
        errandId: id,
        details: 'Removed a reminder',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 },
    );
  }
}