import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

const createErrandSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional().nullable(),
  estimatedMinutes: z.number().int().min(1).max(9999).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const hasDueDate = searchParams.get('hasDueDate');
    const overdue = searchParams.get('overdue');

    // Pagination & sorting
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy');

    const isPaginated = pageParam !== null || limitParam !== null;
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam || '50', 10) || 50));

    const validSortValues = ['newest', 'oldest', 'priority-high', 'priority-low', 'due-date', 'alpha'] as const;
    const sortValue = validSortValues.includes(sortBy as typeof validSortValues[number])
      ? (sortBy as typeof validSortValues[number])
      : null;

    let where: Prisma.ErrandWhereInput = { deletedAt: null };

    if (session?.user?.email) {
      where.user = { email: session.user.email as string };
    }
    if (status && status !== 'all') {
      where.status = status;
    }
    if (tag) {
      where.tags = { some: { tag: { name: tag } } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (priority && priority !== 'all') {
      where.priority = priority;
    }
    if (category && category !== 'all') {
      where.categoryId = category;
    }
    if (dateFrom) {
      where.dueDate = { ...(where.dueDate as Prisma.DateTimeNullableFilter || {}), gte: new Date(dateFrom) };
    }
    if (dateTo) {
      where.dueDate = { ...(where.dueDate as Prisma.DateTimeNullableFilter || {}), lte: new Date(dateTo) };
    }
    if (hasDueDate === 'true') {
      where.dueDate = { ...(where.dueDate as Prisma.DateTimeNullableFilter || {}), not: null };
    }
    if (overdue === 'true') {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'completed' };
    }

    const finalWhere = Object.keys(where).length > 1 || (Object.keys(where).length === 1 && !where.deletedAt) ? where : { deletedAt: null };

    // For priority-high/priority-low or due-date sorting (nulls last), fetch all then sort in JS
    const needsJSSort = sortValue === 'priority-high' || sortValue === 'priority-low' || sortValue === 'due-date';

    const includeClause = {
      tags: { include: { tag: true } },
      subtasks: { select: { id: true, title: true, completed: true } },
      category: { select: { id: true, name: true, color: true, icon: true } },
      _count: { select: { subtasks: true, notes: true } },
    };

    if (isPaginated || needsJSSort) {
      const total = await db.errand.count({ where: finalWhere });

      // Determine Prisma orderBy when possible
      let prismaOrderBy: Prisma.ErrandOrderByWithRelationInput[] | undefined;
      if (!needsJSSort) {
        switch (sortValue) {
          case 'newest':
            prismaOrderBy = [{ createdAt: 'desc' }];
            break;
          case 'oldest':
            prismaOrderBy = [{ createdAt: 'asc' }];
            break;
          case 'alpha':
            prismaOrderBy = [{ title: 'asc' }];
            break;
          default:
            prismaOrderBy = [{ sortOrder: 'asc' }, { createdAt: 'desc' }];
        }
      } else {
        // For JS-sorted queries, fetch all matching records without pagination from DB
        prismaOrderBy = [{ sortOrder: 'asc' }, { createdAt: 'desc' }];
      }

      let errands;
      if (needsJSSort) {
        errands = await db.errand.findMany({
          where: finalWhere,
          orderBy: prismaOrderBy,
          include: includeClause,
        });

        // Sort in JS
        if (sortValue === 'priority-high') {
          errands.sort((a, b) => {
            const aP = PRIORITY_ORDER[a.priority] ?? 1;
            const bP = PRIORITY_ORDER[b.priority] ?? 1;
            if (aP !== bP) return aP - bP;
            return b.createdAt.getTime() - a.createdAt.getTime();
          });
        } else if (sortValue === 'priority-low') {
          errands.sort((a, b) => {
            const aP = PRIORITY_ORDER[a.priority] ?? 1;
            const bP = PRIORITY_ORDER[b.priority] ?? 1;
            if (aP !== bP) return bP - aP;
            return b.createdAt.getTime() - a.createdAt.getTime();
          });
        } else if (sortValue === 'due-date') {
          errands.sort((a, b) => {
            // Nulls last
            if (a.dueDate === null && b.dueDate === null) return 0;
            if (a.dueDate === null) return 1;
            if (b.dueDate === null) return -1;
            return a.dueDate.getTime() - b.dueDate.getTime();
          });
        }

        // Apply JS-side pagination after sorting
        const start = (page - 1) * limit;
        errands = errands.slice(start, start + limit);
      } else {
        errands = await db.errand.findMany({
          where: finalWhere,
          orderBy: prismaOrderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: includeClause,
        });
      }

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        data: errands,
        pagination: { page, limit, total, totalPages },
      });
    }

    // Legacy behavior: no pagination params → return flat array
    const errands = await db.errand.findMany({
      where: finalWhere,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: includeClause,
    });

    return NextResponse.json(errands);
  } catch (error) {
    console.error('Failed to fetch errands:', error);
    return NextResponse.json({ error: 'Failed to fetch errands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const parsed = createErrandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const userWhere = session?.user?.email ? { email: session.user.email as string } : undefined;
    const maxOrder = await db.errand.findFirst({
      where: userWhere ? { user: userWhere, deletedAt: null } : { deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await db.user.findUnique({ where: { email: session.user.email as string }, select: { id: true } });
      userId = user?.id ?? null;
    }

    const errand = await db.errand.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        priority: parsed.data.priority,
        status: 'open',
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        estimatedMinutes: parsed.data.estimatedMinutes ?? null,
        categoryId: parsed.data.categoryId ?? null,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        userId,
        tags: parsed.data.tagIds
          ? {
              create: parsed.data.tagIds.map(tagId => ({ tagId })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        subtasks: true,
        category: { select: { id: true, name: true, color: true, icon: true } },
        _count: { select: { subtasks: true, notes: true } },
      },
    });

    await db.activity.create({
      data: {
        action: 'created',
        errandId: errand.id,
        details: `Created "${errand.title}"`,
      },
    });

    return NextResponse.json(errand, { status: 201 });
  } catch (error) {
    console.error('Failed to create errand:', error);
    return NextResponse.json({ error: 'Failed to create errand' }, { status: 500 });
  }
}