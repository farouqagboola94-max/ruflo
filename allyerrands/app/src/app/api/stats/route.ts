import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/stats — comprehensive statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userWhere = session?.user?.email ? { email: session.user.email as string } : undefined;

    const user = userWhere ? await db.user.findUnique({ where: userWhere, select: { id: true } }) : null;
    const errandWhere: Record<string, unknown> = {};
    if (user) errandWhere.userId = user.id;

    const baseWhere = Object.keys(errandWhere).length > 0 ? errandWhere : undefined;

    const [
      total,
      statusCounts,
      priorityCounts,
      overdueCount,
      completedThisWeek,
      avgProgress,
      completedToday,
      thisMonthCreated,
      thisMonthCompleted,
      completedErrands,
    ] = await Promise.all([
      db.errand.count({ where: baseWhere }),
      db.errand.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: true,
      }),
      db.errand.groupBy({
        by: ['priority'],
        where: baseWhere,
        _count: true,
      }),
      db.errand.count({
        where: {
          ...errandWhere,
          status: { not: 'completed' },
          dueDate: { not: null, lt: new Date() },
        },
      }),
      db.errand.count({
        where: {
          ...errandWhere,
          status: 'completed',
          updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      db.errand.aggregate({
        where: baseWhere,
        _avg: { progress: true },
      }),
      // completedToday: errands completed today
      db.errand.count({
        where: {
          ...errandWhere,
          status: 'completed',
          completedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      // thisMonthCreated
      db.errand.count({
        where: {
          ...errandWhere,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      // thisMonthCompleted
      db.errand.count({
        where: {
          ...errandWhere,
          status: 'completed',
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      // Fetch completed errands for avgTimeToComplete and streakDays
      db.errand.findMany({
        where: {
          ...errandWhere,
          status: 'completed',
          completedAt: { not: null },
        },
        select: { createdAt: true, completedAt: true },
      }),
    ]);

    const statusMap: Record<string, number> = {};
    statusCounts.forEach(s => { statusMap[s.status] = s._count; });

    const priorityMap: Record<string, number> = {};
    priorityCounts.forEach(p => { priorityMap[p.priority] = p._count; });

    // --- avgTimeToComplete (in hours, rounded) ---
    let avgTimeToComplete = 0;
    const timedErrands = completedErrands.filter(e => e.completedAt !== null);
    if (timedErrands.length > 0) {
      const totalHours = timedErrands.reduce((sum, e) => {
        const created = e.createdAt.getTime();
        const completed = e.completedAt!.getTime();
        return sum + (completed - created) / (1000 * 60 * 60);
      }, 0);
      avgTimeToComplete = Math.round(totalHours / timedErrands.length);
    }

    // --- streakDays: consecutive days with at least 1 completion (ending today or yesterday) ---
    let streakDays = 0;
    if (timedErrands.length > 0) {
      // Build a set of dates that have completions (YYYY-MM-DD)
      const completionDates = new Set<string>();
      timedErrands.forEach(e => {
        if (e.completedAt) {
          completionDates.add(e.completedAt.toISOString().split('T')[0]);
        }
      });

      // Start from today, go backwards
      const checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);

      // If today has no completions, start from yesterday
      const todayKey = checkDate.toISOString().split('T')[0];
      if (!completionDates.has(todayKey)) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const key = checkDate.toISOString().split('T')[0];
        if (completionDates.has(key)) {
          streakDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // --- categoryBreakdown ---
    const categories = await db.category.findMany({
      where: user ? { userId: user.id } : {},
      select: { id: true, name: true, color: true },
    });

    const categoryBreakdown = categories.map(cat => ({
      name: cat.name,
      color: cat.color,
      count: 0,
      completedCount: 0,
    }));

    // Add Uncategorized if any errands have no category
    const catIdMap = Object.fromEntries(categories.map(c => [c.id, categoryBreakdown.find(cb => cb.name === c.name)]));

    const errandsByCategory = await db.errand.groupBy({
      by: ['categoryId', 'status'],
      where: { ...errandWhere, deletedAt: null },
      _count: true,
    });

    let uncategorizedCount = 0;
    let uncategorizedCompleted = 0;

    errandsByCategory.forEach(ebc => {
      if (ebc.categoryId && catIdMap[ebc.categoryId]) {
        const entry = catIdMap[ebc.categoryId]!;
        entry.count += ebc._count;
        if (ebc.status === 'completed') entry.completedCount += ebc._count;
      } else {
        uncategorizedCount += ebc._count;
        if (ebc.status === 'completed') uncategorizedCompleted += ebc._count;
      }
    });

    if (uncategorizedCount > 0) {
      categoryBreakdown.push({
        name: 'Uncategorized',
        color: '#6b7280',
        count: uncategorizedCount,
        completedCount: uncategorizedCompleted,
      });
    }

    return NextResponse.json({
      total,
      byStatus: statusMap,
      byPriority: priorityMap,
      overdue: overdueCount,
      completedThisWeek,
      avgProgress: Math.round(avgProgress._avg.progress ?? 0),
      completedToday,
      streakDays,
      avgTimeToComplete,
      categoryBreakdown,
      thisMonthCreated,
      thisMonthCompleted,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}