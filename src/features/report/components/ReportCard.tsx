"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ReportProgress, StatusBadge } from "@/features/tracking";
import { useReportTracking } from "@/features/tracking";
import type { Report } from "../types";
import { formatDepartmentName } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
}

function formatDate(date?: Date | null, lang: string = "en") {
  if (!date) return "—";
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
  const locale = localeMap[lang] || localeMap[lang.slice(0, 2)] || "en-US";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ReportCard({ report }: ReportCardProps) {
  const tracking = useReportTracking(report);
  const { t, i18n } = useTranslation();

  return (
    <Link
      href={report.id ? `/report/${report.id}` : "/reports"}
      className="block p-4 sm:p-5 w-full max-w-none min-w-0 overflow-hidden break-words focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between min-w-0 w-full">
        <div className="min-w-0 flex-1 break-words">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
            {t("categories." + report.category) || report.category}
          </p>
          <p className="mt-1.5 text-sm sm:text-base font-semibold text-foreground break-words">
            {report.description || "No description provided."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground break-words min-w-0">
            <span className="shrink-0">{t("reportDetail.lastUpdated")}: {formatDate(report.updatedAt, i18n.language)}</span>
            <span className="shrink-0 hidden xs:inline">•</span>
            <span className="break-words min-w-0">
              {report.aiAnalysis?.department
                ? formatDepartmentName(t("departments." + report.aiAnalysis.department) || report.aiAnalysis.department)
                : t("reportDetail.notAssigned")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="mt-4 w-full min-w-0 overflow-hidden">
        <ReportProgress status={report.status} />
      </div>
    </Link>
  );
}
