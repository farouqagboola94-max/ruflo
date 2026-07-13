import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /api/search — advanced full-text search across errands, tags, categories
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const raw = {
      q: searchParams.get('q') ?? '',
      limit: searchParams.get('limit') ?? '20',
      offset: searchParams.get('offset') ?? '0',
    };

    const parsed = searchQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { q, limit, offset } = parsed.data;
    const query = q.toLowerCase();

    // Resolve user for isolation
    const userWhere = session?.user?.email
      ? { email: session.user.email as string }
      : undefined;
    const user = userWhere
      ? await db.user.findUnique({ where: userWhere, select: { id: true } })
      : null;
    const errandWhere: Record<string, unknown> = {};
    if (user) errandWhere.userId = user.id;
    const tagWhere = user ? { userId: user.id } : {};
    const catWhere = user ? { userId: user.id } : {};

    // Search errands by title and description
    const [errandsByTitle, errandsByDesc] = await Promise.all([
      db.errand.findMany({
        where: {
          ...errandWhere,
          deletedAt: null,
          title: { contains: q },
        },
        include: {
          category: { select: { id: true, name: true, color: true, icon: true } },
          tags: { include: { tag: true } },
          _count: { select: { subtasks: true, notes: true } },
        },
        take: limit + offset,
        orderBy: { updatedAt: 'desc' },
      }),
      db.errand.findMany({
        where: {
          ...errandWhere,
          deletedAt: null,
          description: { contains: q },
          title: { not: { contains: q } }, // avoid duplicates with title match
        },
        include: {
          category: { select: { id: true, name: true, color: true, icon: true } },
          tags: { include: { tag: true } },
          _count: { select: { subtasks: true, notes: true } },
        },
        take: limit + offset,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    // Also search errands by associated tag names
    const matchingTags = await db.tag.findMany({
      where: { ...tagWhere, name: { contains: q } },
      select: { id: true, name: true, color: true },
    });
    const matchingTagIds = matchingTags.map((t) => t.id);

    let errandsByTag: typeof errandsByTitle = [];
    if (matchingTagIds.length > 0) {
      const existingIds = new Set([
        ...errandsByTitle.map((e) => e.id),
        ...errandsByDesc.map((e) => e.id),
      ]);
      errandsByTag = await db.errand.findMany({
        where: {
          ...errandWhere,
          deletedAt: null,
          id: { notIn: Array.from(existingIds) },
          tags: { some: { tagId: { in: matchingTagIds } } },
        },
        include: {
          category: { select: { id: true, name: true, color: true, icon: true } },
          tags: { include: { tag: true } },
          _count: { select: { subtasks: true, notes: true } },
        },
        take: limit + offset,
        orderBy: { updatedAt: 'desc' },
      });
    }

    // Also search errands by associated category names
    const matchingCategories = await db.category.findMany({
      where: { ...catWhere, name: { contains: q } },
      select: { id: true, name: true, color: true, icon: true },
    });
    const matchingCatIds = matchingCategories.map((c) => c.id);

    let errandsByCategory: typeof errandsByTitle = [];
    if (matchingCatIds.length > 0) {
      const existingIds = new Set([
        ...errandsByTitle.map((e) => e.id),
        ...errandsByDesc.map((e) => e.id),
        ...errandsByTag.map((e) => e.id),
      ]);
      errandsByCategory = await db.errand.findMany({
        where: {
          ...errandWhere,
          deletedAt: null,
          id: { notIn: Array.from(existingIds) },
          categoryId: { in: matchingCatIds },
        },
        include: {
          category: { select: { id: true, name: true, color: true, icon: true } },
          tags: { include: { tag: true } },
          _count: { select: { subtasks: true, notes: true } },
        },
        take: limit + offset,
        orderBy: { updatedAt: 'desc' },
      });
    }

    // Merge errands and deduplicate, then paginate
    const allErrands = [
      ...errandsByTitle,
      ...errandsByDesc,
      ...errandsByTag,
      ...errandsByCategory,
    ];
    const seenIds = new Set<string>();
    const uniqueErrands = allErrands.filter((e) => {
      if (seenIds.has(e.id)) return false;
      seenIds.add(e.id);
      return true;
    });
    const totalErrands = uniqueErrands.length;
    const paginatedErrands = uniqueErrands.slice(offset, offset + limit);

    // Build category results (only those that matched)
    const categoryResults = matchingCategories
      .map((c) => {
        const count = uniqueErrands.filter((e) => e.categoryId === c.id).length;
        return { ...c, errandCount: count };
      })
      .filter((c) => c.errandCount > 0 || c.name.toLowerCase().includes(query));

    // Build tag results
    const tagResults = matchingTags.map((t) => {
      const count = uniqueErrands.filter((e) =>
        e.tags.some((et) => et.tagId === t.id),
      ).length;
      return { ...t, errandCount: count };
    });

    return NextResponse.json({
      query: q,
      pagination: {
        offset,
        limit,
        totalResults: totalErrands + categoryResults.length + tagResults.length,
        errandsTotal: totalErrands,
        categoriesTotal: categoryResults.length,
        tagsTotal: tagResults.length,
      },
      results: {
        errands: paginatedErrands,
        categories: categoryResults,
        tags: tagResults,
      },
    });
  } catch (error) {
    console.error('Failed to search:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}