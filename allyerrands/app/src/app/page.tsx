'use client';

import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ClipboardList, CircleDot, Clock, CheckCircle2, XCircle,
  Pencil, Trash2, Loader2, ArrowRight, Search,
  GripVertical, FileText, FileSpreadsheet, LogIn, LogOut,
  CalendarDays, AlertTriangle, CheckSquare, Box,
  ChevronDown, FileDown, Sparkles, Zap, Shield,
  Tag as TagIcon, History, Undo2, ListChecks, PlusCircle, X,
  FolderOpen, Copy, Settings, Timer, MessageSquare, Filter,
  Trash, RotateCcw, Command, Star, MoreHorizontal, Hash,
  Send, Flame, TrendingUp, ArrowUpRight, ArrowDownRight,
  LayoutGrid, LayoutList, Calendar as CalendarIcon, Target, Brain, BarChart3,
  Bell, Activity, Rocket, Trophy, Sun, Moon, Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { Calendar } from '@/components/ui/calendar';
import { TiltCard } from '@/components/tilt-card';
import { useParticleBurst, ParticleOverlay } from '@/components/particle-burst';
import { CursorGlow } from '@/components/cursor-glow';

const Scene3D = lazy(() => import('@/components/scene3d'));
const PremiumCharts = lazy(() => import('@/components/premium-charts'));
const Stats3D = lazy(() => import('@/components/stats3d'));
const PremiumLoader = lazy(() => import('@/components/premium-loader'));

/* ─── Types ─────────────────────────────────────────────────────── */
type Tag = { id: string; name: string; color: string; _count?: { errands: number } };
type Subtask = { id: string; title: string; completed: boolean; sortOrder: number };
type ErrandTag = { tagId: string; errandId: string; tag: Tag };
type Activity = { id: string; action: string; details: string | null; errandId: string | null; errand?: { id: string; title: string; status: string } | null; createdAt: string };
type Category = { id: string; name: string; color: string; icon: string; sortOrder: number; _count?: { errands: number } };
type Note = { id: string; content: string; errandId: string; userId: string | null; createdAt: string; updatedAt: string };
type Errand = {
  id: string; title: string; description: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high'; dueDate: string | null;
  sortOrder: number; progress: number; createdAt: string; updatedAt: string;
  estimatedMinutes: number | null; categoryId: string | null;
  tags?: ErrandTag[]; subtasks?: Subtask[]; notes?: Note[];
  category?: { id: string; name: string; color: string; icon: string } | null;
  _count?: { subtasks: number; notes: number };
};
type StatusFilter = 'all' | 'open' | 'in_progress' | 'completed' | 'cancelled';
type SortOption = 'newest' | 'oldest' | 'priority-high' | 'priority-low' | 'due-date' | 'alpha';
type UserSettings = { defaultView: string; defaultSort: string; showCharts: boolean; compactMode: boolean };
type TrendsData = { daily: { date: string; created: number; completed: number }[]; categories: { name: string; color: string; count: number }[] };
type ViewMode = 'list' | 'kanban';
type AnalyticsData = { productivityScore: number; weeklyVelocity: number; bestDay: string; timeOfDayDistribution: Record<string, number>; completionRateTrends: { date: string; rate: number }[]; priorityBalance: number; categoryEfficiency: { name: string; total: number; completed: number; rate: number }[]; avgErrandsPerDay: number; focusScore: number; bottlenecks: { name: string; count: number }[] };

/* ─── Config ────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; glow: string }> = {
  open: { label: 'Open', icon: CircleDot, color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400 dark:border-emerald-500/40', glow: 'shadow-emerald-500/20' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400 dark:border-amber-500/40', glow: 'shadow-amber-500/20' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400 dark:border-cyan-500/40', glow: 'shadow-cyan-500/20' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-gray-500/15 text-gray-500 border-gray-500/30 dark:text-gray-400 dark:border-gray-500/40', glow: '' },
};
const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-400 dark:border-slate-500/40' },
  medium: { label: 'Medium', color: 'bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400 dark:border-orange-500/40' },
  high: { label: 'High', color: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400 dark:border-red-500/40' },
};
const PRIORITY_VALUE: Record<string, number> = { low: 0, medium: 1, high: 2 };
const NEXT_STATUS: Record<string, string | null> = { open: 'in_progress', in_progress: 'completed', completed: null, cancelled: null };
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' },
  { value: 'priority-high', label: 'Priority (High to Low)' }, { value: 'priority-low', label: 'Priority (Low to High)' },
  { value: 'due-date', label: 'Due Date' }, { value: 'alpha', label: 'Alphabetical' },
];
const PRESET_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444', '#f97316', '#14b8a6', '#a855f7'];

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmtDate(d: string) { return format(new Date(d), 'MMM d, h:mm a'); }
function fmtDue(d: string) { return isToday(new Date(d)) ? 'Today' : format(new Date(d), 'MMM d'); }
function isOverdue(e: Errand) { return !!(e.dueDate && e.status !== 'completed' && e.status !== 'cancelled' && isPast(new Date(e.dueDate))); }
function fmtTimeAgo(d: string) { return formatDistanceToNow(new Date(d), { addSuffix: true }); }
function fmtMinutes(m: number | null) {
  if (!m) return null;
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r > 0 ? `${h}h ${r}m` : `${h}h`;
}
function escapeHtml(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function statusBg(s: string) { return { open: '#d1fae5', in_progress: '#fef3c7', completed: '#cffafe', cancelled: '#f3f4f6' }[s] || '#f3f4f6'; }
function statusFg(s: string) { return { open: '#065f46', in_progress: '#92400e', completed: '#155e75', cancelled: '#6b7280' }[s] || '#6b7280'; }
function priorityBg(p: string) { return { low: '#f1f5f9', medium: '#ffedd5', high: '#fee2e2' }[p] || '#f1f5f9'; }
function priorityFg(p: string) { return { low: '#475569', medium: '#9a3412', high: '#991b1b' }[p] || '#475569'; }

function exportToCSV(errands: Errand[]) {
  const h = ['Title', 'Description', 'Status', 'Priority', 'Category', 'Due Date', 'Estimated', 'Created At'];
  const rows = errands.map(e => [e.title, e.description || '', e.status.replace(/_/g, ' '), e.priority, e.category?.name || '', e.dueDate ? new Date(e.dueDate).toLocaleDateString() : '', fmtMinutes(e.estimatedMinutes) || '', new Date(e.createdAt).toLocaleDateString()]);
  const csv = [h, ...rows].map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = `errands-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

function exportToPDF(errands: Errand[]) {
  const sl = (s: string) => STATUS_CONFIG[s]?.label || s;
  const pl = (p: string) => PRIORITY_CONFIG[p]?.label || p;
  const oc = errands.filter(e => e.status === 'open').length;
  const pc = errands.filter(e => e.status === 'in_progress').length;
  const cc = errands.filter(e => e.status === 'completed').length;
  const xc = errands.filter(e => e.status === 'cancelled').length;
  const od = errands.filter(e => isOverdue(e)).length;
  const tableRows = errands.map(e => `<tr style="border-bottom:1px solid #e5e7eb;page-break-inside:avoid;"><td style="padding:10px 12px;font-size:13px;max-width:220px;word-wrap:break-word;">${escapeHtml(e.title)}</td><td style="padding:10px 12px;font-size:12px;color:#6b7280;max-width:160px;word-wrap:break-word;">${escapeHtml(e.description || '-')}</td><td style="padding:10px 12px;font-size:12px;"><span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500;background:${statusBg(e.status)};color:${statusFg(e.status)};">${sl(e.status)}</span></td><td style="padding:10px 12px;font-size:12px;"><span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500;background:${priorityBg(e.priority)};color:${priorityFg(e.priority)};">${pl(e.priority)}</span></td><td style="padding:10px 12px;font-size:12px;color:#6b7280;">${e.category?.name || '-'}</td><td style="padding:10px 12px;font-size:12px;${isOverdue(e) ? 'color:#dc2626;font-weight:600;' : 'color:#6b7280;'}">${e.dueDate ? format(new Date(e.dueDate), 'MMM d, yyyy') + (isOverdue(e) ? ' (Overdue)' : '') : '-'}</td><td style="padding:10px 12px;font-size:12px;color:#6b7280;">${fmtMinutes(e.estimatedMinutes) || '-'}</td><td style="padding:10px 12px;font-size:12px;color:#6b7280;">${format(new Date(e.createdAt), 'MMM d, yyyy')}</td></tr>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Errands Report</title><style>@page{margin:20mm;size:landscape}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;margin:0;padding:0}.header{text-align:center;margin-bottom:24px}.header h1{font-size:22px;font-weight:700;margin:0 0 4px}.header p{font-size:13px;color:#6b7280;margin:0}.stats{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}.stat{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;text-align:center;min-width:100px}.stat .num{font-size:24px;font-weight:700}.stat .lbl{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em}table{width:100%;border-collapse:collapse;font-size:13px}thead th{padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e5e7eb;background:#f9fafb}.footer{margin-top:24px;text-align:center;font-size:11px;color:#9ca3af}</style></head><body><div class="header"><h1>Errands Tracker Report</h1><p>Generated on ${format(new Date(), 'MMMM d, yyyy \'at\' h:mm a')} &middot; ${errands.length} errand${errands.length !== 1 ? 's' : ''}</p></div><div class="stats"><div class="stat"><div class="num">${errands.length}</div><div class="lbl">Total</div></div><div class="stat"><div class="num" style="color:#059669;">${oc}</div><div class="lbl">Open</div></div><div class="stat"><div class="num" style="color:#d97706;">${pc}</div><div class="lbl">In Progress</div></div><div class="stat"><div class="num" style="color:#0891b2;">${cc}</div><div class="lbl">Completed</div></div><div class="stat"><div class="num" style="color:#6b7280;">${xc}</div><div class="lbl">Cancelled</div></div>${od > 0 ? `<div class="stat" style="border-color:#fecaca;"><div class="num" style="color:#dc2626;">${od}</div><div class="lbl" style="color:#dc2626;">Overdue</div></div>` : ''}</div>${errands.length > 0 ? `<table><thead><tr><th>Title</th><th>Description</th><th>Status</th><th>Priority</th><th>Category</th><th>Due Date</th><th>Est.</th><th>Created</th></tr></thead><tbody>${tableRows}</tbody></table>` : '<p style="text-align:center;color:#6b7280;padding:40px 0;">No errands to display.</p>'}<div class="footer">Errands Tracker &middot; Premium 3D Edition</div></body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.onload = () => { w.print(); }; }
}

/* ─── Sortable Card Wrapper ─────────────────────────────────────── */
function SortableCard({ errand, children }: { errand: Errand; children: React.ReactNode }) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id: errand.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined }}>
      <motion.div animate={{ opacity: isDragging ? 0.4 : 1, scale: isDragging ? 1.03 : 1 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Date Picker Field ─────────────────────────────────────────── */
function DatePickerField({ date, onChange, label }: { date: Date | undefined; onChange: (d: Date | undefined) => void; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal gap-2 h-11 rounded-xl border-border/50 bg-background/50">
            <CalendarDays className="size-4 text-muted-foreground" />
            {date ? format(date, 'PPP') : <span className="text-muted-foreground">Pick a date (optional)</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={(d) => { onChange(d); setOpen(false); }} />
          {date && <div className="border-t px-3 py-2"><Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => { onChange(undefined); setOpen(false); }}>Clear date</Button></div>}
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ─── Shimmer Loader ────────────────────────────────────────────── */
function ShimmerLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3"><div className="shimmer h-4 w-4 rounded-full" /><div className="shimmer h-5 w-2/3 rounded-lg" /></div>
          <div className="shimmer h-3 w-1/2 rounded-lg ml-7" />
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, delay, subtitle, trend }: { label: string; value: number; icon: React.ElementType; color: string; delay: number; subtitle?: string; trend?: 'up' | 'down' | null }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}>
      <TiltCard tiltDegree={5} glareOpacity={0.1} scaleOnHover={1.06}>
        <div className="glass aurora-border rounded-2xl p-4 sm:p-5 cursor-default group relative overflow-hidden magnetic-lift card-gradient-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
              {trend && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: delay + 0.2 }} className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}>
                  {trend === 'up' ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
                </motion.div>
              )}
              <div className={`p-2 rounded-xl bg-background/60 ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className="size-4" />
              </div>
            </div>
          </div>
          <motion.p className="text-3xl sm:text-4xl font-bold tracking-tight" key={value} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            {value}
          </motion.p>
          {subtitle && <p className="text-[10px] text-muted-foreground mt-1 font-medium">{subtitle}</p>}
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Color Picker ──────────────────────────────────────────────── */
function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESET_COLORS.map(c => (
        <button key={c} type="button" onClick={() => onChange(c)} className={`w-6 h-6 rounded-full transition-all ${value === c ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c, ringColor: c }} />
      ))}
    </div>
  );
}

/* ─── Productivity Score Ring ─────────────────────────────────── */
function ProductivityRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-border/40" />
        <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }} style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-lg font-bold" style={{ color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{score}</motion.span>
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider -mt-0.5">Score</span>
      </div>
    </div>
  );
}

/* ─── Analytics Panel ─────────────────────────────────────────── */
function AnalyticsPanel({ analytics, enhancedStats, onClose }: { analytics: AnalyticsData | null; enhancedStats: { completedToday: number; streakDays: number; avgTimeToComplete: number; thisMonthCompleted: number } | null; onClose: () => void }) {
  if (!analytics) return null;
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass-strong rounded-2xl border-border/30 p-5 space-y-5 w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><Brain className="size-4 text-violet-500" /> Analytics Dashboard</h3>
        <Button variant="ghost" size="icon" className="size-7 rounded-lg" onClick={onClose}><X className="size-3.5" /></Button>
      </div>
      {/* Productivity Score + Key Metrics */}
      <div className="flex items-center gap-5 flex-wrap">
        <ProductivityRing score={analytics.productivityScore} size={90} />
        <div className="grid grid-cols-2 gap-3 flex-1 min-w-[200px]">
          <div className="glass rounded-xl p-3 text-center"><p className="text-xl font-bold text-amber-500">{analytics.weeklyVelocity}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Weekly Velocity</p></div>
          <div className="glass rounded-xl p-3 text-center"><p className="text-xl font-bold text-cyan-500">{analytics.focusScore}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus Score</p></div>
          <div className="glass rounded-xl p-3 text-center"><p className="text-xl font-bold text-emerald-500">{enhancedStats?.streakDays ?? 0}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</p></div>
          <div className="glass rounded-xl p-3 text-center"><p className="text-xl font-bold text-violet-500">{analytics.priorityBalance}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Priority Balance</p></div>
        </div>
      </div>
      {/* Category Efficiency */}
      {analytics.categoryEfficiency.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category Efficiency</h4>
          <div className="space-y-2">
            {analytics.categoryEfficiency.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24 truncate">{cat.name}</span>
                <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, #8b5cf6, #06b6d4)` }} initial={{ width: 0 }} animate={{ width: `${cat.rate}%` }} transition={{ duration: 1, delay: i * 0.1 }} /></div>
                <span className="text-xs font-mono font-medium w-10 text-right">{cat.rate}%</span>
                <span className="text-[10px] text-muted-foreground w-16 text-right">{cat.completed}/{cat.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Bottlenecks */}
      {analytics.bottlenecks.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5"><AlertTriangle className="size-3 text-red-400" /> Bottlenecks</h4>
          <div className="flex flex-wrap gap-2">
            {analytics.bottlenecks.slice(0, 4).map((b, i) => (
              <div key={i} className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs"><span>{b.name}</span><span className="text-red-500 font-bold">{b.count} overdue</span></div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass rounded-lg p-2.5 text-center"><p className="text-sm font-bold">{analytics.avgErrandsPerDay.toFixed(1)}</p><p className="text-[9px] text-muted-foreground uppercase">Avg/Day</p></div>
        <div className="glass rounded-lg p-2.5 text-center"><p className="text-sm font-bold">{analytics.bestDay || 'N/A'}</p><p className="text-[9px] text-muted-foreground uppercase">Best Day</p></div>
        <div className="glass rounded-lg p-2.5 text-center"><p className="text-sm font-bold">{enhancedStats?.avgTimeToComplete ?? 0}h</p><p className="text-[9px] text-muted-foreground uppercase">Avg Time</p></div>
      </div>
    </motion.div>
  );
}

/* ─── Kanban Board ────────────────────────────────────────────── */
function KanbanBoard({ errands, onStatusChange, onEdit, onDelete, onDuplicate, onExpand, expandedId, subtasksMap, notesMap, setSubtasksMap, setNotesMap, newSubtask, setNewSubtask, newNote, setNewNote, handleAddSubtask, handleToggleSubtask, handleDeleteSubtask, handleAddNote, handleDeleteNote, statusChanging, categories, tags, spawnParticles }: {
  errands: Errand[]; onStatusChange: (e: Errand) => void; onEdit: (e: Errand) => void; onDelete: (e: Errand) => void; onDuplicate: (e: Errand) => void;
  onExpand: (id: string | null) => void; expandedId: string | null; subtasksMap: Record<string, Subtask[]>; notesMap: Record<string, Note[]>;
  setSubtasksMap: React.Dispatch<React.SetStateAction<Record<string, Subtask[]>>>; setNotesMap: React.Dispatch<React.SetStateAction<Record<string, Note[]>>>;
  newSubtask: string; setNewSubtask: (v: string) => void; newNote: string; setNewNote: (v: string) => void;
  handleAddSubtask: (errandId: string) => void; handleToggleSubtask: (errandId: string, subtaskId: string, completed: boolean) => void;
  handleDeleteSubtask: (errandId: string, subtaskId: string) => void; handleAddNote: (errandId: string) => void; handleDeleteNote: (errandId: string, noteId: string) => void;
  statusChanging: string | null; categories: Category[]; tags: Tag[]; spawnParticles: (x: number, y: number, count?: number) => void;
}) {
  const columns: { status: string; label: string; icon: React.ElementType; color: string; accent: string }[] = [
    { status: 'open', label: 'Open', icon: CircleDot, color: 'from-emerald-500/10 to-emerald-500/5', accent: 'border-emerald-500/30' },
    { status: 'in_progress', label: 'In Progress', icon: Clock, color: 'from-amber-500/10 to-amber-500/5', accent: 'border-amber-500/30' },
    { status: 'completed', label: 'Completed', icon: CheckCircle2, color: 'from-cyan-500/10 to-cyan-500/5', accent: 'border-cyan-500/30' },
    { status: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'from-gray-500/10 to-gray-500/5', accent: 'border-gray-500/30' },
  ];
  const grouped = useMemo(() => {
    const g: Record<string, Errand[]> = { open: [], in_progress: [], completed: [], cancelled: [] };
    errands.forEach(e => { if (g[e.status]) g[e.status].push(e); });
    return g;
  }, [errands]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(col => {
        const items = grouped[col.status] || [];
        const ColIcon = col.icon;
        return (
          <div key={col.status} className={`glass rounded-2xl border-t-2 ${col.accent} overflow-hidden`}>
            <div className={`bg-gradient-to-br ${col.color} px-4 py-3 flex items-center justify-between border-b border-border/20`}>
              <div className="flex items-center gap-2"><ColIcon className="size-4 text-muted-foreground" /><span className="text-sm font-semibold">{col.label}</span></div>
              <span className="text-xs font-bold bg-background/60 rounded-full px-2 py-0.5 text-muted-foreground">{items.length}</span>
            </div>
            <div className="p-3 space-y-2.5 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {items.map((errand, i) => (
                  <motion.div key={errand.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 25 }}
                    className="glass rounded-xl p-3 group cursor-pointer magnetic-lift" onClick={() => onExpand(expandedId === errand.id ? null : errand.id)}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">{errand.title}</p>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={e => { e.stopPropagation(); onStatusChange(errand); }} disabled={statusChanging === errand.id} className="p-1 rounded-md hover:bg-background/50 transition-colors"><ArrowRight className="size-3 text-muted-foreground" /></button>
                        <button onClick={e => { e.stopPropagation(); onEdit(errand); }} className="p-1 rounded-md hover:bg-background/50 transition-colors"><Pencil className="size-3 text-muted-foreground" /></button>
                      </div>
                    </div>
                    {errand.category && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: errand.category.color }} />
                        <span className="text-[10px] text-muted-foreground">{errand.category.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${PRIORITY_CONFIG[errand.priority]?.color || ''}`}>{PRIORITY_CONFIG[errand.priority]?.label}</span>
                      {errand.tags?.slice(0, 2).map(et => (
                        <span key={et.tagId} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: et.tag.color + '20', color: et.tag.color }}>{et.tag.name}</span>
                      ))}
                      {errand.dueDate && <span className={`text-[10px] ml-auto ${isOverdue(errand) ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>{fmtDue(errand.dueDate)}</span>}
                    </div>
                    {errand.progress > 0 && errand.progress < 100 && (
                      <div className="mt-2 h-1 rounded-full bg-border/30 overflow-hidden"><div className="h-full rounded-full progress-shimmer" style={{ width: `${errand.progress}%` }} /></div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-xs">No items</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function ErrandsApp() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { canvasRef, spawn: spawnParticles } = useParticleBurst();
  const [errands, setErrands] = useState<Errand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showCharts, setShowCharts] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [trashedErrands, setTrashedErrands] = useState<Errand[]>([]);

  // Dialogs
  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addPriority, setAddPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [addDueDate, setAddDueDate] = useState<Date | undefined>();
  const [addEstMinutes, setAddEstMinutes] = useState('');
  const [addCategoryId, setAddCategoryId] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editErrand, setEditErrand] = useState<Errand | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>();
  const [editEstMinutes, setEditEstMinutes] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Errand | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [statusChanging, setStatusChanging] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [lastFocusedId, setLastFocusedId] = useState<string | null>(null);

  // New features state
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [subtasksMap, setSubtasksMap] = useState<Record<string, Subtask[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, Note[]>>({});
  const [newSubtask, setNewSubtask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [addTagIds, setAddTagIds] = useState<string[]>([]);
  const [editTagIds, setEditTagIds] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<Errand | null>(null);

  // Inline editing
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');

  // Command Palette
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({ defaultView: 'all', defaultSort: 'newest', showCharts: true, compactMode: false });

  // Category dialog
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#8b5cf6');

  // Tag dialog
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#8b5cf6');

  // Quick-add
  const [quickAdd, setQuickAdd] = useState('');
  const [quickAdding, setQuickAdding] = useState(false);

  // Trends data for charts
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);

  // Enhanced stats
  const [enhancedStats, setEnhancedStats] = useState<{ completedToday: number; streakDays: number; avgTimeToComplete: number; thisMonthCompleted: number } | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Notification panel
  const [showNotifications, setShowNotifications] = useState(false);

  // Search mode
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<{ errands: Errand[]; categories: Category[]; tags: Tag[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const cmdInputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  /* ─── Data Fetch ──────────────────────────────────────────────── */
  const fetchErrands = useCallback(async () => {
    try { const res = await fetch('/api/errands'); if (!res.ok) throw new Error(); setErrands(await res.json()); }
    catch { toast({ title: 'Error', description: 'Failed to load errands', variant: 'destructive' }); }
    finally { setLoading(false); }
  }, [toast]);
  useEffect(() => { fetchErrands(); }, [fetchErrands]);

  const fetchTags = useCallback(async () => {
    try { const res = await fetch('/api/tags'); if (res.ok) setTags(await res.json()); } catch { /* ok */ }
  }, []);
  const fetchCategories = useCallback(async () => {
    try { const res = await fetch('/api/categories'); if (res.ok) setCategories(await res.json()); } catch { /* ok */ }
  }, []);
  const fetchActivity = useCallback(async () => {
    try { const res = await fetch('/api/activity?limit=30'); if (res.ok) setActivities(await res.json()); } catch { /* ok */ }
  }, []);
  const fetchSettings = useCallback(async () => {
    try { const res = await fetch('/api/settings'); if (res.ok) { const s = await res.json(); setUserSettings(s); setShowCharts(s.showCharts); if (s.defaultSort) setSortBy(s.defaultSort as SortOption); } } catch { /* ok */ }
  }, []);
  const fetchTrash = useCallback(async () => {
    try { const res = await fetch('/api/trash'); if (res.ok) setTrashedErrands(await res.json()); } catch { /* ok */ }
  }, []);
  const fetchTrends = useCallback(async () => {
    try { const res = await fetch('/api/stats/trends'); if (res.ok) setTrendsData(await res.json()); } catch { /* ok */ }
  }, []);
  const fetchEnhancedStats = useCallback(async () => {
    try { const res = await fetch('/api/stats'); if (res.ok) { const s = await res.json(); setEnhancedStats({ completedToday: s.completedToday ?? 0, streakDays: s.streakDays ?? 0, avgTimeToComplete: s.avgTimeToComplete ?? 0, thisMonthCompleted: s.thisMonthCompleted ?? 0 }); } } catch { /* ok */ }
  }, []);
  const fetchAnalytics = useCallback(async () => {
    try { const res = await fetch('/api/analytics'); if (res.ok) setAnalytics(await res.json()); } catch { /* ok */ }
  }, []);

  useEffect(() => { fetchTags(); fetchCategories(); fetchActivity(); fetchSettings(); fetchTrends(); fetchEnhancedStats(); fetchAnalytics(); }, [fetchTags, fetchCategories, fetchActivity, fetchSettings, fetchTrends, fetchEnhancedStats, fetchAnalytics]);

  // Re-fetch trends when errands change
  useEffect(() => { if (errands.length > 0) { fetchTrends(); fetchEnhancedStats(); fetchAnalytics(); } }, [errands.length, fetchTrends, fetchEnhancedStats, fetchAnalytics]);

  /* ─── Advanced Search ──────────────────────────────────────── */
  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults(null); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=30`);
      if (res.ok) setSearchResults(await res.json());
    } catch { /* ok */ }
    finally { setSearchLoading(false); }
  }, []);

  /* ─── Overdue Notification ─────────────────────────────────── */
  useEffect(() => {
    if (errands.length === 0) return;
    const overdue = errands.filter(e => isOverdue(e));
    if (overdue.length > 0) {
      toast({ title: `${overdue.length} Overdue Errand${overdue.length > 1 ? 's' : ''}`, description: overdue.slice(0, 3).map(e => `"${e.title}"`).join(', '), variant: 'destructive' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Derived State ───────────────────────────────────────────── */
  const stats = useMemo(() => ({
    total: errands.length, open: errands.filter(e => e.status === 'open').length,
    in_progress: errands.filter(e => e.status === 'in_progress').length, completed: errands.filter(e => e.status === 'completed').length,
  }), [errands]);

  const filteredAndSorted = useMemo(() => {
    let r = activeTab === 'all' ? [...errands] : errands.filter(e => e.status === activeTab);
    if (tagFilter) { r = r.filter(e => e.tags?.some(et => et.tag.name === tagFilter)); }
    if (categoryFilter) { r = r.filter(e => e.categoryId === categoryFilter); }
    if (priorityFilter) { r = r.filter(e => e.priority === priorityFilter); }
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(e => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)); }
    switch (sortBy) {
      case 'newest': r.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
      case 'oldest': r.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)); break;
      case 'priority-high': r.sort((a, b) => PRIORITY_VALUE[b.priority] - PRIORITY_VALUE[a.priority]); break;
      case 'priority-low': r.sort((a, b) => PRIORITY_VALUE[a.priority] - PRIORITY_VALUE[b.priority]); break;
      case 'due-date': r.sort((a, b) => { if (!a.dueDate && !b.dueDate) return 0; if (!a.dueDate) return 1; if (!b.dueDate) return -1; return +new Date(a.dueDate) - +new Date(b.dueDate); }); break;
      case 'alpha': r.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return r;
  }, [errands, activeTab, search, sortBy, tagFilter, categoryFilter, priorityFilter]);

  const activeFilterCount = [tagFilter, categoryFilter, priorityFilter].filter(Boolean).length;
  const allSelected = filteredAndSorted.length > 0 && filteredAndSorted.every(e => selected.has(e.id));

  /* ─── Quick Add Handler ─────────────────────────────────────── */
  const handleQuickAdd = async () => {
    if (!quickAdd.trim()) return;
    setQuickAdding(true);
    try {
      const res = await fetch('/api/errands/quick', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: quickAdd.trim() }) });
      if (!res.ok) throw new Error();
      const n = await res.json();
      setErrands(p => [n, ...p]);
      toast({ title: 'Quick Added', description: `"${n.title}"` });
      setQuickAdd('');
      fetchActivity(); fetchTrends(); fetchEnhancedStats();
    } catch { toast({ title: 'Error', description: 'Quick add failed', variant: 'destructive' }); }
    finally { setQuickAdding(false); }
  };

  /* ─── Progress Update Handler ───────────────────────────────── */
  const handleProgressChange = async (errandId: string, progress: number) => {
    try {
      const res = await fetch('/api/errands/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: errandId, progress }) });
      if (res.ok) { const u = await res.json(); setErrands(p => p.map(e => e.id === u.id ? { ...e, progress: u.progress } : e)); }
    } catch { /* silent */ }
  };

  /* ─── Command Palette ──────────────────────────────────────────── */
  const cmdActions = useMemo(() => {
    const actions: { id: string; label: string; icon: React.ElementType; action: () => void; category: string }[] = [
      { id: 'new', label: 'New Errand', icon: Plus, action: () => { setCmdOpen(false); setAddOpen(true); }, category: 'Actions' },
      { id: 'search', label: 'Advanced Search', icon: Search, action: () => { setCmdOpen(false); setSearchMode(p => !p); setSearchResults(null); }, category: 'Navigate' },
      { id: 'kanban', label: 'Toggle Kanban View', icon: LayoutGrid, action: () => { setViewMode(p => p === 'kanban' ? 'list' : 'kanban'); setCmdOpen(false); }, category: 'View' },
      { id: 'analytics', label: 'Toggle Analytics Panel', icon: Brain, action: () => { setShowNotifications(p => !p); setCmdOpen(false); }, category: 'View' },
      { id: 'charts', label: 'Toggle Analytics', icon: Zap, action: () => { setShowCharts(p => !p); setCmdOpen(false); }, category: 'View' },
      { id: 'activity', label: 'Toggle Activity Log', icon: History, action: () => { setShowActivity(p => !p); setCmdOpen(false); }, category: 'View' },
      { id: 'filters', label: 'Toggle Filters', icon: Filter, action: () => { setShowFilters(p => !p); setCmdOpen(false); }, category: 'View' },
      { id: 'trash', label: 'Toggle Trash View', icon: Trash, action: () => { setShowTrash(p => !p); setCmdOpen(false); }, category: 'View' },
      { id: 'settings', label: 'Settings', icon: Settings, action: () => { setCmdOpen(false); setSettingsOpen(true); }, category: 'Actions' },
      { id: 'export-csv', label: 'Export as CSV', icon: FileSpreadsheet, action: () => { exportToCSV(filteredAndSorted); setCmdOpen(false); }, category: 'Export' },
      { id: 'export-pdf', label: 'Export as PDF', icon: FileText, action: () => { exportToPDF(filteredAndSorted); setCmdOpen(false); }, category: 'Export' },
      { id: 'new-tag', label: 'Create Tag', icon: TagIcon, action: () => { setCmdOpen(false); setTagDialogOpen(true); }, category: 'Actions' },
      { id: 'new-cat', label: 'Create Category', icon: FolderOpen, action: () => { setCmdOpen(false); setCatDialogOpen(true); }, category: 'Actions' },
      { id: 'select-all', label: 'Select All', icon: CheckSquare, action: () => { toggleSelectAll(); setCmdOpen(false); }, category: 'Actions' },
      ...['all', 'open', 'in_progress', 'completed'].map(s => ({
        id: `view-${s}`, label: `View: ${s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}`, icon: STATUS_CONFIG[s]?.icon || ClipboardList,
        action: () => { setActiveTab(s as StatusFilter); setCmdOpen(false); }, category: 'Navigate',
      })),
    ];
    return actions;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAndSorted, errands]);

  const filteredCmdActions = useMemo(() => {
    if (!cmdSearch.trim()) return cmdActions;
    const q = cmdSearch.toLowerCase();
    return cmdActions.filter(a => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }, [cmdActions, cmdSearch]);

  /* ─── Handlers ────────────────────────────────────────────────── */
  const openEdit = useCallback((e: Errand) => { setEditErrand(e); setEditTitle(e.title); setEditDesc(e.description || ''); setEditPriority(e.priority); setEditDueDate(e.dueDate ? new Date(e.dueDate) : undefined); setEditEstMinutes(e.estimatedMinutes ? String(e.estimatedMinutes) : ''); setEditCategoryId(e.categoryId); setEditTagIds(e.tags?.map(et => et.tagId) || []); setEditOpen(true); }, []);
  const openDelete = useCallback((e: Errand) => { setDeleteTarget(e); setDeleteOpen(true); }, []);
  const toggleSelectAll = () => setSelected(allSelected ? new Set() : new Set(filteredAndSorted.map(e => e.id)));

  const startInlineEdit = (errand: Errand) => { setInlineEditId(errand.id); setInlineTitle(errand.title); };
  const saveInlineEdit = async (errand: Errand) => {
    if (!inlineTitle.trim() || inlineTitle === errand.title) { setInlineEditId(null); return; }
    try {
      const res = await fetch(`/api/errands/${errand.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: inlineTitle.trim() }) });
      if (res.ok) { const u = await res.json(); setErrands(p => p.map(e => e.id === u.id ? u : e)); toast({ title: 'Title Updated' }); fetchActivity(); }
    } catch { toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' }); }
    setInlineEditId(null);
  };

  /* ─── Keyboard Shortcuts ──────────────────────────────────────── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      const inDialog = addOpen || editOpen || deleteOpen || authOpen || bulkDeleteOpen || cmdOpen || settingsOpen || catDialogOpen || tagDialogOpen;
      if (e.key === 'Escape' && inDialog) { e.preventDefault(); if (addOpen) setAddOpen(false); else if (editOpen) setEditOpen(false); else if (deleteOpen) setDeleteOpen(false); else if (authOpen) setAuthOpen(false); else if (bulkDeleteOpen) setBulkDeleteOpen(false); else if (cmdOpen) setCmdOpen(false); else if (settingsOpen) setSettingsOpen(false); else if (catDialogOpen) setCatDialogOpen(false); else if (tagDialogOpen) setTagDialogOpen(false); return; }
      if (inInput || inDialog) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); return; }
      if (e.key === '?') { e.preventDefault(); setCmdOpen(true); return; }
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setAddOpen(true); return; }
      if (e.key === 'q' || e.key === 'Q') { e.preventDefault(); document.getElementById('quick-add-input')?.focus(); return; }
      if ((e.key === 'e' || e.key === 'E') && lastFocusedId) { e.preventDefault(); const t = errands.find(x => x.id === lastFocusedId); if (t) openEdit(t); return; }
      if ((e.key === 'd' || e.key === 'D') && lastFocusedId) { e.preventDefault(); const t = errands.find(x => x.id === lastFocusedId); if (t) openDelete(t); return; }
      if (e.key === 'a' && !e.metaKey && !e.ctrlKey && filteredAndSorted.length > 0) { e.preventDefault(); toggleSelectAll(); return; }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); setShowTrash(p => !p); return; }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setShowFilters(p => !p); return; }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [addOpen, editOpen, deleteOpen, authOpen, bulkDeleteOpen, cmdOpen, settingsOpen, catDialogOpen, tagDialogOpen, lastFocusedId, errands, allSelected, filteredAndSorted, openEdit, openDelete]);

  /* ─── CRUD Handlers ───────────────────────────────────────────── */
  const handleAdd = async () => {
    if (!addTitle.trim()) { toast({ title: 'Validation Error', description: 'Title is required', variant: 'destructive' }); return; }
    setAddSubmitting(true);
    try {
      const res = await fetch('/api/errands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: addTitle.trim(), description: addDesc.trim() || undefined, priority: addPriority, dueDate: addDueDate ? addDueDate.toISOString() : null, estimatedMinutes: addEstMinutes ? parseInt(addEstMinutes) : null, categoryId: addCategoryId, tagIds: addTagIds.length > 0 ? addTagIds : undefined }) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      const n = await res.json(); setErrands(p => [n, ...p]);
      toast({ title: 'Errand Created', description: `"${n.title}" added` });
      setAddTitle(''); setAddDesc(''); setAddPriority('medium'); setAddDueDate(undefined); setAddEstMinutes(''); setAddCategoryId(null); setAddOpen(false); setAddTagIds([]);
      fetchActivity();
    } catch (e) { toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
    finally { setAddSubmitting(false); }
  };

  const handleEdit = async () => {
    if (!editErrand || !editTitle.trim()) return; setEditSubmitting(true);
    try {
      const res = await fetch(`/api/errands/${editErrand.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: editTitle.trim(), description: editDesc.trim() || null, priority: editPriority, dueDate: editDueDate ? editDueDate.toISOString() : null, estimatedMinutes: editEstMinutes ? parseInt(editEstMinutes) : null, categoryId: editCategoryId, tagIds: editTagIds }) });
      if (!res.ok) throw new Error(); const u = await res.json();
      setErrands(p => p.map(e => e.id === u.id ? u : e)); toast({ title: 'Updated', description: `"${u.title}" saved` }); setEditOpen(false); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' }); }
    finally { setEditSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleteSubmitting(true);
    try {
      const res = await fetch(`/api/errands/${deleteTarget.id}`, { method: 'DELETE' }); if (!res.ok) throw new Error();
      setLastDeleted(deleteTarget);
      setErrands(p => p.filter(e => e.id !== deleteTarget.id));
      toast({ title: 'Deleted', description: `"${deleteTarget.title}" moved to trash`, action: <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg gap-1" onClick={() => handleUndo(deleteTarget.id)}><Undo2 className="size-3" /> Undo</Button>, duration: 8000 });
      setDeleteOpen(false); setDeleteTarget(null); setSelected(p => { const n = new Set(p); n.delete(deleteTarget.id); return n; }); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' }); }
    finally { setDeleteSubmitting(false); }
  };

  const handleUndo = async (id: string) => {
    try { const res = await fetch('/api/errands/undo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (res.ok) { setLastDeleted(null); fetchErrands(); fetchActivity(); toast({ title: 'Restored', description: 'Errand restored successfully' }); } } catch { /* silent */ }
  };

  const handleDuplicate = async (errand: Errand) => {
    try {
      const res = await fetch(`/api/errands/${errand.id}/duplicate`, { method: 'POST' });
      if (res.ok) { const dup = await res.json(); setErrands(p => [dup, ...p]); toast({ title: 'Duplicated', description: `"${dup.title}" created` }); fetchActivity(); }
    } catch { toast({ title: 'Error', description: 'Failed to duplicate', variant: 'destructive' }); }
  };

  const handleRestoreTrash = async (id: string) => {
    try {
      const res = await fetch('/api/errands/undo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) { fetchTrash(); fetchErrands(); toast({ title: 'Restored' }); }
    } catch { toast({ title: 'Error', description: 'Failed to restore', variant: 'destructive' }); }
  };

  const handleEmptyTrash = async () => {
    try {
      await Promise.all(trashedErrands.map(e => fetch(`/api/errands/${e.id}`, { method: 'DELETE' })));
      setTrashedErrands([]); toast({ title: 'Trash Emptied' }); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); }
  };

  const fetchSubtasks = useCallback(async (errandId: string) => {
    try { const res = await fetch(`/api/errands/${errandId}/subtasks`); if (res.ok) { const data = await res.json(); setSubtasksMap(p => ({ ...p, [errandId]: data })); } } catch { /* ok */ }
  }, []);

  const fetchNotes = useCallback(async (errandId: string) => {
    try { const res = await fetch(`/api/errands/${errandId}/notes`); if (res.ok) { const data = await res.json(); setNotesMap(p => ({ ...p, [errandId]: data })); } } catch { /* ok */ }
  }, []);

  const handleAddSubtask = async (errandId: string) => {
    if (!newSubtask.trim()) return;
    try {
      const res = await fetch(`/api/errands/${errandId}/subtasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newSubtask.trim() }) });
      if (res.ok) { setNewSubtask(''); fetchSubtasks(errandId); const er = await fetch(`/api/errands/${errandId}`); if (er.ok) { const u = await er.json(); setErrands(p => p.map(e => e.id === errandId ? u : e)); } }
    } catch { toast({ title: 'Error', description: 'Failed to add subtask', variant: 'destructive' }); }
  };

  const handleToggleSubtask = async (errandId: string, subtaskId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/errands/${errandId}/subtasks/${subtaskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed }) });
      if (res.ok) { fetchSubtasks(errandId); const er = await fetch(`/api/errands/${errandId}`); if (er.ok) { const u = await er.json(); setErrands(p => p.map(e => e.id === errandId ? u : e)); } }
    } catch { /* silent */ }
  };

  const handleDeleteSubtask = async (errandId: string, subtaskId: string) => {
    try {
      await fetch(`/api/errands/${errandId}/subtasks/${subtaskId}`, { method: 'DELETE' });
      fetchSubtasks(errandId); const er = await fetch(`/api/errands/${errandId}`); if (er.ok) { const u = await er.json(); setErrands(p => p.map(e => e.id === errandId ? u : e)); }
    } catch { /* silent */ }
  };

  const handleAddNote = async (errandId: string) => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(`/api/errands/${errandId}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newNote.trim() }) });
      if (res.ok) { setNewNote(''); fetchNotes(errandId); const er = await fetch(`/api/errands/${errandId}`); if (er.ok) { const u = await er.json(); setErrands(p => p.map(e => e.id === errandId ? u : e)); } }
    } catch { toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' }); }
  };

  const handleDeleteNote = async (errandId: string, noteId: string) => {
    try {
      await fetch(`/api/errands/${errandId}/notes/${noteId}`, { method: 'DELETE' });
      fetchNotes(errandId);
    } catch { /* silent */ }
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) return;
    try {
      const res = await fetch('/api/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: tagName.trim(), color: tagColor }) });
      if (res.ok) { fetchTags(); toast({ title: 'Tag Created', description: `"${tagName.trim()}"` }); setTagDialogOpen(false); setTagName(''); }
    } catch { toast({ title: 'Error', description: 'Failed to create tag', variant: 'destructive' }); }
  };

  const handleCreateCategory = async () => {
    if (!catName.trim()) return;
    try {
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: catName.trim(), color: catColor }) });
      if (res.ok) { fetchCategories(); toast({ title: 'Category Created', description: `"${catName.trim()}"` }); setCatDialogOpen(false); setCatName(''); }
    } catch { toast({ title: 'Error', description: 'Failed to create category', variant: 'destructive' }); }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userSettings) });
      toast({ title: 'Settings Saved' }); setSettingsOpen(false);
    } catch { toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' }); }
  };

  const handleStatusChange = async (errand: Errand) => {
    const next = NEXT_STATUS[errand.status]; if (!next) return; setStatusChanging(errand.id);
    try {
      const res = await fetch(`/api/errands/${errand.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
      if (!res.ok) throw new Error(); const u = await res.json();
      setErrands(p => p.map(e => e.id === u.id ? u : e));
      toast({ title: 'Status Changed', description: `"${u.title}" is now ${STATUS_CONFIG[next].label}` }); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); }
    finally { setStatusChanging(null); }
  };

  const toggleComplete = async (errand: Errand, event?: React.MouseEvent) => {
    const ns = errand.status === 'completed' ? 'open' : (NEXT_STATUS[errand.status] || 'in_progress');
    if (ns === 'completed' && event) spawnParticles(event.clientX, event.clientY, 30);
    setStatusChanging(errand.id);
    try {
      const res = await fetch(`/api/errands/${errand.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: ns }) });
      if (!res.ok) throw new Error(); const u = await res.json();
      setErrands(p => p.map(e => e.id === u.id ? u : e));
    } catch { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); }
    finally { setStatusChanging(null); }
  };

  const toggleSelect = (id: string) => setSelected(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const handleBulkStatus = async (status: string) => {
    setBulkSubmitting(true);
    try {
      const res = await fetch('/api/errands/batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status', ids: Array.from(selected), status }) });
      if (!res.ok) throw new Error();
      toast({ title: 'Bulk Updated', description: `${selected.size} errands marked as ${STATUS_CONFIG[status]?.label || status}` }); setSelected(new Set()); fetchErrands(); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Bulk update failed', variant: 'destructive' }); }
    finally { setBulkSubmitting(false); }
  };

  const handleBulkDelete = async () => {
    setBulkSubmitting(true);
    try {
      const res = await fetch('/api/errands/batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', ids: Array.from(selected) }) });
      if (!res.ok) throw new Error();
      setErrands(p => p.filter(e => !selected.has(e.id)));
      toast({ title: 'Bulk Deleted', description: `${selected.size} errands removed` }); setSelected(new Set()); setBulkDeleteOpen(false); fetchActivity();
    } catch { toast({ title: 'Error', description: 'Bulk delete failed', variant: 'destructive' }); }
    finally { setBulkSubmitting(false); }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over || active.id === over.id) return;
    if (activeTab !== 'all') return;
    const reordered = arrayMove(errands, errands.findIndex(e => e.id === active.id), errands.findIndex(e => e.id === over.id));
    setErrands(reordered);
    try { void fetch('/api/errands/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: reordered.map(e => e.id) }) }); } catch { /* ok */ }
  };

  const handleAuth = async () => {
    if (authMode === 'register') {
      if (!authName.trim() || !authEmail.trim() || authPassword.length < 6) { toast({ title: 'Error', description: 'All fields required. Password min 6 chars.', variant: 'destructive' }); return; }
      setAuthSubmitting(true);
      try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: authName.trim(), email: authEmail.trim(), password: authPassword }) });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
        toast({ title: 'Account Created', description: 'You can now sign in' }); setAuthMode('login'); setAuthPassword('');
      } catch (e) { toast({ title: 'Registration Failed', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
      finally { setAuthSubmitting(false); }
    } else {
      if (!authEmail.trim() || !authPassword.trim()) { toast({ title: 'Error', description: 'Email and password required', variant: 'destructive' }); return; }
      setAuthSubmitting(true);
      try {
        const result = await signIn('credentials', { email: authEmail.trim(), password: authPassword, redirect: false });
        if (result?.error) throw new Error('Invalid email or password');
        toast({ title: 'Welcome back!' }); setAuthOpen(false); setAuthEmail(''); setAuthPassword(''); fetchErrands();
      } catch (e) { toast({ title: 'Sign In Failed', description: e instanceof Error ? e.message : 'Failed', variant: 'destructive' }); }
      finally { setAuthSubmitting(false); }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden page-enter">
      {/* 3D Background */}
      <Suspense fallback={null}><Scene3D /></Suspense>
      <CursorGlow />
      <ParticleOverlay canvasRef={canvasRef} />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ─── Header ──────────────────────────────────────────── */}
        <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="sticky top-0 z-30 glass-strong">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <motion.div className="flex items-center gap-2.5 shrink-0" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                <motion.div animate={{ rotateY: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ transformStyle: 'preserve-3d' }}>
                  <Box className="size-5" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold tracking-tight leading-none">Errands</h1>
                <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Tracker Pro</p>
              </div>
            </motion.div>

            <div className="flex-1 max-w-xs relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input id="search-input" placeholder="Search... (Ctrl+K for advanced)" value={search} onChange={e => {
                const v = e.target.value; setSearch(v);
                if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout(() => { if (v.trim().length >= 2) handleSearch(v); else setSearchResults(null); }, 300);
              }} className="pl-9 h-10 text-sm rounded-xl border-border/50 bg-background/50 backdrop-blur-sm" />
              {search && <button onClick={() => { setSearch(''); setSearchResults(null); }} className="absolute right-3 top-1/2 -translate-y-1/2"><XCircle className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" /></button>}
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchResults && search.trim().length >= 2 && (
                  <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-1.5 glass-strong rounded-xl border-border/30 z-50 max-h-80 overflow-y-auto shadow-2xl">
                    {searchLoading && <div className="p-4 text-center"><Loader2 className="size-5 animate-spin text-violet-500 mx-auto" /></div>}
                    {!searchLoading && searchResults.errands.length === 0 && searchResults.categories.length === 0 && searchResults.tags.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
                    )}
                    {searchResults.errands.length > 0 && (
                      <div className="p-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">Errands ({searchResults.errands.length})</p>
                        {searchResults.errands.slice(0, 6).map(e => (
                          <button key={e.id} onClick={() => { setSearch(''); setSearchResults(null); }} className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-background/50 transition-colors flex items-center gap-2.5 group">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${e.status === 'completed' ? 'bg-cyan-500' : e.status === 'in_progress' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <span className="text-sm truncate flex-1">{e.title}</span>
                            <Badge variant="outline" className="text-[9px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{STATUS_CONFIG[e.status]?.label}</Badge>
                          </button>
                        ))}
                      </div>
                    )}
                    {(searchResults.categories.length > 0 || searchResults.tags.length > 0) && (
                      <div className="border-t border-border/20 p-2">
                        {searchResults.categories.length > 0 && (
                          <div className="mb-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">Categories</p>
                            {searchResults.categories.slice(0, 3).map(c => (
                              <div key={c.id} className="px-2.5 py-1.5 flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</div>
                            ))}
                          </div>
                        )}
                        {searchResults.tags.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">Tags</p>
                            {searchResults.tags.slice(0, 3).map(t => (
                              <div key={t.id} className="px-2.5 py-1.5 flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />{t.name}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Command Palette Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-xl h-9 text-muted-foreground" onClick={() => setCmdOpen(true)}>
                  <Command className="size-3.5" /><kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded glass font-mono">?</kbd>
                </Button>
              </motion.div>
              {/* View Mode Toggle */}
              <div className="flex items-center glass rounded-xl p-0.5">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="size-7 rounded-lg" onClick={() => setViewMode('list')} title="List View"><LayoutList className="size-3.5" /></Button>
                <Button variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} size="icon" className="size-7 rounded-lg" onClick={() => setViewMode('kanban')} title="Kanban View"><LayoutGrid className="size-3.5" /></Button>
              </div>
              {/* Analytics Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className={`size-9 rounded-xl relative ${showNotifications ? 'bg-violet-500/15 text-violet-500' : 'text-muted-foreground'}`} onClick={() => setShowNotifications(p => !p)} title="Analytics Dashboard">
                  <Brain className="size-4" />
                  {analytics && analytics.productivityScore >= 80 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full pulse-ring" />}
                </Button>
              </motion.div>
              <ThemeToggle />
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-xl h-9">
                        <Shield className="size-3.5 text-emerald-500" />
                        <span className="hidden sm:inline font-medium">{session.user?.name || 'User'}</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="gap-2 text-xs cursor-pointer rounded-lg"><Settings className="size-3.5" /> Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-xs cursor-pointer rounded-lg text-destructive"><LogOut className="size-3.5" /> Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs rounded-xl h-9" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>
                    <LogIn className="size-3.5" /><span className="hidden sm:inline font-medium">Sign In</span>
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-sm opacity-60" />
                <Button onClick={() => setAddOpen(true)} size="sm" className="gap-1.5 rounded-xl h-9 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/30 border-0 relative btn-glow-pulse">
                  <Plus className="size-4" /><span className="hidden sm:inline font-semibold">New Errand</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* ─── Main Content ─────────────────────────────────────── */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">

          {/* 3D Stats Visualization */}
          {errands.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.05 }}>
              <Suspense fallback={<div className="glass rounded-2xl h-[140px] shimmer" />}><Stats3D stats={stats} /></Suspense>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {analytics && (
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.08 }}>
                <TiltCard tiltDegree={5} glareOpacity={0.1} scaleOnHover={1.06}>
                  <div className="glass aurora-border rounded-2xl p-4 sm:p-5 cursor-default group relative overflow-hidden magnetic-lift card-gradient-hover flex items-center justify-center">
                    <ProductivityRing score={analytics.productivityScore} size={72} />
                  </div>
                </TiltCard>
              </motion.div>
            )}
            <StatCard label="Total" value={stats.total} icon={ClipboardList} color="text-foreground" delay={0.1} subtitle={`${enhancedStats?.thisMonthCompleted ?? 0} done this month`} trend={enhancedStats && enhancedStats.thisMonthCompleted > 0 ? 'up' : null} />
            <StatCard label="Open" value={stats.open} icon={CircleDot} color="text-emerald-500" delay={0.15} subtitle={enhancedStats?.completedToday ? `${enhancedStats.completedToday} done today` : undefined} trend={enhancedStats && enhancedStats.completedToday > 0 ? 'up' : null} />
            <StatCard label="In Progress" value={stats.in_progress} icon={Clock} color="text-amber-500" delay={0.2} />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="text-cyan-500" delay={0.25} subtitle={enhancedStats?.streakDays ? `${enhancedStats.streakDays}d streak` : undefined} trend={stats.completed > 0 ? 'up' : null} />
          </div>

          {/* Filter Bar: Tags + Categories + Priority */}
          {(tags.length > 0 || categories.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="space-y-2">
              <div className="flex items-center justify-between">
                <button onClick={() => setShowFilters(p => !p)} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Filter className="size-3.5 text-violet-500" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && <Badge variant="secondary" className="h-5 px-1.5 text-[10px] rounded-full bg-violet-500/20 text-violet-600 border-violet-500/30">{activeFilterCount}</Badge>}
                  <ChevronDown className={`size-3.5 transition-transform duration-300 ${showFilters ? '' : '-rotate-90'}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive hover:text-destructive rounded-lg" onClick={() => { setTagFilter(null); setCategoryFilter(null); setPriorityFilter(null); }}>
                      <X className="size-3 mr-1" /> Clear all
                    </Button>
                  )}
                  <button onClick={() => setTagDialogOpen(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border/50 hover:border-violet-500/50 px-2.5 py-1 rounded-lg">
                    <TagIcon className="size-3 inline mr-1" />+ Tag
                  </button>
                  <button onClick={() => setCatDialogOpen(true)} className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border/50 hover:border-violet-500/50 px-2.5 py-1 rounded-lg">
                    <FolderOpen className="size-3 inline mr-1" />+ Category
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="glass rounded-xl p-3 space-y-3">
                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          <TagIcon className="size-3 text-muted-foreground shrink-0" />
                          <button onClick={() => setTagFilter(null)} className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${!tagFilter ? 'glass text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
                          {tags.map(t => (
                            <button key={t.id} onClick={() => setTagFilter(tagFilter === t.name ? null : t.name)} className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${tagFilter === t.name ? 'text-white' : 'text-muted-foreground hover:text-foreground bg-background/50 border border-border/30'}`} style={tagFilter === t.name ? { backgroundColor: t.color } : {}}>
                              {t.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Categories */}
                      {categories.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          <FolderOpen className="size-3 text-muted-foreground shrink-0" />
                          <button onClick={() => setCategoryFilter(null)} className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${!categoryFilter ? 'glass text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
                          {categories.map(c => (
                            <button key={c.id} onClick={() => setCategoryFilter(categoryFilter === c.id ? null : c.id)} className={`shrink-0 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${categoryFilter === c.id ? 'text-white' : 'text-muted-foreground hover:text-foreground bg-background/50 border border-border/30'}`} style={categoryFilter === c.id ? { backgroundColor: c.color } : {}}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}
                              {c._count && <span className="opacity-70">({c._count.errands})</span>}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Priority filter */}
                      <div className="flex items-center gap-2">
                        <Star className="size-3 text-muted-foreground" />
                        <button onClick={() => setPriorityFilter(null)} className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${!priorityFilter ? 'glass text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>All Priorities</button>
                        {(['high', 'medium', 'low'] as const).map(p => (
                          <button key={p} onClick={() => setPriorityFilter(priorityFilter === p ? null : p)} className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${priorityFilter === p ? PRIORITY_CONFIG[p].color + ' ring-1 ring-current/20' : 'text-muted-foreground hover:text-foreground'}`}>
                            {PRIORITY_CONFIG[p].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Charts */}
          {errands.length > 0 && showCharts && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setShowCharts(!showCharts)} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
                  <Zap className="size-3.5 text-violet-500" /><span>Analytics Dashboard</span>
                  <ChevronDown className={`size-3.5 transition-transform duration-300 ${showCharts ? '' : '-rotate-90'}`} />
                </button>
                {analytics && (
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Rocket className="size-3 text-violet-500" />
                      <span>Productivity:</span>
                      <span className={`font-bold ${analytics.productivityScore >= 80 ? 'text-emerald-500' : analytics.productivityScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{analytics.productivityScore}/100</span>
                    </div>
                    <div className="w-20 h-1.5 rounded-full bg-border/30 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: analytics.productivityScore >= 80 ? '#10b981' : analytics.productivityScore >= 50 ? '#f59e0b' : '#ef4444' }}
                        initial={{ width: 0 }} animate={{ width: `${analytics.productivityScore}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
                    </div>
                  </div>
                )}
              </div>
              <AnimatePresence>
                {showCharts && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass rounded-xl h-64 shimmer" />)}</div>}>
                          <PremiumCharts errands={errands} trendsData={trendsData ?? undefined} />
                        </Suspense>
                      </div>
                      <AnimatePresence>
                        {showNotifications && analytics && (
                          <AnalyticsPanel analytics={analytics} enhancedStats={enhancedStats} onClose={() => setShowNotifications(false)} />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Quick Add Bar */}
          {!showTrash && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
              <div className="quick-add-glow glass-depth-2 rounded-2xl p-1.5 flex items-center gap-2 transition-all duration-300">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-violet-500/60" />
                  <Input
                    id="quick-add-input"
                    placeholder="Quick add errand... (type & press Enter)"
                    value={quickAdd}
                    onChange={e => setQuickAdd(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleQuickAdd(); } }}
                    disabled={quickAdding}
                    className="pl-10 h-10 text-sm rounded-xl border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/60"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
                  <Button
                    onClick={handleQuickAdd}
                    disabled={quickAdding || !quickAdd.trim()}
                    size="sm"
                    className="gap-1.5 rounded-xl h-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold px-4 shrink-0"
                  >
                    {quickAdding ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3.5" />}
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Tabs + Sort + Export + Trash Toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Tabs value={activeTab} onValueChange={v => { setActiveTab(v as StatusFilter); setSelected(new Set()); }}>
              <TabsList className="w-full sm:w-auto glass p-1 rounded-xl h-11">
                <TabsTrigger value="all" className="gap-1.5 text-xs rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm font-medium">All <span className="text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md text-[10px]">{stats.total}</span></TabsTrigger>
                <TabsTrigger value="open" className="gap-1.5 text-xs rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm font-medium">Open <span className="text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md text-[10px]">{stats.open}</span></TabsTrigger>
                <TabsTrigger value="in_progress" className="gap-1.5 text-xs rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm font-medium">Active <span className="text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md text-[10px]">{stats.in_progress}</span></TabsTrigger>
                <TabsTrigger value="completed" className="gap-1.5 text-xs rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm font-medium">Done <span className="text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md text-[10px]">{stats.completed}</span></TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[160px] h-10 text-xs rounded-xl border-border/50 bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">{SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className="text-xs rounded-lg">{o.label}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant={showTrash ? 'secondary' : 'ghost'} size="sm" className={`h-10 gap-1.5 text-xs rounded-xl ${showTrash ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'border-border/50 bg-background/50'}`} onClick={() => { setShowTrash(p => !p); if (!showTrash) fetchTrash(); }}>
                <Trash className="size-3.5" /><span className="hidden sm:inline font-medium">Trash</span>{trashedErrands.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[9px] rounded-full">{trashedErrands.length}</Badge>}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 gap-1.5 text-xs rounded-xl border-border/50 bg-background/50" disabled={filteredAndSorted.length === 0}>
                    <FileDown className="size-3.5" /><span className="hidden sm:inline font-medium">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuLabel className="text-xs font-semibold">Export as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => exportToCSV(filteredAndSorted)} className="gap-2 text-xs cursor-pointer rounded-lg"><FileSpreadsheet className="size-3.5" /> CSV Spreadsheet</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(filteredAndSorted)} className="gap-2 text-xs cursor-pointer rounded-lg"><FileText className="size-3.5" /> PDF Report (Print)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          {/* Trash View */}
          <AnimatePresence>
            {showTrash && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2"><Trash className="size-4 text-red-500" />Trash ({trashedErrands.length})</h3>
                    {trashedErrands.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive hover:text-destructive rounded-lg" onClick={handleEmptyTrash}>Empty Trash</Button>
                    )}
                  </div>
                  {trashedErrands.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Trash is empty</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {trashedErrands.map(e => (
                        <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background/30 group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{e.title}</p>
                            <p className="text-[10px] text-muted-foreground">Deleted {e.deletedAt ? fmtTimeAgo(e.deletedAt) : 'unknown'}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRestoreTrash(e.id)}>
                            <RotateCcw className="size-3" /> Restore
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Selection Bar */}
          <AnimatePresence>
            {filteredAndSorted.length > 0 && !showTrash && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Select all" className="size-4" />
                    <span className="text-xs text-muted-foreground font-medium">Select all</span>
                  </div>
                  <AnimatePresence>
                    {selected.size > 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-1.5 ml-auto flex-wrap">
                        <motion.span className="text-xs text-muted-foreground font-medium" key={selected.size} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>{selected.size} selected</motion.span>
                        <Separator orientation="vertical" className="h-4" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 rounded-lg" disabled={bulkSubmitting}><CheckSquare className="size-3" /> Status <ChevronDown className="size-3" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-xl">
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                              <DropdownMenuItem key={key} onClick={() => handleBulkStatus(key)} className="text-xs cursor-pointer gap-2 rounded-lg"><cfg.icon className="size-3" /> {cfg.label}</DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-destructive hover:text-destructive rounded-lg" onClick={() => setBulkDeleteOpen(true)} disabled={bulkSubmitting}><Trash2 className="size-3" /> Delete</Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Errands List / Kanban Board */}
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
              <Suspense fallback={<ShimmerLoader />}><PremiumLoader /></Suspense>
            </motion.div>
          ) : showTrash ? null : viewMode === 'kanban' && !search ? (
            <KanbanBoard errands={filteredAndSorted} onStatusChange={handleStatusChange} onEdit={openEdit} onDelete={openDelete} onDuplicate={handleDuplicate}
              onExpand={setExpandedId} expandedId={expandedId} subtasksMap={subtasksMap} notesMap={notesMap}
              setSubtasksMap={setSubtasksMap} setNotesMap={setNotesMap} newSubtask={newSubtask} setNewSubtask={setNewSubtask}
              newNote={newNote} setNewNote={setNewNote} handleAddSubtask={handleAddSubtask} handleToggleSubtask={handleToggleSubtask}
              handleDeleteSubtask={handleDeleteSubtask} handleAddNote={handleAddNote} handleDeleteNote={handleDeleteNote}
              statusChanging={statusChanging} categories={categories} tags={tags} spawnParticles={spawnParticles} />
          ) : filteredAndSorted.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
              <div className="glass rounded-2xl py-16 flex flex-col items-center gap-4 text-center overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden opacity-30">
                  <motion.div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 blur-2xl" animate={{ x: [-20, 20, -20], y: [-10, 10, -10], scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} style={{ top: '10%', left: '20%' }} />
                  <motion.div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-2xl" animate={{ x: [15, -15, 15], y: [10, -10, 10], scale: [1.1, 0.9, 1.1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} style={{ bottom: '15%', right: '15%' }} />
                </div>
                <motion.div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 float-3d"><Sparkles className="size-9 text-violet-500" /></motion.div>
                <div className="relative">
                  <p className="font-semibold text-lg">{search || tagFilter || categoryFilter || priorityFilter ? 'No results found' : 'No errands yet'}</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{search || tagFilter || categoryFilter || priorityFilter ? 'Try different filters or search terms.' : (activeTab === 'all' ? 'Hit the button below or press N to create your first errand.' : `No ${STATUS_CONFIG[activeTab]?.label?.toLowerCase() || ''} errands.`)}</p>
                </div>
                {activeTab === 'all' && !search && !tagFilter && !categoryFilter && !priorityFilter && (
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-md opacity-50" />
                    <Button size="sm" className="mt-2 gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 border-0 font-semibold relative" onClick={() => setAddOpen(true)}><Plus className="size-3.5" /> Create Your First Errand</Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredAndSorted.map(e => e.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredAndSorted.map((errand, index) => {
                      const sc = STATUS_CONFIG[errand.status]; const pc = PRIORITY_CONFIG[errand.priority];
                      const SI = sc.icon; const ns = NEXT_STATUS[errand.status]; const od = isOverdue(errand); const isSel = selected.has(errand.id);
                      return (
                        <motion.div key={errand.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: -100, scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.03 }} layout>
                          <SortableCard errand={errand}>
                            <TiltCard tiltDegree={4} glareOpacity={0.08} scaleOnHover={1.015}>
                              <div className={`glass card-gradient-hover rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-violet-500/30 ${errand.status === 'completed' ? 'opacity-50' : ''} ${isSel ? 'ring-2 ring-violet-500/40 shadow-violet-500/10' : ''} ${od ? 'shadow-red-500/10' : ''}`} tabIndex={0} onFocus={() => setLastFocusedId(errand.id)} onKeyDown={e => { if (e.key === 'e' || e.key === 'E') { e.stopPropagation(); openEdit(errand); } if (e.key === 'd' || e.key === 'D') { e.stopPropagation(); openDelete(errand); } if (e.key === ' ') { e.preventDefault(); toggleComplete(errand); } }}>
                                <div className="p-4 sm:p-5">
                                  <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center gap-1.5 pt-0.5 shrink-0">
                                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors touch-none"><GripVertical className="size-4" /></div>
                                      <Checkbox checked={isSel} onCheckedChange={() => toggleSelect(errand.id)} className="size-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <Checkbox checked={errand.status === 'completed'} onCheckedChange={() => toggleComplete(errand)} className="size-4.5 shrink-0" disabled={statusChanging === errand.id} />
                                        </motion.div>
                                        {/* Title - inline editable */}
                                        {inlineEditId === errand.id ? (
                                          <Input value={inlineTitle} onChange={e => setInlineTitle(e.target.value)} onBlur={() => saveInlineEdit(errand)} onKeyDown={e => { if (e.key === 'Enter') saveInlineEdit(errand); if (e.key === 'Escape') setInlineEditId(null); }} autoFocus className="h-7 text-sm rounded-lg border-violet-500/50 bg-background/80 flex-1 min-w-[100px]" />
                                        ) : (
                                          <h3 className={`font-semibold text-sm sm:text-base transition-all cursor-text hover:text-violet-500 ${errand.status === 'completed' ? 'line-through text-muted-foreground' : ''}`} onDoubleClick={() => startInlineEdit(errand)}>{errand.title}</h3>
                                        )}
                                        <Badge variant="outline" className={`${sc.color} text-[11px] font-medium rounded-lg px-2 py-0.5 ${sc.glow} shadow-sm`}><SI className="size-2.5" /><span className="hidden sm:inline ml-1">{sc.label}</span></Badge>
                                        <Badge variant="outline" className={`${pc.color} text-[11px] font-medium rounded-lg px-2 py-0.5 shadow-sm`}>{pc.label}</Badge>
                                        {od && <Badge variant="outline" className="bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400 dark:border-red-500/40 gap-1 text-[11px] font-medium rounded-lg px-2 py-0.5 shadow-sm shadow-red-500/20 animate-pulse"><AlertTriangle className="size-2.5" /> Overdue</Badge>}
                                        {/* Category badge */}
                                        {errand.category && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium text-white" style={{ backgroundColor: errand.category.color }}>
                                            <FolderOpen className="size-2.5" />{errand.category.name}
                                          </span>
                                        )}
                                        {/* Estimated time badge */}
                                        {errand.estimatedMinutes && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-blue-500/15 text-blue-600 border border-blue-500/30 dark:text-blue-400">
                                            <Timer className="size-2.5" />{fmtMinutes(errand.estimatedMinutes)}
                                          </span>
                                        )}
                                      </div>
                                      {errand.description && <p className="text-sm text-muted-foreground leading-relaxed pl-7">{errand.description}</p>}
                                      {/* Tags */}
                                      {errand.tags && errand.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pl-7 mt-1">
                                          {errand.tags.map(et => (
                                            <span key={et.tagId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-white" style={{ backgroundColor: et.tag.color }}>{et.tag.name}</span>
                                          ))}
                                        </div>
                                      )}
                                      {/* Progress bar */}
                                      {errand.progress > 0 && (
                                        <div className="pl-7 mt-1.5">
                                          <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                              <motion.div className="h-full rounded-full" style={{ backgroundColor: errand.progress >= 100 ? '#06b6d4' : '#8b5cf6' }} initial={{ width: 0 }} animate={{ width: `${errand.progress}%` }} transition={{ duration: 0.5 }} />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-medium tabular-nums">{errand.progress}%</span>
                                          </div>
                                        </div>
                                      )}
                                      {/* Subtask / Notes summary */}
                                      <div className="pl-7 mt-1 flex items-center gap-3">
                                        <button onClick={() => { if (expandedId === errand.id) { setExpandedId(null); } else { setExpandedId(errand.id); fetchSubtasks(errand.id); fetchNotes(errand.id); setNewSubtask(''); setNewNote(''); } }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                          <ListChecks className="size-3" /><span>{errand._count?.subtasks ?? 0} subtask{(errand._count?.subtasks ?? 0) !== 1 ? 's' : ''}</span>
                                          {(errand._count?.notes ?? 0) > 0 && <span className="text-violet-500">· {errand._count?.notes} note{(errand._count?.notes ?? 0) !== 1 ? 's' : ''}</span>}
                                          <ChevronDown className={`size-3 transition-transform ${expandedId === errand.id ? 'rotate-180' : ''}`} />
                                        </button>
                                      </div>
                                      {/* Meta row */}
                                      <div className="flex items-center gap-3 pl-7 text-xs text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-1"><Clock className="size-3" />{fmtDate(errand.createdAt)}</span>
                                        {errand.dueDate && <span className={`flex items-center gap-1 ${od ? 'text-red-500 dark:text-red-400 font-semibold' : ''}`}><CalendarDays className="size-3" /> Due {fmtDue(errand.dueDate)}</span>}
                                        {errand.estimatedMinutes && <span className="flex items-center gap-1"><Timer className="size-3" />{fmtMinutes(errand.estimatedMinutes)}</span>}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0">
                                      {ns && (
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                          <Button variant="ghost" size="sm" className="gap-1 text-xs rounded-lg" onClick={() => handleStatusChange(errand)} disabled={statusChanging === errand.id}>
                                            {statusChanging === errand.id ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowRight className="size-3.5" />}
                                            <span className="hidden md:inline font-medium">{STATUS_CONFIG[ns].label}</span>
                                          </Button>
                                        </motion.div>
                                      )}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="rounded-lg"><MoreHorizontal className="size-3.5" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl">
                                          <DropdownMenuItem onClick={() => openEdit(errand)} className="text-xs cursor-pointer gap-2 rounded-lg"><Pencil className="size-3" /> Edit</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDuplicate(errand)} className="text-xs cursor-pointer gap-2 rounded-lg"><Copy className="size-3" /> Duplicate</DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => openDelete(errand)} className="text-xs cursor-pointer gap-2 rounded-lg text-destructive"><Trash2 className="size-3" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                                {/* Expanded panel: Subtasks + Notes */}
                                <AnimatePresence>
                                  {expandedId === errand.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                      <div className="border-t border-border/30 mx-4 mt-3 pt-3 pb-2 space-y-3">
                                        {/* Progress Slider */}
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><TrendingUp className="size-3" />Progress</p>
                                            <span className="text-[11px] font-bold tabular-nums text-violet-500">{errand.progress}%</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="flex-1 relative">
                                              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                                                <motion.div
                                                  className={`h-full rounded-full ${errand.progress >= 100 ? 'progress-shimmer bg-cyan-500' : 'bg-violet-500'}`}
                                                  initial={{ width: 0 }}
                                                  animate={{ width: `${errand.progress}%` }}
                                                  transition={{ duration: 0.5 }}
                                                />
                                              </div>
                                              <input
                                                type="range"
                                                min={0}
                                                max={100}
                                                value={errand.progress}
                                                onChange={e => handleProgressChange(errand.id, parseInt(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <Separator />
                                        {/* Subtasks */}
                                        <div className="space-y-2">
                                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ListChecks className="size-3" />Subtasks</p>
                                          {(subtasksMap[errand.id] || []).map(st => (
                                            <div key={st.id} className="flex items-center gap-2 group/sub">
                                              <Checkbox checked={st.completed} onCheckedChange={() => handleToggleSubtask(errand.id, st.id, !st.completed)} className="size-3.5" />
                                              <span className={`flex-1 text-xs ${st.completed ? 'line-through text-muted-foreground' : ''}`}>{st.title}</span>
                                              <button onClick={() => handleDeleteSubtask(errand.id, st.id)} className="opacity-0 group-hover/sub:opacity-100 transition-opacity"><X className="size-3 text-muted-foreground hover:text-destructive" /></button>
                                            </div>
                                          ))}
                                          <div className="flex items-center gap-2">
                                            <Input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(errand.id); } }} placeholder="Add subtask..." className="h-8 text-xs rounded-lg border-border/50 bg-background/50" />
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg shrink-0" onClick={() => handleAddSubtask(errand.id)}><PlusCircle className="size-3.5 text-violet-500" /></Button>
                                          </div>
                                        </div>
                                        <Separator />
                                        {/* Notes */}
                                        <div className="space-y-2">
                                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><MessageSquare className="size-3" />Notes</p>
                                          {(notesMap[errand.id] || []).map(note => (
                                            <div key={note.id} className="group/note relative bg-background/30 rounded-lg p-2.5">
                                              <p className="text-xs leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                              <div className="flex items-center justify-between mt-1.5">
                                                <span className="text-[10px] text-muted-foreground">{fmtTimeAgo(note.createdAt)}</span>
                                                <button onClick={() => handleDeleteNote(errand.id, note.id)} className="opacity-0 group-hover/note:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                                              </div>
                                            </div>
                                          ))}
                                          <div className="flex gap-2">
                                            <Input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(errand.id); } }} placeholder="Add a note..." className="h-8 text-xs rounded-lg border-border/50 bg-background/50" />
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg shrink-0" onClick={() => handleAddNote(errand.id)}><PlusCircle className="size-3.5 text-violet-500" /></Button>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </TiltCard>
                          </SortableCard>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Activity Log */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex items-center justify-between">
            <button onClick={() => setShowActivity(!showActivity)} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <History className="size-3.5 text-violet-500" /><span>Activity Log</span>
              <ChevronDown className={`size-3.5 transition-transform duration-300 ${showActivity ? '' : '-rotate-90'}`} />
            </button>
            {activities.length > 0 && <span className="text-[10px] text-muted-foreground">{activities.length} events</span>}
          </motion.div>
          <AnimatePresence>
            {showActivity && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="glass rounded-2xl p-4 max-h-64 overflow-y-auto space-y-2">
                  {activities.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No activity yet</p> : activities.map(a => (
                    <div key={a.id} className="flex items-start gap-2.5 text-xs">
                      <div className={`mt-0.5 size-2 rounded-full shrink-0 ${a.action === 'created' ? 'bg-emerald-500' : a.action === 'deleted' ? 'bg-red-500' : a.action === 'status_changed' || a.action === 'completed' ? 'bg-cyan-500' : 'bg-violet-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground">{a.details || a.action}</p>
                        <p className="text-muted-foreground mt-0.5">{a.errand?.title && <span className="font-medium">{a.errand.title}</span>}{a.errand?.title && ' · '}{fmtTimeAgo(a.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard Shortcuts Help */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-3 sm:gap-5 py-3 text-[11px] text-muted-foreground flex-wrap">
            {[
              { key: 'Q', label: 'Quick Add', icon: Send },
              { key: 'N', label: 'New', icon: Plus },
              { key: 'Ctrl+K', label: 'Commands', icon: Command },
              { key: 'E', label: 'Edit', icon: Pencil },
              { key: 'D', label: 'Delete', icon: Trash2 },
              { key: 'T', label: 'Trash', icon: Trash },
              { key: 'F', label: 'Filters', icon: Filter },
              { key: 'A', label: 'Select', icon: CheckSquare },
            ].map(s => (
              <span key={s.key} className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                <kbd className="px-1.5 py-0.5 rounded-md glass text-[10px] font-mono font-medium">{s.key}</kbd>
                <s.icon className="size-2.5" />{s.label}
              </span>
            ))}
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-auto border-t border-border/30 py-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wider uppercase">Errands Tracker &middot; Premium 3D Edition</p>
            {enhancedStats && enhancedStats.streakDays > 0 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                <Flame className="size-3" />{enhancedStats.streakDays} day streak
              </motion.div>
            )}
          </div>
        </motion.footer>
      </div>

      {/* ═══ DIALOGS ═════════════════════════════════════════════ */}

      {/* Command Palette */}
      <Dialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-lg p-0 gap-0">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
            <Command className="size-4 text-violet-500" />
            <input ref={cmdInputRef} value={cmdSearch} onChange={e => setCmdSearch(e.target.value)} placeholder="Type a command..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" autoFocus />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded glass text-muted-foreground font-mono">Esc</kbd>
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {filteredCmdActions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No matching commands</p>
            ) : (
              Object.entries(filteredCmdActions.reduce<Record<string, typeof filteredCmdActions>>((acc, a) => { (acc[a.category] = acc[a.category] || []).push(a); return acc; }, {})).map(([cat, items]) => (
                <div key={cat} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5">{cat}</p>
                  {items.map(a => (
                    <button key={a.id} onClick={a.action} className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left text-xs hover:bg-background/50 transition-colors group">
                      <a.icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><Sparkles className="size-5 text-violet-500" /> New Errand</DialogTitle>
            <DialogDescription>Add a new task to your errands list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="add-title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title *</Label><Input id="add-title" placeholder="What do you need done?" value={addTitle} onChange={e => setAddTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); } }} autoFocus className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            <div className="space-y-2"><Label htmlFor="add-desc" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</Label><Textarea id="add-desc" placeholder="Add details (optional)" value={addDesc} onChange={e => setAddDesc(e.target.value)} rows={3} className="rounded-xl border-border/50 bg-background/50 resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</Label><Select value={addPriority} onValueChange={v => setAddPriority(v as 'low' | 'medium' | 'high')}><SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Est. Time (min)</Label><Input type="number" min="1" placeholder="e.g. 30" value={addEstMinutes} onChange={e => setAddEstMinutes(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            </div>
            <DatePickerField date={addDueDate} onChange={setAddDueDate} label="Due Date" />
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={addCategoryId || 'none'} onValueChange={v => setAddCategoryId(v === 'none' ? null : v)}>
                  <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50"><SelectValue placeholder="No category" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</div></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {tags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <button key={t.id} type="button" onClick={() => setAddTagIds(p => p.includes(t.id) ? p.filter(x => x !== t.id) : [...p, t.id])} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${addTagIds.includes(t.id) ? 'text-white ring-2 ring-offset-1 ring-offset-background' : 'text-muted-foreground hover:text-foreground bg-background/50 border border-border/30'}`} style={addTagIds.includes(t.id) ? { backgroundColor: t.color, ringColor: t.color } : {}}>{t.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addSubmitting} className="rounded-xl border-border/50">Cancel</Button>
            <Button onClick={handleAdd} disabled={addSubmitting || !addTitle.trim()} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold">{addSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />} Create Errand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><Pencil className="size-5 text-violet-500" /> Edit Errand</DialogTitle>
            <DialogDescription>Update the details of this errand.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="edit-title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title *</Label><Input id="edit-title" value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEdit(); } }} autoFocus className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            <div className="space-y-2"><Label htmlFor="edit-desc" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</Label><Textarea id="edit-desc" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Add details (optional)" rows={3} className="rounded-xl border-border/50 bg-background/50 resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</Label><Select value={editPriority} onValueChange={v => setEditPriority(v as 'low' | 'medium' | 'high')}><SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Est. Time (min)</Label><Input type="number" min="1" placeholder="e.g. 30" value={editEstMinutes} onChange={e => setEditEstMinutes(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            </div>
            <DatePickerField date={editDueDate} onChange={setEditDueDate} label="Due Date" />
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={editCategoryId || 'none'} onValueChange={v => setEditCategoryId(v === 'none' ? null : v)}>
                  <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50"><SelectValue placeholder="No category" /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</div></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {tags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <button key={t.id} type="button" onClick={() => setEditTagIds(p => p.includes(t.id) ? p.filter(x => x !== t.id) : [...p, t.id])} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${editTagIds.includes(t.id) ? 'text-white ring-2 ring-offset-1 ring-offset-background' : 'text-muted-foreground hover:text-foreground bg-background/50 border border-border/30'}`} style={editTagIds.includes(t.id) ? { backgroundColor: t.color, ringColor: t.color } : {}}>{t.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={editSubmitting} className="rounded-xl border-border/50">Cancel</Button>
            <Button onClick={handleEdit} disabled={editSubmitting || !editTitle.trim()} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold">{editSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />} Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="glass-strong rounded-2xl border-border/30">
          <AlertDialogHeader><AlertDialogTitle>Delete Errand</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? It will be moved to trash.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSubmitting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteSubmitting} className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/25 border-0 font-semibold">{deleteSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />} Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent className="glass-strong rounded-2xl border-border/30">
          <AlertDialogHeader><AlertDialogTitle>Delete {selected.size} Errands</AlertDialogTitle><AlertDialogDescription>Move {selected.size} selected errand{selected.size > 1 ? 's' : ''} to trash?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkSubmitting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={bulkSubmitting} className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 rounded-xl shadow-lg shadow-red-500/25 border-0 font-semibold">{bulkSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />} Delete {selected.size} Item{selected.size > 1 ? 's' : ''}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auth Dialog */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><Shield className="size-5 text-violet-500" />{authMode === 'login' ? 'Sign In' : 'Create Account'}</DialogTitle>
            <DialogDescription>{authMode === 'login' ? 'Sign in to sync errands across devices.' : 'Register to get started with Errands Tracker.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {authMode === 'register' && <div className="space-y-2"><Label htmlFor="auth-name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</Label><Input id="auth-name" placeholder="Your name" value={authName} onChange={e => setAuthName(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50" /></div>}
            <div className="space-y-2"><Label htmlFor="auth-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label><Input id="auth-email" type="email" placeholder="you@example.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            <div className="space-y-2"><Label htmlFor="auth-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label><Input id="auth-password" type="password" placeholder="Min. 6 characters" value={authPassword} onChange={e => setAuthPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAuth(); } }} className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button variant="outline" onClick={() => setAuthOpen(false)} disabled={authSubmitting} className="sm:mr-auto rounded-xl border-border/50">Cancel</Button>
            <Button variant="ghost" size="sm" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-xs text-muted-foreground rounded-xl">{authMode === 'login' ? <>Don&apos;t have an account? <span className="underline ml-1 font-medium">Sign up</span></> : <>Already have an account? <span className="underline ml-1 font-medium">Sign in</span></>}</Button>
            <Button onClick={handleAuth} disabled={authSubmitting} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold">{authSubmitting && <Loader2 className="size-4 animate-spin mr-1.5" />}{authMode === 'login' ? 'Sign In' : 'Create Account'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><Settings className="size-5 text-violet-500" /> Settings</DialogTitle>
            <DialogDescription>Customize your experience.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Show Analytics Charts</Label>
              <Switch checked={userSettings.showCharts} onCheckedChange={v => setUserSettings(p => ({ ...p, showCharts: v }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Default View</Label>
              <Select value={userSettings.defaultView} onValueChange={v => setUserSettings(p => ({ ...p, defaultView: v }))}>
                <SelectTrigger className="h-10 rounded-xl border-border/50 bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Errands</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Default Sort</Label>
              <Select value={userSettings.defaultSort} onValueChange={v => setUserSettings(p => ({ ...p, defaultSort: v }))}>
                <SelectTrigger className="h-10 rounded-xl border-border/50 bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">{SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)} className="rounded-xl border-border/50">Cancel</Button>
            <Button onClick={handleSaveSettings} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold">Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><TagIcon className="size-5 text-violet-500" /> Create Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</Label><Input placeholder="Tag name" value={tagName} onChange={e => setTagName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateTag(); }} autoFocus className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Color</Label><ColorPicker value={tagColor} onChange={setTagColor} /></div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setTagDialogOpen(false)} className="rounded-xl border-border/50">Cancel</Button>
            <Button onClick={handleCreateTag} disabled={!tagName.trim()} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 font-semibold">Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl border-border/30 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg"><FolderOpen className="size-5 text-violet-500" /> Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</Label><Input placeholder="Category name" value={catName} onChange={e => setCatName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCreateCategory(); }} autoFocus className="h-11 rounded-xl border-border/50 bg-background/50" /></div>
            <div className="space-y-2"><Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Color</Label><ColorPicker value={catColor} onChange={setCatColor} /></div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setCatDialogOpen(false)} className="rounded-xl border-border/50">Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={!catName.trim()} className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 font-semibold">Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}