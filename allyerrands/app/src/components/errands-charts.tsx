'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ChartErrand = {
  status: string;
  priority: string;
};

const STATUS_COLORS: Record<string, string> = {
  open: '#10b981',
  in_progress: '#f59e0b',
  completed: '#14b8a6',
  cancelled: '#6b7280',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#64748b',
  medium: '#f97316',
  high: '#ef4444',
};

export function ErrandsCharts({ errands }: { errands: ChartErrand[] }) {
  const total = errands.length;
  const completedCount = errands.filter(e => e.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const statusData = ['open', 'in_progress', 'completed', 'cancelled']
    .map(status => ({
      name: status.replace(/_/g, ' '),
      value: errands.filter(e => e.status === status).length,
      color: STATUS_COLORS[status],
    }))
    .filter(d => d.value > 0);

  const priorityData = ['low', 'medium', 'high'].map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    count: errands.filter(e => e.priority === priority).length,
    color: PRIORITY_COLORS[priority],
  }));

  if (total === 0) return null;

  const donutColor = completionRate >= 60 ? '#10b981' : completionRate >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Completion Rate Donut */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                className="text-muted/30"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={donutColor}
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {completionRate}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {completedCount} of {total} completed
            </p>
            <p className="text-xs text-muted-foreground">
              {total - completedCount} remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={42}
                dataKey="value"
                paddingAngle={2}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 flex-wrap mt-1">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground capitalize">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={priorityData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}