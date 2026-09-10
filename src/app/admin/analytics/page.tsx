"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { subscribeToAllReports } from "@/features/admin/services/admin.service";
import type { Report } from "@/features/report/types";
import { getTimelineStatusKey } from "@/features/tracking/utils";
import { formatDepartmentName } from "@/lib/utils";

// ─── Primitive bar chart ───────────────────────────────────────────────────
function BarChart({
  data,
  label,
  colorClass = "bg-primary",
}: {
  data: { label: string; value: number }[];
  label: string;
  colorClass?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {label}
      </p>
      {data.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground truncate max-w-[60%]">
              {d.label}
            </span>
            <span className="text-xs font-bold text-muted-foreground shrink-0">{d.value}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${colorClass}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({
  data,
  label,
}: {
  data: { label: string; value: number; color: string }[];
  label: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const radius = 54;
  const circ = 2 * Math.PI * radius;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {label}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <svg width="140" height="140" viewBox="0 0 120 120" className="shrink-0">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-muted)" strokeWidth="14" />
          {data.map((d, i) => {
            const dashArray = (d.value / total) * circ;
            const dashOffset = circ - cumulative;
            cumulative += dashArray;
            return (
              <circle
                key={i}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth="14"
                strokeDasharray={`${dashArray} ${circ}`}
                strokeDashoffset={dashOffset}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 0.7s ease" }}
              />
            );
          })}
          <text x="60" y="60" textAnchor="middle" dominantBaseline="central" className="text-base fill-foreground font-bold" fontSize="18">
            {total}
          </text>
        </svg>
        {/* Legend */}
        <div className="space-y-2 min-w-0">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="truncate text-foreground font-medium">{d.label}</span>
              <span className="text-muted-foreground ml-auto pl-2">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, colorClass = "text-foreground" }: {
  title: string;
  value: string;
  subtitle?: string;
  colorClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-1">
      <p className="text-sm font-semibold uppercase text-muted-foreground tracking-[0.3em] font-semibold">{title}</p>
      <p className={`text-3xl lg:text-4xl font-bold tracking-tight ${colorClass}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Verified: "#6366f1",
  Assigned: "#a855f7",
  "In Progress": "#f97316",
  Resolved: "#10b981",
};

const CATEGORY_COLORS = [
  "#3b82f6", "#f59e0b", "#10b981", "#f97316", "#6366f1", "#ec4899", "#14b8a6",
];

const DEPT_COLORS = [
  "#6366f1", "#3b82f6", "#14b8a6", "#f97316", "#f59e0b", "#ec4899", "#10b981",
];

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllReports(
      (data) => { setReports(data); setLoading(false); },
      (err) => { console.error(err); setLoading(false); }
    );
    return () => unsub();
  }, []);

  const analytics = useMemo(() => {
    const total = reports.length || 1;

    // Reports by Status
    const byStatus = ["Pending", "Verified", "Assigned", "In Progress", "Resolved"].map((s) => ({
      label: t("tracking.status." + getTimelineStatusKey(s), { defaultValue: s }),
      value: reports.filter((r) => r.status === s).length,
      color: STATUS_COLORS[s],
    }));

    // Reports by Category
    const categoryMap: Record<string, number> = {};
    reports.forEach((r) => {
      const k = r.category || "Other";
      categoryMap[k] = (categoryMap[k] || 0) + 1;
    });
    const byCategory = Object.entries(categoryMap)
      .map(([label, value], i) => ({
        label: t("categories." + label, { defaultValue: label }),
        value,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    // Reports by Department
    const deptMap: Record<string, number> = {};
    reports.forEach((r) => {
      const d = r.aiAnalysis?.department || "Awaiting Assignment";
      deptMap[d] = (deptMap[d] || 0) + 1;
    });
    const byDept = Object.entries(deptMap)
      .map(([label, value], i) => ({
        label: formatDepartmentName(t("departments." + label, { defaultValue: label })),
        value,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    // Monthly Reports (last 6 months)
    const now = new Date();
    const monthly = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const nextD = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = reports.filter((r) => {
        const c = r.createdAt ? new Date(r.createdAt) : null;
        return c && c >= d && c < nextD;
      }).length;
      return {
        label: d.toLocaleDateString("en-US", { month: "short" }),
        value: count,
      };
    });

    // KPI Stats
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const highPriority = reports.filter((r) => (r.aiAnalysis?.priorityScore ?? 0) >= 80).length;
    const resolutionRate = Math.round((resolved / total) * 100);
    const highPriPct = Math.round((highPriority / total) * 100);

    return { byStatus, byCategory, byDept, monthly, resolutionRate, highPriPct, resolved, highPriority };
  }, [reports, t]);

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-56 rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={reports.length.toString()}
          subtitle="All submissions"
        />
        <StatCard
          title="Resolved"
          value={analytics.resolved.toString()}
          subtitle="Issues closed"
          colorClass="text-emerald-600"
        />
        <StatCard
          title="Resolution Rate"
          value={`${analytics.resolutionRate}%`}
          subtitle="Of all reports"
          colorClass={analytics.resolutionRate >= 50 ? "text-emerald-600" : "text-amber-600"}
        />
        <StatCard
          title="High Priority"
          value={`${analytics.highPriPct}%`}
          subtitle={`${analytics.highPriority} reports (score ≥80)`}
          colorClass="text-rose-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Status Donut */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <DonutChart data={analytics.byStatus} label="Reports by Status" />
        </div>

        {/* Category Bar */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <BarChart
            data={analytics.byCategory}
            label="Reports by Category"
            colorClass="bg-blue-500"
          />
        </div>

        {/* Department Bar */}
        <div className="p-6 lg:col-span-2 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <BarChart
            data={analytics.byDept}
            label="Reports by Department"
            colorClass="bg-violet-500"
          />
        </div>

        {/* Monthly Trend */}
        <div className="p-6 lg:col-span-2 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Monthly Submissions (Last 6 Months)
          </p>
          <div className="flex items-end gap-3 h-32">
            {analytics.monthly.map((m, i) => {
              const max = Math.max(...analytics.monthly.map((x) => x.value), 1);
              const pct = Math.round((m.value / max) * 100);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-foreground">{m.value}</span>
                  <div className="w-full flex flex-col justify-end rounded-t-xl bg-muted overflow-hidden h-20">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-xl transition-all duration-700"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
