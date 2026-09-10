"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { Report } from "@/features/report/types";
import { getTimelineStatusKey } from "@/features/tracking/utils";
import { formatDepartmentName } from "@/lib/utils";

interface MarkerPopupProps {
  report: Report;
}

export function MarkerPopup({ report }: MarkerPopupProps) {
  const { t, i18n } = useTranslation();
  const { category, description, status, location, createdAt, aiAnalysis } = report;
  const address = location?.address || "No address provided";

  const localeMap: Record<string, string> = {
    en: "en-US",
    hi: "hi-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    bn: "bn-IN",
    ta: "ta-IN",
    te: "te-IN",
    kn: "kn-IN",
  };
  const currentLocale = localeMap[i18n.language] || localeMap[i18n.language.slice(0, 2)] || "en-US";

  const reportedTime = createdAt
    ? new Intl.DateTimeFormat(currentLocale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(createdAt)
    : "—";

  const department = aiAnalysis?.department 
    ? formatDepartmentName(t("departments." + aiAnalysis.department) || aiAnalysis.department)
    : t("reportDetail.notAssigned");
  const aiSeverity = aiAnalysis?.severity 
    ? (t("severity." + aiAnalysis.severity) || aiAnalysis.severity)
    : t("tracking.status.Pending");
  const aiConfidence = aiAnalysis ? `${aiAnalysis.confidence}%` : t("tracking.status.Pending");
  const priorityScore = aiAnalysis ? aiAnalysis.priorityScore : t("tracking.status.Pending");

  // Color mappings for report status badge
  const statusColors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
    Verified: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
    Assigned: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300",
    "In Progress": "bg-sky-100 text-sky-800 dark:bg-sky-950/30 dark:text-sky-300",
    Resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  };

  const statusClass = statusColors[status] || "bg-slate-100 text-slate-800";

  return (
    <div className="p-1 min-w-[260px] text-sm text-foreground max-w-xs">
      {/* Category & Status */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2 mb-2">
        <span className="font-bold text-base text-slate-900 dark:text-slate-100">
          {t("categories." + category) || category}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusClass}`}>
          {t(`tracking.status.${getTimelineStatusKey(status)}`, { defaultValue: status })}
        </span>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs line-clamp-3 mb-3 italic">
        "{description}"
      </p>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs border-b border-border pb-3 mb-3">
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.department")}
          </span>
          <span className="font-medium text-foreground">{department}</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.priority")}
          </span>
          <span className="font-medium text-foreground">{priorityScore}</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.severity")}
          </span>
          <span className="font-medium text-foreground">{aiSeverity}</span>
        </div>
        <div>
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.confidence")}
          </span>
          <span className="font-medium text-foreground">{aiConfidence}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.address")}
          </span>
          <span className="font-medium text-foreground line-clamp-1">{address}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
            {t("liveMap.popup.time")}
          </span>
          <span className="font-medium text-foreground">{reportedTime}</span>
        </div>
      </div>

      {/* Action Button */}
      {report.id && (
        <Link
          href={`/report/${report.id}`}
          className="block w-full text-center px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          {t("liveMap.popup.button")}
        </Link>
      )}
    </div>
  );
}
