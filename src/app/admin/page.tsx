"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Clock,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  UserCheck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { subscribeToAllReports } from "@/features/admin/services/admin.service";
import type { Report } from "@/features/report/types";
import { StatusBadge } from "@/features/tracking";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllReports(
      (data) => {
        setReports(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => r.status === "Pending").length;
    const verified = reports.filter((r) => r.status === "Verified").length;
    const assigned = reports.filter((r) => r.status === "Assigned").length;
    const inProgress = reports.filter((r) => r.status === "In Progress").length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;

    const highPriority = reports.filter(
      (r) => (r.aiAnalysis?.priorityScore ?? 0) >= 80
    ).length;

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const today = reports.filter((r) => {
      if (!r.createdAt) return false;
      return now - new Date(r.createdAt).getTime() <= oneDayMs;
    }).length;

    return {
      total,
      pending,
      verified,
      assigned,
      inProgress,
      resolved,
      highPriority,
      today,
    };
  }, [reports]);

  const cards = [
    {
      title: t("admin.dashboard.total", { defaultValue: "Total Reports" }),
      value: stats.total,
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: t("admin.dashboard.pending", { defaultValue: "Pending" }),
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: t("admin.dashboard.verified", { defaultValue: "Verified" }),
      value: stats.verified,
      icon: CheckCircle2,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: t("admin.dashboard.assigned", { defaultValue: "Assigned" }),
      value: stats.assigned,
      icon: UserCheck,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: t("admin.dashboard.inProgress", { defaultValue: "In Progress" }),
      value: stats.inProgress,
      icon: Wrench,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    },
    {
      title: t("admin.dashboard.resolved", { defaultValue: "Resolved" }),
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: t("admin.dashboard.highPriority", { defaultValue: "High Priority" }),
      value: stats.highPriority,
      icon: AlertTriangle,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: t("admin.dashboard.today", { defaultValue: "Today's Reports" }),
      value: stats.today,
      icon: Calendar,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-4 h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-6 ${card.color} rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  {card.title}
                </span>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Reports List */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {t("admin.dashboard.recentTitle", { defaultValue: "Recent Activity" })}
            </h2>
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              {t("admin.dashboard.viewAll", { defaultValue: "View All Reports" })}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No reports available.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {recentReports.map((report) => (
                <div key={report.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/reports/${report.id}`}
                        className="font-semibold text-sm hover:text-primary line-clamp-1"
                      >
                        {report.description}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("categories." + report.category) || report.category} •{" "}
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info / Quick Links Panel */}
        <div className="p-6 space-y-6 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <h2 className="text-lg font-bold text-foreground">
            {t("admin.dashboard.quickActions", { defaultValue: "Quick Links" })}
          </h2>

          <div className="grid gap-3 grid-cols-1">
            <Link
              href="/admin/reports"
              className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-muted/10"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm">
                  {t("admin.dashboard.manageReports", { defaultValue: "Manage Reports" })}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Verify or assign reports.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/users"
              className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-muted/10"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm">
                  {t("admin.dashboard.manageUsers", { defaultValue: "Manage Users" })}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  View and manage permissions.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/analytics"
              className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/40 hover:bg-muted/10"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm">
                  {t("admin.dashboard.viewAnalytics", { defaultValue: "View Analytics" })}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Monitor civic health metrics.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
