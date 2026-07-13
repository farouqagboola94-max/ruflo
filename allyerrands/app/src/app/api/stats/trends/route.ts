import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/stats/trends — weekly trend data for charts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userWhere = session?.user?.email ? { email: session.user.email as string } : undefined;
    const user = userWhere ? await db.user.findUnique({ where: userWhere, select: { id: true } }) : null;

    const errandWhere: Record<string, unknown> = {};
    if (user) errandWhere.userId = user.id;

    // Get daily counts for the last 14 days — optimized single fetch
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13);
    startDate.setHours(0, 0, 0, 0);

    const [createdErrands, completedErrands] = await Promise.all([
      db.errand.findMany({
        where: {
          ...errandWhere,
          createdAt: { gte: startDate },
          deletedAt: null,
        },
        select: { createdAt: true },
      }),
      db.errand.findMany({
        where: {
          ...errandWhere,
          status: 'completed',
          updatedAt: { gte: startDate },
          deletedAt: null,
        },
        select: { updatedAt: true },
      }),
    ]);

    // Group by day in JS
    const dailyMap: Record<string, { created: number; completed: number }> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { created: 0, completed: 0 };
    }
    createdErrands.forEach(e => {
      const key = e.createdAt.toISOString().split('T')[0];
      if (dailyMap[key]) dailyMap[key].created++;
    });
    completedErrands.forEach(e => {
      const key = e.updatedAt.toISOString().split('T')[0];
      if (dailyMap[key]) dailyMap[key].completed++;
    });
    const daily = Object.entries(dailyMap).map(([date, counts]) => ({ date, ...counts }));

    // Category breakdown
    const categoryBreakdown = await db.errand.groupBy({
      by: ['categoryId'],
      where: {
        ...errandWhere,
        deletedAt: null,
      },
      _count: true,
    });

    const categories = await db.category.findMany({
      where: user ? { userId: user.id } : {},
      select: { id: true, name: true, color: true },
    });

    const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

    const categoryData = categoryBreakdown.map(cb => ({
      name: cb.categoryId && catMap[cb.categoryId] ? catMap[cb.categoryId].name : 'Uncategorized',
      color: cb.categoryId && catMap[cb.categoryId] ? catMap[cb.categoryId].color : '#6b7280',
      count: cb._count,
    }));

    // Priority distribution over time
    const priorityTrend = await db.errand.groupBy({
      by: ['priority'],
      where: { ...errandWhere, deletedAt: null },
      _count: true,
    });

    return NextResponse.json({
      daily,
      categories: categoryData,
      priorities: priorityTrend.map(p => ({ priority: p.priority, count: p._count })),
    });
  } catch (error) {
    console.error('Failed to fetch trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}