"use client";

import { use, useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, MapPin, Sparkles, Play, Square, Pause } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { SectionTitle, ErrorCard } from "@/components/common";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { StatusBadge, ReportProgress, Timeline, useLiveReport } from "@/features/tracking";
import { getTimelineStatusKey } from "@/features/tracking/utils";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Button } from "@/components/ui/button";
import { formatDepartmentName } from "@/lib/utils";

function formatDate(date?: Date | null, lang: string = "en") {
  if (!date) return "—";
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function SpeechControls({ textToRead }: { textToRead: string }) {
  const { t, i18n } = useTranslation();
  const { speak, stop, pause, resume, isPlaying, isPaused, isSupported } = useSpeechSynthesis(i18n.language);

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {isPlaying && !isPaused ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          onClick={pause}
          aria-label="Pause narration"
        >
          <Pause className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
        </Button>
      ) : isPaused ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          onClick={resume}
          aria-label="Resume narration"
        >
          <Play className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          onClick={() => speak(textToRead)}
          aria-label={t("reportDetail.speech.read")}
        >
          <Play className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
        </Button>
      )}
      
      {(isPlaying || isPaused) && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          onClick={stop}
          aria-label={t("reportDetail.speech.stop")}
        >
          <Square className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

function ReportDetailSkeleton() {
  return (
    <div className="mt-6 space-y-6 animate-pulse w-full min-w-0">
      {/* Main Section Skeleton */}
      <section className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-8 w-2/3 rounded bg-muted" />
          </div>
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/5 p-4 space-y-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
          <div className="rounded-2xl bg-slate-950/5 p-4 space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReportNotFound() {
  const { t } = useTranslation();
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-border bg-background p-6 sm:p-12 text-center shadow-sm max-w-2xl mx-auto w-full min-w-0 break-words">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
        <AlertCircle className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{t("reportDetail.notFound.title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {t("reportDetail.notFound.description")}
      </p>
      <div className="mt-6">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          {t("reportDetail.notFound.back")}
        </Link>
      </div>
    </div>
  );
}

function ReportDetailContent({ reportId }: { reportId: string }) {
  const { report, loading, error } = useLiveReport(reportId);
  const { t, i18n } = useTranslation();
  const [translatedSummary, setTranslatedSummary] = useState<string>("");
  const [translating, setTranslating] = useState<boolean>(false);

  useEffect(() => {
    const summaryText = report?.aiAnalysis?.summary;
    if (!summaryText) {
      setTranslatedSummary("");
      return;
    }

    const currentLang = i18n.language.slice(0, 2);
    if (currentLang === "en") {
      setTranslatedSummary(summaryText);
      return;
    }

    let isMounted = true;
    const fetchTranslation = async () => {
      setTranslating(true);
      try {
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: summaryText,
            targetLang: currentLang,
          }),
        });
        if (!res.ok) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[Translation] API returned non-OK status:", res.status);
          }
          if (isMounted) {
            setTranslatedSummary(summaryText);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setTranslatedSummary(data.translatedText || summaryText);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Translation] Request failed, falling back to original summary:", err);
        }
        if (isMounted) {
          setTranslatedSummary(summaryText);
        }
      } finally {
        if (isMounted) {
          setTranslating(false);
        }
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [report?.aiAnalysis?.summary, i18n.language]);

  if (loading) {
    return <ReportDetailSkeleton />;
  }

  if (error && error !== "Report not found") {
    return (
      <div className="mt-6 w-full">
        <ErrorCard title="Error Loading Report" message={error} />
      </div>
    );
  }

  if (!report || error === "Report not found") {
    return <ReportNotFound />;
  }

  // Speakable text calculations
  const catText = t("categories." + report.category) || report.category;
  const statusText = t("tracking.status." + getTimelineStatusKey(report.status), { defaultValue: report.status });
  const detailsText = `${t("reportDetail.title")}. ${t("reportForm.categoryLabel")}: ${catText}. ${t("reportForm.descLabel")}: ${report.description}. ${t("reportForm.locationStatus")}: ${statusText}`;
  
  const timelineText = `${t("tracking.timeline.title")}. ` + (report.statusHistory || [])
    .map((item) => {
      const translatedStatus = t("tracking.status." + getTimelineStatusKey(item.status), { defaultValue: item.status });
      const translatedDesc = t("tracking.status." + getTimelineStatusKey(item.description ?? item.status), { defaultValue: item.description ?? item.status });
      return `${translatedStatus}: ${translatedDesc}`;
    })
    .join(". ");

  const aiDeptText = report.aiAnalysis ? formatDepartmentName(t("departments." + report.aiAnalysis.department) || report.aiAnalysis.department) : "";
  const aiSevText = report.aiAnalysis ? (t("severity." + report.aiAnalysis.severity) || report.aiAnalysis.severity) : "";
  const aiSumText = report.aiAnalysis ? (translating ? t("reportDetail.aiAnalysis.translating") : (translatedSummary || report.aiAnalysis.summary)) : "";
  
  const aiText = report.aiAnalysis
    ? `${t("reportDetail.aiAnalysis.title")}. ${t("reportDetail.aiAnalysis.department")}: ${aiDeptText}. ${t("reportDetail.aiAnalysis.severity")}: ${aiSevText}. ${t("reportDetail.aiAnalysis.summary")}: ${aiSumText}`
    : `${t("reportDetail.aiAnalysis.empty")}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full min-w-0 overflow-hidden break-words">
      <section className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm min-w-0 w-full overflow-hidden break-words">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0 w-full">
          <div className="min-w-0 flex-1 break-words">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("categories." + report.category) || report.category}</p>
            <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-foreground break-words leading-tight">{report.description}</h1>
          </div>

          <div className="flex justify-start sm:justify-end shrink-0 self-start sm:self-auto gap-3 items-center">
            <SpeechControls textToRead={detailsText} />
            <StatusBadge status={report.status} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 p-4 text-xs sm:text-sm text-muted-foreground min-w-0 break-words">
            <p className="font-semibold text-foreground text-sm sm:text-base">{t("reportDetail.created")}</p>
            <p className="mt-2">{formatDate(report.createdAt, i18n.language)}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 p-4 text-xs sm:text-sm text-muted-foreground min-w-0 break-words">
            <p className="font-semibold text-foreground text-sm sm:text-base">{t("reportDetail.lastUpdated")}</p>
            <p className="mt-2">{formatDate(report.updatedAt, i18n.language)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 p-4 text-xs sm:text-sm text-muted-foreground min-w-0 break-words">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground text-sm sm:text-base">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {t("reportDetail.location")}
            </div>
            <p className="break-words">{report.location?.address ?? t("reportDetail.noLocation")}</p>
          </div>
          <div className="rounded-2xl bg-slate-950/5 dark:bg-white/5 p-4 text-xs sm:text-sm text-muted-foreground min-w-0 break-words">
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground text-sm sm:text-base">
              <Sparkles className="size-4 shrink-0" aria-hidden="true" />
              {t("reportDetail.assignedDept")}
            </div>
            <p className="break-words">
              {report.aiAnalysis?.department
                ? formatDepartmentName(t("departments." + report.aiAnalysis.department) || report.aiAnalysis.department)
                : t("reportDetail.notAssigned")}
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm overflow-hidden min-w-0 w-full">
        <ReportProgress status={report.status} />
      </section>

      {/* Timeline with speech control */}
      <section className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm overflow-hidden min-w-0 w-full">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">{t("tracking.timeline.title")}</h2>
          <SpeechControls textToRead={timelineText} />
        </div>
        <Timeline
          timeline={
            report.statusHistory
              ? report.statusHistory.map((item) => ({
                  status: item.status,
                  description: item.description ?? item.status,
                  timestamp: item.timestamp ? formatDate(item.timestamp, i18n.language) : "",
                  state: (item.status === report.status ? "current" : "complete") as "current" | "complete" | "pending",
                }))
              : [
                  {
                    status: report.status,
                    description: "Issue submitted",
                    timestamp: formatDate(report.createdAt, i18n.language),
                    state: "current" as const,
                  },
                ]
          }
        />
      </section>

      {/* AI Analysis with speech control */}
      <section className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm min-w-0 w-full overflow-hidden break-words">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">{t("reportDetail.aiAnalysis.title")}</h2>
          <SpeechControls textToRead={aiText} />
        </div>
        {report.aiAnalysis ? (
          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground break-words min-w-0">
            <div>
              <p className="font-medium text-foreground text-sm">{t("reportDetail.aiAnalysis.department")}</p>
              <p className="mt-1 break-words">{formatDepartmentName(t("departments." + report.aiAnalysis.department) || report.aiAnalysis.department)}</p>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{t("reportDetail.aiAnalysis.severity")}</p>
              <p className="mt-1 break-words">{t("severity." + report.aiAnalysis.severity) || report.aiAnalysis.severity}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium text-foreground text-sm">{t("reportDetail.aiAnalysis.summary")}</p>
              <p className="mt-1 text-muted-foreground break-words leading-relaxed">
                {translating ? (
                  <span className="italic text-muted-foreground/60">{t("reportDetail.aiAnalysis.translating")}</span>
                ) : (
                  translatedSummary || report.aiAnalysis.summary
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs sm:text-sm text-muted-foreground">{t("reportDetail.aiAnalysis.empty")}</p>
        )}
      </section>
    </div>
  );
}

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading: authLoading } = useAuth();
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0 overflow-x-hidden">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4 animate-in fade-in shrink-0" aria-hidden="true" />
          {t("common.back")}
        </Link>
      </div>

      <SectionTitle
        title={t("reportDetail.title")}
        subtitle={t("reportDetail.subtitle")}
        description={t("reportDetail.description")}
      />

      {authLoading ? (
        <ReportDetailSkeleton />
      ) : (
        <ReportDetailContent reportId={id} />
      )}
    </main>
  );
}
