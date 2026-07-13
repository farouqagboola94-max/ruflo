import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/analytics — comprehensive productivity analytics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userWhere = session?.user?.email
      ? { email: session.user.email as string }
      : undefined;
    const user = userWhere
      ? await db.user.findUnique({ where: userWhere, select: { id: true } })
      : null;

    const errandWhere: Record<string, unknown> = {};
    if (user) errandWhere.userId = user.id;
    const baseWhere = Object.keys(errandWhere).length > 0 ? errandWhere : undefined;

    // Fetch all errands (active, non-deleted) for computation
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [allErrands, completedErrands, categories] = await Promise.all([
      db.errand.findMany({
        where: { ...errandWhere, deletedAt: null },
        select: {
          id: true,
          status: true,
          priority: true,
          categoryId: true,
          dueDate: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.errand.findMany({
        where: {
          ...errandWhere,
          status: 'completed',
          deletedAt: null,
          completedAt: { not: null },
        },
        select: { completedAt: true, createdAt: true, priority: true },
      }),
      db.category.findMany({
        where: user ? { userId: user.id } : {},
        select: { id: true, name: true },
      }),
    ]);

    const total = allErrands.length;
    const completed = allErrands.filter((e) => e.status === 'completed').length;
    const inProgress = allErrands.filter((e) => e.status === 'in_progress').length;
    const open = allErrands.filter((e) => e.status === 'open').length;
    const cancelled = allErrands.filter((e) => e.status === 'cancelled').length;

    // 1. Productivity score (0-100): weighted combo of completion rate, focus, and recency
    const activeTotal = total - cancelled;
    const completionRate = activeTotal > 0 ? completed / activeTotal : 0;
    const recencyBonus =
      completedErrands.length > 0
        ? Math.min(
            1,
            completedErrands.filter(
              (e) =>
                e.completedAt &&
                e.completedAt.getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000,
            ).length / 5,
          )
        : 0;
    const productivityScore = Math.round(
      Math.min(100, (completionRate * 70 + recencyBonus * 30) * 100),
    );

    // 2. Weekly velocity: errands completed in the last 7 days
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyVelocity = completedErrands.filter(
      (e) => e.completedAt && e.completedAt >= weekAgo,
    ).length;

    // 3. Best day of week: day with most completions
    const dayCompletions = [0, 0, 0, 0, 0, 0, 0]; // Sun=0 … Sat=6
    completedErrands.forEach((e) => {
      if (e.completedAt) {
        dayCompletions[e.completedAt.getDay()]++;
      }
    });
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const bestDayIndex = dayCompletions.indexOf(Math.max(...dayCompletions));
    const bestDay =
      completedErrands.length > 0 ? dayNames[bestDayIndex] : null;

    // 4. Time-of-day distribution: bucket completions into 6 four-hour slots
    const timeSlots = {
      '00:00–04:00': 0,
      '04:00–08:00': 0,
      '08:00–12:00': 0,
      '12:00–16:00': 0,
      '16:00–20:00': 0,
      '20:00–24:00': 0,
    };
    completedErrands.forEach((e) => {
      if (e.completedAt) {
        const hour = e.completedAt.getHours();
        if (hour < 4) timeSlots['00:00–04:00']++;
        else if (hour < 8) timeSlots['04:00–08:00']++;
        else if (hour < 12) timeSlots['08:00–12:00']++;
        else if (hour < 16) timeSlots['12:00–16:00']++;
        else if (hour < 20) timeSlots['16:00–20:00']++;
        else timeSlots['20:00–24:00']++;
      }
    });

    // 5. Completion rate trends over 30 days
    const dailyCompletionTrends: { date: string; rate: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const createdOnDay = allErrands.filter(
        (e) => e.createdAt >= dayStart && e.createdAt < dayEnd,
      ).length;
      const completedOnDay = allErrands.filter(
        (e) =>
          e.completedAt &&
          e.completedAt >= dayStart &&
          e.completedAt < dayEnd,
      ).length;
      const dayRate =
        createdOnDay > 0 ? Math.round((completedOnDay / createdOnDay) * 100) : 0;

      dailyCompletionTrends.push({
        date: dayStart.toISOString().split('T')[0],
        rate: dayRate,
      });
    }

    // 6. Priority balance score (0-100): how evenly distributed across priorities
    const highCount = allErrands.filter((e) => e.priority === 'high').length;
    const medCount = allErrands.filter((e) => e.priority === 'medium').length;
    const lowCount = allErrands.filter((e) => e.priority === 'low').length;
    let priorityBalance = 0;
    if (total - cancelled > 0) {
      const ideal = (total - cancelled) / 3;
      const deviation =
        (Math.abs(highCount - ideal) +
          Math.abs(medCount - ideal) +
          Math.abs(lowCount - ideal)) /
        (total - cancelled);
      priorityBalance = Math.round(Math.max(0, (1 - deviation) * 100));
    }

    // 7. Category efficiency: completion rate per category
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
    const catStats: Record<string, { total: number; completed: number }> = {};
    allErrands.forEach((e) => {
      const catName = e.categoryId && catMap[e.categoryId] ? catMap[e.categoryId] : 'Uncategorized';
      if (!catStats[catName]) catStats[catName] = { total: 0, completed: 0 };
      catStats[catName].total++;
      if (e.status === 'completed') catStats[catName].completed++;
    });
    const categoryEfficiency = Object.entries(catStats).map(
      ([name, stats]) => ({
        name,
        efficiency:
          stats.total > 0
            ? Math.round((stats.completed / stats.total) * 100)
            : 0,
        total: stats.total,
        completed: stats.completed,
      }),
    );

    // 8. Average errands per day (based on account age, capped at 365 days)
    const oldestCreated = allErrands.reduce<Date | null>(
      (oldest, e) =>
        !oldest || e.createdAt < oldest ? e.createdAt : oldest,
      null,
    );
    let avgErrandsPerDay = 0;
    if (oldestCreated) {
      const daysActive = Math.max(
        1,
        Math.min(365, (now.getTime() - oldestCreated.getTime()) / (1000 * 60 * 60 * 24)),
      );
      avgErrandsPerDay = Math.round((total / daysActive) * 10) / 10;
    }

    // 9. Focus score: ratio of in_progress to open (higher = more focused)
    const focusScore =
      open > 0 ? Math.min(100, Math.round((inProgress / open) * 100)) : 0;

    // 10. Bottleneck detection: categories with most overdue items
    const overdueErrands = allErrands.filter(
      (e) =>
        e.status !== 'completed' &&
        e.status !== 'cancelled' &&
        e.dueDate &&
        e.dueDate < now,
    );
    const overdueCatMap: Record<string, number> = {};
    overdueErrands.forEach((e) => {
      const catName =
        e.categoryId && catMap[e.categoryId]
          ? catMap[e.categoryId]
          : 'Uncategorized';
      overdueCatMap[catName] = (overdueCatMap[catName] || 0) + 1;
    });
    const bottlenecks = Object.entries(overdueCatMap)
      .map(([category, overdueCount]) => ({ category, overdueCount }))
      .sort((a, b) => b.overdueCount - a.overdueCount);

    return NextResponse.json({
      productivityScore,
      weeklyVelocity,
      bestDay,
      timeOfDayDistribution: timeSlots,
      completionRateTrends: dailyCompletionTrends,
      priorityBalance,
      categoryEfficiency,
      avgErrandsPerDay,
      focusScore,
      bottlenecks,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    );
  }
}