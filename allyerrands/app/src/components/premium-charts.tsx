'use client'

import React, { useMemo, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { TrendingUp, BarChart3, PieChartIcon, Clock, LayoutGrid, Activity } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Errand {
  status: string
  priority: string
  completedAt?: string | null
  createdAt?: string | null
}

interface TrendsData {
  daily: { date: string; created: number; completed: number }[]
  categories: { name: string; color: string; count: number }[]
}

interface PremiumChartsProps {
  errands: Errand[]
  trendsData?: TrendsData
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  open: '#10b981',
  in_progress: '#f59e0b',
  completed: '#06b6d4',
  cancelled: '#6b7280',
}

const PRIORITY_COLORS: Record<string, string> = {
  low: '#6366f1',
  medium: '#f59e0b',
  high: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCompletionColor(pct: number): string {
  if (pct < 30) return '#ef4444'
  if (pct < 60) return '#f59e0b'
  return '#10b981'
}

function countBy<T extends string>(arr: T[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const item of arr) {
    map[item] = (map[item] || 0) + 1
  }
  return map
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ---------------------------------------------------------------------------
// Animated Number — uses motion value + useMotionValueEvent pattern
// ---------------------------------------------------------------------------

function AnimatedNumber({ value, color, size = 'text-4xl' }: { value: MotionValue<number>; color: string; size?: string }) {
  const [display, setDisplay] = useState(0)
  useMotionValueEvent(value, 'change', (v) => setDisplay(Math.round(v)))
  return (
    <span className={`${size} font-bold tabular-nums`} style={{ color }}>
      {display}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Completion Ring – pure SVG donut (no recharts)
// ---------------------------------------------------------------------------

function CompletionRing({ percentage }: { percentage: number }) {
  const size = 180
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const color = getCompletionColor(percentage)

  // Spring-driven offset: 0 → full arc
  const spring = useSpring(percentage, { stiffness: 60, damping: 20 })
  const dashOffset = useTransform(spring, (v) => {
    return circumference - (v / 100) * circumference
  })

  // Animated counting number
  const displayPct = useTransform(spring, (v) => Math.round(v))

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="drop-shadow-lg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Animated foreground arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          filter="url(#glow)"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* Center percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedNumber value={displayPct} color={color} />
        <span className="text-lg font-medium tabular-nums" style={{ color }}>
          %
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">completed</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Custom Glass Tooltip — shows both created & completed when available
// ---------------------------------------------------------------------------

interface TooltipPayloadEntry {
  name?: string
  value?: number
  color?: string
  payload?: Record<string, unknown>
}

function GlassTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  const hasCreated = payload.some((p) => p.name === 'created')
  const hasCompleted = payload.some((p) => p.name === 'completed')

  return (
    <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-2 text-sm shadow-lg backdrop-blur-md">
      {label && <p className="font-medium text-foreground mb-1">{label}</p>}
      {hasCreated || hasCompleted ? (
        <div className="space-y-0.5">
          {payload.map((item, i) => (
            item.value !== undefined && (
              <p key={i} className="text-muted-foreground">
                <span
                  className="inline-block h-2 w-2 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: item.color ?? '#06b6d4' }}
                />
                {item.name === 'created' ? 'Created' : item.name === 'completed' ? 'Completed' : item.name}:{' '}
                <span className="font-semibold text-foreground">{item.value}</span>
              </p>
            )
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {payload[0].name}: <span className="font-semibold text-foreground">{payload[0].value}</span>
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SVG Glow Filter — reusable definition for Recharts charts
// ---------------------------------------------------------------------------

function GlowFilterDef({ id = 'chart-glow' }: { id?: string }) {
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
          result="glow"
        />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

// ---------------------------------------------------------------------------
// Status Breakdown – Recharts PieChart (enhanced with glow + animation)
// ---------------------------------------------------------------------------

function StatusBreakdown({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <GlowFilterDef id="status-glow" />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.color}
                style={{ filter: 'url(#status-glow)', cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<GlassTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name} ({d.value})
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Priority Donut – Recharts PieChart (donut with center total label)
// ---------------------------------------------------------------------------

function PriorityDonut({
  data,
  totalCount,
}: {
  data: { name: string; value: number; color: string }[]
  totalCount: number
}) {
  const spring = useSpring(totalCount, { stiffness: 60, damping: 20 })
  const displayTotal = useTransform(spring, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)
  useMotionValueEvent(displayTotal, 'change', (v) => setDisplay(Math.round(v)))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
      className="relative"
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <GlowFilterDef id="donut-glow" />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.color}
                style={{ filter: 'url(#donut-glow)', cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<GlassTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 top-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-foreground">{display}</span>
          <span className="text-[10px] text-muted-foreground tracking-wide uppercase">total</span>
        </div>
      </div>
      {/* Custom Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name} ({d.value})
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Completion Rate Trend – Sparkline AreaChart (last 14 days)
// ---------------------------------------------------------------------------

function CompletionRateTrend({ trendsData }: { trendsData?: TrendsData }) {
  const chartData = useMemo(() => {
    if (!trendsData?.daily || trendsData.daily.length === 0) return []

    // Take last 14 days
    const last14 = trendsData.daily.slice(-14)

    return last14.map((d) => {
      const total = d.created + d.completed
      const rate = total > 0 ? Math.round((d.completed / total) * 100) : 0
      const date = new Date(d.date + 'T00:00:00')
      return {
        day: `${date.getMonth() + 1}/${date.getDate()}`,
        rate,
      }
    })
  }, [trendsData])

  const latestRate = chartData.length > 0 ? (chartData[chartData.length - 1]?.rate ?? 0) : 0

  // Animated latest rate
  const spring = useSpring(latestRate, { stiffness: 60, damping: 20 })
  const displayRate = useTransform(spring, (v) => Math.round(v))
  const [rateDisplay, setRateDisplay] = useState(0)
  useMotionValueEvent(displayRate, 'change', (v) => setRateDisplay(Math.round(v)))

  if (chartData.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Header stats */}
      <div className="flex items-baseline gap-2 mb-2">
        <AnimatedNumber value={displayRate} color={getCompletionColor(latestRate)} size="text-2xl" />
        <span className="text-lg font-medium tabular-nums" style={{ color: getCompletionColor(latestRate) }}>%</span>
        <span className="text-xs text-muted-foreground ml-auto">last 14 days</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <GlowFilterDef id="sparkline-glow" />
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={(v: number) => `${v}%`}
            width={36}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-2 text-sm shadow-lg backdrop-blur-md">
                  <p className="font-medium text-foreground mb-0.5">{label}</p>
                  <p className="text-muted-foreground">
                    Completion rate:{' '}
                    <span className="font-semibold text-foreground">{payload[0].value}%</span>
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#sparklineGradient)"
            animationBegin={200}
            animationDuration={800}
            style={{ filter: 'url(#sparkline-glow)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Productivity Trend – Recharts AreaChart (enhanced with glow + animation)
// ---------------------------------------------------------------------------

function ProductivityTrend({
  errands,
  trendsData,
}: {
  errands: Errand[]
  trendsData?: TrendsData
}) {
  const chartData = useMemo(() => {
    if (trendsData?.daily && trendsData.daily.length > 0) {
      return trendsData.daily.map((d) => {
        const date = new Date(d.date + 'T00:00:00')
        const dayLabel = DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1]
        return {
          day: `${date.getMonth() + 1}/${date.getDate()}`,
          dayShort: dayLabel,
          created: d.created,
          completed: d.completed,
        }
      })
    }

    const completedCount = errands.filter((e) => e.status === 'completed').length
    const base = completedCount / 7

    return DAY_LABELS.map((day, i) => {
      const wave = Math.sin((i / 6) * Math.PI) * 0.6 + 0.7
      const value = Math.max(0, Math.round(base * wave * (1 + (i % 3) * 0.15)))
      return { day, completed: value }
    })
  }, [errands, trendsData])

  const hasCreatedData = chartData.some((d) => (d as Record<string, unknown>).created !== undefined)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="areaGradientCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="areaGradientCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <GlowFilterDef id="productivity-glow" />
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip content={<GlassTooltip />} />
          {hasCreatedData && (
            <Area
              type="monotone"
              dataKey="created"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#areaGradientCreated)"
              animationBegin={200}
              animationDuration={800}
              style={{ filter: 'url(#productivity-glow)' }}
            />
          )}
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fill="url(#areaGradientCompleted)"
            animationBegin={200}
            animationDuration={800}
            style={{ filter: 'url(#productivity-glow)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Custom Legend when dual lines are shown */}
      {hasCreatedData && (
        <div className="mt-2 flex justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
            Created
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#06b6d4' }} />
            Completed
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Category Breakdown – Horizontal BarChart (enhanced with glow + animation)
// ---------------------------------------------------------------------------

function CategoryChart({ data }: { data: { name: string; color: string; count: number }[] }) {
  const sortedData = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data])

  if (sortedData.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={Math.max(220, sortedData.length * 40 + 40)}>
        <BarChart data={sortedData} layout="vertical" barSize={20} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <defs>
            {sortedData.map((d, i) => (
              <linearGradient key={i} id={`catGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={d.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
              </linearGradient>
            ))}
            <GlowFilterDef id="category-glow" />
          </defs>
          <XAxis
            type="number"
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={80}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip content={<GlassTooltip />} />
          <Bar
            dataKey="count"
            radius={[0, 6, 6, 0]}
            animationBegin={200}
            animationDuration={800}
          >
            {sortedData.map((_, i) => (
              <Cell key={i} fill={`url(#catGrad-${i})`} style={{ filter: 'url(#category-glow)' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Average Completion Time – computed from errands with completedAt
// ---------------------------------------------------------------------------

function AvgCompletionTime({ errands }: { errands: Errand[] }) {
  const avgMinutes = useMemo(() => {
    const completed = errands.filter(
      (e) => e.status === 'completed' && e.completedAt && e.createdAt
    )
    if (completed.length === 0) return null

    let totalMinutes = 0
    for (const e of completed) {
      const created = new Date(e.createdAt!).getTime()
      const finished = new Date(e.completedAt!).getTime()
      totalMinutes += (finished - created) / (1000 * 60)
    }

    return totalMinutes / completed.length
  }, [errands])

  if (avgMinutes === null) return null

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        Avg. completion time:{' '}
        <span className="font-semibold text-foreground">{formatDuration(avgMinutes)}</span>
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const cardClass = 'glass glass-depth-1 shimmer-border rounded-xl overflow-hidden'

const PremiumCharts = React.memo(function PremiumCharts({ errands, trendsData }: PremiumChartsProps) {
  if (errands.length === 0) return null

  // Derived data -----------------------------------------------------------
  const total = errands.length

  const completedCount = errands.filter((e) => e.status === 'completed').length
  const completionPct = Math.round((completedCount / total) * 100)

  const statusCounts = countBy(errands.map((e) => e.status))
  const statusData = Object.entries(statusCounts).map(([key, value]) => ({
    name: STATUS_LABELS[key] ?? key,
    value,
    color: STATUS_COLORS[key] ?? '#888888',
  }))

  const priorityCounts = countBy(errands.map((e) => e.priority))
  const priorityDonutData = ['high', 'medium', 'low']
    .filter((p) => (priorityCounts[p] ?? 0) > 0)
    .map((key) => ({
      name: PRIORITY_LABELS[key] ?? key,
      value: priorityCounts[key] ?? 0,
      color: PRIORITY_COLORS[key] ?? '#888888',
    }))

  const priorityTotal = priorityDonutData.reduce((sum, d) => sum + d.value, 0)

  const headerIconClass = 'h-4 w-4 text-muted-foreground mr-2'

  return (
    <div className="space-y-4">
      {/* ── 2×2 Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1 ─ Completion Ring */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0, ease: 'easeOut' }}
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <TrendingUp className={headerIconClass} />
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pb-6 pt-0">
              <CompletionRing percentage={completionPct} />
              <AvgCompletionTime errands={errands} />
            </CardContent>
          </Card>
        </motion.div>

        {/* 2 ─ Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <PieChartIcon className={headerIconClass} />
              <CardTitle className="text-sm font-medium">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <StatusBreakdown data={statusData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* 3 ─ Priority Distribution (Donut) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BarChart3 className={headerIconClass} />
              <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              {priorityTotal > 0 ? (
                <PriorityDonut data={priorityDonutData} totalCount={priorityTotal} />
              ) : (
                <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
                  No priority data
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 4 ─ Completion Rate Trend (Sparkline) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Activity className={headerIconClass} />
              <CardTitle className="text-sm font-medium">Completion Rate Trend</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              {trendsData?.daily && trendsData.daily.length > 0 ? (
                <CompletionRateTrend trendsData={trendsData} />
              ) : (
                <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">
                  No trend data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Productivity Trend (full width) ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
      >
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <TrendingUp className={headerIconClass} />
            <CardTitle className="text-sm font-medium">Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent className="pb-6 pt-0">
            <ProductivityTrend errands={errands} trendsData={trendsData} />
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Category Breakdown (full width, only when trend data has categories) ── */}
      {trendsData?.categories && trendsData.categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
        >
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <LayoutGrid className={headerIconClass} />
              <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 pt-0">
              <CategoryChart data={trendsData.categories} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
})

export { PremiumCharts }
export default PremiumCharts