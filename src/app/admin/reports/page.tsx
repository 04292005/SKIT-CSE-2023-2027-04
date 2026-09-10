"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
} from "lucide-react";

import { subscribeToAllReports } from "@/features/admin/services/admin.service";
import { StatusBadge } from "@/features/tracking";
import type { Report } from "@/features/report/types";
import { getTimelineStatusKey } from "@/features/tracking/utils";
import { cn, formatDepartmentName } from "@/lib/utils";

const DEPARTMENTS = [
  "All",
  "Public Works Department",
  "Municipal Corporation",
  "Water Department",
  "Traffic Police",
  "Electricity Department",
  "Public Safety",
  "Environment Department",
  "Awaiting Assignment",
] as const;

const STATUSES = ["All", "Pending", "Verified", "Assigned", "In Progress", "Resolved"] as const;
const CATEGORIES = ["All", "Roads", "Garbage", "Water", "Traffic", "Street Lights", "Safety", "Other"] as const;
const PAGE_SIZE = 10;

function exportCSV(reports: Report[]) {
  const headers = [
    "ID", "Category", "Description", "Status", "Department",
    "Priority Score", "AI Confidence", "Citizen", "Created At"
  ];
  const rows = reports.map((r) => [
    r.id || "",
    r.category,
    `"${(r.description || "").replace(/"/g, '""')}"`,
    r.status,
    r.aiAnalysis?.department || "Awaiting Assignment",
    r.aiAnalysis?.priorityScore ?? "",
    r.aiAnalysis?.confidence ? `${r.aiAnalysis.confidence}%` : "",
    (r as any).displayName || (r as any).email || "",
    r.createdAt ? new Date(r.createdAt).toISOString() : "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `community-hero-reports-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(reports: Report[]) {
  const rows = reports.map((r) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px 10px; font-size: 12px;">${r.category}</td>
      <td style="padding: 8px 10px; font-size: 12px; max-width: 200px;">${(r.description || "").slice(0, 80)}${r.description && r.description.length > 80 ? "..." : ""}</td>
      <td style="padding: 8px 10px; font-size: 12px;">${r.status}</td>
      <td style="padding: 8px 10px; font-size: 12px;">${r.aiAnalysis?.department || "—"}</td>
      <td style="padding: 8px 10px; font-size: 12px; text-align: center;">${r.aiAnalysis?.priorityScore ?? "—"}</td>
      <td style="padding: 8px 10px; font-size: 12px;">${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}</td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html><html><head>
    <title>Community Hero Reports</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;} table{width:100%;border-collapse:collapse;} th{background:#1e293b;color:white;padding:10px;text-align:left;font-size:12px;} td{vertical-align:top;}</style>
    </head><body>
    <h1 style="font-size:20px;margin-bottom:4px;">Community Hero — Reports Export</h1>
    <p style="font-size:12px;color:#64748b;margin-bottom:16px;">Exported on ${new Date().toLocaleString()} &nbsp;·&nbsp; Total: ${reports.length} reports</p>
    <table>
      <thead><tr><th>Category</th><th>Description</th><th>Status</th><th>Department</th><th>Priority</th><th>Created</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </body></html>
  `;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.print(); }, 600);
}

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsub = subscribeToAllReports(
      (data) => { setReports(data); setLoading(false); },
      (err) => { console.error(err); setLoading(false); }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let result = [...reports];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.description?.toLowerCase().includes(q) ||
          (r as any).displayName?.toLowerCase().includes(q) ||
          (r as any).email?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (categoryFilter !== "All") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    if (departmentFilter !== "All") {
      if (departmentFilter === "Awaiting Assignment") {
        result = result.filter((r) => !r.aiAnalysis?.department || r.aiAnalysis?.department === "Awaiting Assignment");
      } else {
        result = result.filter((r) => r.aiAnalysis?.department === departmentFilter);
      }
    }

    if (priorityFilter === "High") {
      result = result.filter((r) => (r.aiAnalysis?.priorityScore ?? 0) >= 80);
    } else if (priorityFilter === "Medium") {
      result = result.filter((r) => {
        const p = r.aiAnalysis?.priorityScore ?? 0;
        return p >= 50 && p < 80;
      });
    } else if (priorityFilter === "Low") {
      result = result.filter((r) => (r.aiAnalysis?.priorityScore ?? 0) < 50);
    }

    result.sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? bt - at : at - bt;
    });

    return result;
  }, [reports, search, statusFilter, categoryFilter, departmentFilter, priorityFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const selectCls =
    "rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            placeholder={t("admin.reports.search", { defaultValue: "Search reports…" })}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCSV(filtered)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
          <button
            onClick={() => exportPDF(filtered)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}
          className={selectCls}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "All" ? t("admin.reports.allStatuses", { defaultValue: "All Statuses" }) : t("tracking.status." + getTimelineStatusKey(s), { defaultValue: s })}</option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); resetPage(); }}
          className={selectCls}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? t("admin.reports.allCategories", { defaultValue: "All Categories" }) : t("categories." + c, { defaultValue: c })}</option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => { setDepartmentFilter(e.target.value); resetPage(); }}
          className={selectCls}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d === "All" ? t("admin.reports.allDepartments", { defaultValue: "All Departments" }) : formatDepartmentName(t("departments." + d, { defaultValue: d }))}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); resetPage(); }}
          className={selectCls}
        >
          <option value="All">{t("admin.reports.allPriorities", { defaultValue: "All Priorities" })}</option>
          <option value="High">High (≥80)</option>
          <option value="Medium">Medium (50-79)</option>
          <option value="Low">Low (&lt;50)</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value as "newest" | "oldest"); resetPage(); }}
          className={selectCls}
        >
          <option value="newest">{t("admin.reports.newest", { defaultValue: "Newest First" })}</option>
          <option value="oldest">{t("admin.reports.oldest", { defaultValue: "Oldest First" })}</option>
        </select>
      </div>

      {/* Count indicator */}
      <p className="text-xs text-muted-foreground">
        {t("admin.reports.showing", { defaultValue: "Showing" })} {paged.length}{" "}
        {t("admin.reports.of", { defaultValue: "of" })} {filtered.length}{" "}
        {t("admin.reports.results", { defaultValue: "results" })}
      </p>

      {/* Table – Desktop */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse h-14 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : paged.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 lg:py-24 rounded-3xl border border-dashed border-border bg-muted/20 text-center">
          <p className="text-lg font-semibold text-foreground">
            {t("admin.reports.empty", { defaultValue: "No reports found" })}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("admin.reports.emptyHint", { defaultValue: "Try adjusting your filters or search terms." })}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-3xl border border-border overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/60 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 max-w-xs">Description</th>
                  <th className="px-4 py-3">Citizen</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Priority</th>
                  <th className="px-4 py-3 text-center">AI Conf.</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-card">
                {paged.map((report) => {
                  const priority = report.aiAnalysis?.priorityScore;
                  const priorColor =
                    priority !== undefined
                      ? priority >= 80
                        ? "text-rose-600 font-bold"
                        : priority >= 50
                        ? "text-amber-600 font-semibold"
                        : "text-emerald-600"
                      : "text-muted-foreground";

                  return (
                    <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold">
                        {t("categories." + report.category, { defaultValue: report.category })}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-xs text-foreground">
                          {report.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {(report as any).displayName || (report as any).email || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {report.aiAnalysis?.department
                          ? formatDepartmentName(t("departments." + report.aiAnalysis.department, { defaultValue: report.aiAnalysis.department }))
                          : "—"}
                      </td>
                      <td className={cn("px-4 py-3 text-center text-xs", priorColor)}>
                        {priority ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {report.aiAnalysis?.confidence
                          ? `${Math.round(report.aiAnalysis.confidence)}%`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/reports/${report.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paged.map((report) => (
              <div
                key={report.id}
                className="p-4 space-y-3 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      {t("categories." + report.category, { defaultValue: report.category })}
                    </p>
                    <p className="mt-1 text-sm font-semibold line-clamp-2">{report.description}</p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    Dept:{" "}
                    {report.aiAnalysis?.department
                      ? formatDepartmentName(t("departments." + report.aiAnalysis.department, { defaultValue: report.aiAnalysis.department }))
                      : "—"}
                  </span>
                  {report.aiAnalysis?.priorityScore !== undefined && (
                    <span>Priority: {report.aiAnalysis.priorityScore}</span>
                  )}
                  <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                <Link
                  href={`/admin/reports/${report.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={cn(
                    "rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                    pg === page
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted"
                  )}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
