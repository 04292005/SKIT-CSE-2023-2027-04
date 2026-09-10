"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock3,
  FileText,
  Sparkles,
  Sliders,
  Target,
  UserCheck,
  Wrench,
} from "lucide-react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { SectionTitle, ErrorCard } from "@/components/common";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { subscribeToUserReports } from "@/features/report/services/report.service";
import { ReportCard } from "@/features/report/components/ReportCard";
import type { Report } from "@/features/report/types";
import { cn } from "@/lib/utils";
import { Flame, Award, Medal, Trophy, ShieldAlert, Lock } from "lucide-react";
import { useGamification } from "@/features/gamification/context/GamificationContext";
import { getLevelProgress } from "@/features/gamification/services/gamification.service";
import { BADGES } from "@/features/gamification/constants";
import { Leaderboard } from "@/features/gamification/components/Leaderboard";
import { db } from "@/firebase";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/common";

function formatDate(date?: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { profile, loading: gamificationLoading } = useGamification();
  const [rank, setRank] = useState<number | null>(null);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!profile) return;

    async function fetchRank(points: number) {
      try {
        const rankQuery = query(
          collection(db, "users"),
          where("heroPoints", ">", points)
        );
        const snapshot = await getCountFromServer(rankQuery);
        setRank(snapshot.data().count + 1);
      } catch (err) {
        console.error("Error fetching rank:", err);
      }
    }

    fetchRank(profile.heroPoints);
  }, [profile?.heroPoints]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserReports(
      user.uid,
      (data) => {
        setReports(data);
        setLoading(false);
      },
      (err: any) => {
        console.error("Dashboard reports subscription error:", err);
        setReports([]);
        setError(
          err?.message === "User must be logged in."
            ? "Please log in to view your reports."
            : "Unable to load your reports. Please try again later."
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((report) => report.status === "Pending").length;
    const assigned = reports.filter((report) => report.status === "Assigned").length;
    const inProgress = reports.filter((report) => report.status === "In Progress").length;
    const resolved = reports.filter((report) => report.status === "Resolved").length;

    return { total, pending, assigned, inProgress, resolved };
  }, [reports]);

  const performanceStats = useMemo(() => {
    const reportsWithAi = reports.filter((report) => report.aiAnalysis);

    const verifiedByAi = reportsWithAi.length;

    const highPriority = reportsWithAi.filter(
      (report) => (report.aiAnalysis?.priorityScore ?? 0) >= 80
    ).length;

    const totalPriorityScore = reportsWithAi.reduce(
      (acc, report) => acc + (report.aiAnalysis?.priorityScore ?? 0),
      0
    );
    const avgPriorityScore = reportsWithAi.length > 0
      ? Math.round(totalPriorityScore / reportsWithAi.length)
      : 0;

    const totalConfidence = reportsWithAi.reduce(
      (acc, report) => acc + (report.aiAnalysis?.confidence ?? 0),
      0
    );
    const avgConfidence = reportsWithAi.length > 0
      ? Math.round(totalConfidence / reportsWithAi.length)
      : 0;

    return {
      verifiedByAi,
      highPriority,
      avgPriorityScore,
      avgConfidence,
    };
  }, [reports]);

  const isPageLoading = authLoading || loading || gamificationLoading;

  return (
    <AuthGuard>
      <motion.main
        className="mx-auto w-full max-w-5xl min-w-0 overflow-x-hidden bg-gradient-to-b from-white via-indigo-50/20 to-emerald-50/20 px-4 py-8 sm:px-6 lg:px-8"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      >
        <SectionTitle
          title={t("dashboard.title")}
          subtitle={t("dashboard.subtitle")}
          description={t("dashboard.description")}
        />

        {/* Gamification Summary Cards */}
        {profile && (
          <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Hero Level & Points */}
            <div className="group rounded-3xl border border-border bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/40 min-w-0 w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 truncate">
                    {t(`badges.${profile.heroLevel.toLowerCase().replace(" ", "_")}.name`, { defaultValue: profile.heroLevel })}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{profile.heroPoints} {t("dashboard.gamification.pts")}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                  <Trophy className="size-5" />
                </div>
              </div>
              
              {/* Level Progress */}
              {(() => {
                const prog = getLevelProgress(profile.heroPoints);
                return (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>{t("dashboard.gamification.levelProgress")}</span>
                      <span>{prog.progressPercent}%</span>
                    </div>
                    <div className="rounded-full bg-slate-200 dark:bg-slate-800 h-1.5 overflow-hidden w-full">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${prog.progressPercent}%` }}
                      />
                    </div>
                    {prog.nextLevel && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {t("dashboard.gamification.pointsRequired", { points: prog.pointsRequired, level: t(`badges.${prog.nextLevel.toLowerCase().replace(" ", "_")}.name`, { defaultValue: prog.nextLevel }) })}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Streak */}
            <div className="group rounded-3xl border border-border bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/40 min-w-0 w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.gamification.dailyStreak")}</p>
                  <p className="mt-1 text-2xl font-bold">{t("dashboard.gamification.streakDays", { days: profile.streak })}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0">
                  <Flame className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.gamification.streakTip")}
              </p>
            </div>

            {/* Badges Earned */}
            <div className="group rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40 min-w-0 w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.gamification.badgesEarned")}</p>
                  <p className="mt-1 text-2xl font-bold">
                    {profile.badges.length} {profile.badges.length === 1 ? t("dashboard.gamification.badge") : t("dashboard.gamification.badges")}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 shrink-0">
                  <Award className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.gamification.badgesTip")}
              </p>
            </div>

            {/* Leaderboard Position */}
            <div className="group rounded-3xl border border-border bg-gradient-to-br from-purple-500/10 via-transparent to-transparent p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/40 min-w-0 w-full overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("dashboard.gamification.cityRank")}</p>
                  <p className="mt-1 text-2xl font-bold">#{rank ?? "—"}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 shrink-0">
                  <Medal className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.gamification.rankTip")}
              </p>
            </div>
          </div>
        )}        {/* Status Summary Cards */}
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Reports */}
          <div className="group rounded-3xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-500/40 min-w-0 w-full overflow-hidden break-words">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.stats.totalReports")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/40">
                <Sparkles className="size-4" />
              </div>
            </div>
            <div className="mt-3 h-9 flex items-center">
              {isPageLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
              ) : (
                <p className="text-3xl lg:text-4xl font-semibold"><AnimatedNumber value={stats.total} /></p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              {t("dashboard.stats.totalReports")}
            </p>
          </div>

          {/* Pending */}
          <div className="group rounded-3xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/40 min-w-0 w-full overflow-hidden break-words">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.stats.pending")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 transition-colors group-hover:bg-amber-100 dark:group-hover:bg-amber-950/40">
                <Clock3 className="size-4" />
              </div>
            </div>
            <div className="mt-3 h-9 flex items-center">
              {isPageLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
              ) : (
                <p className="text-3xl lg:text-4xl font-semibold"><AnimatedNumber value={stats.pending} /></p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              {t("dashboard.stats.pending")}
            </p>
          </div>

          {/* Assigned */}
          <div className="group rounded-3xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/40 min-w-0 w-full overflow-hidden break-words">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.stats.assigned")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-950/40">
                <UserCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3 h-9 flex items-center">
              {isPageLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
              ) : (
                <p className="text-3xl lg:text-4xl font-semibold"><AnimatedNumber value={stats.assigned} /></p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              {t("dashboard.stats.assigned")}
            </p>
          </div>

          {/* In Progress */}
          <div className="group rounded-3xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-500/40 min-w-0 w-full overflow-hidden break-words">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.stats.inProgress")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-950/40">
                <Wrench className="size-4" />
              </div>
            </div>
            <div className="mt-3 h-9 flex items-center">
              {isPageLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
              ) : (
                <p className="text-3xl lg:text-4xl font-semibold"><AnimatedNumber value={stats.inProgress} /></p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              {t("dashboard.stats.inProgress")}
            </p>
          </div>

          {/* Resolved */}
          <div className="group rounded-3xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40 min-w-0 w-full overflow-hidden break-words">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{t("dashboard.stats.resolved")}</p>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/40">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3 h-9 flex items-center">
              {isPageLoading ? (
                <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
              ) : (
                <p className="text-3xl lg:text-4xl font-semibold"><AnimatedNumber value={stats.resolved} /></p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              {t("dashboard.stats.resolved")}
            </p>
          </div>
        </div>

        {/* Performance Section */}
        <section aria-labelledby="performance-section-title" className="mt-10 rounded-3xl border border-border bg-background p-5 sm:p-6 min-w-0 w-full overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 id="performance-section-title" className="text-xl font-semibold">{t("dashboard.performance.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.performance.description")}
              </p>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Verified by AI */}
            <div className="group rounded-2xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/40 min-w-0 w-full overflow-hidden break-words">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{t("dashboard.performance.verifiedByAi")}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-950/40">
                  <Brain className="size-4" />
                </div>
              </div>
              <div className="mt-3 h-9 flex items-center">
                {isPageLoading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
                ) : (
                  <p className="text-3xl lg:text-4xl font-semibold">{performanceStats.verifiedByAi}</p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.performance.verifiedTip")}
              </p>
            </div>

            {/* High Priority */}
            <div className="group rounded-2xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-500/40 min-w-0 w-full overflow-hidden break-words">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{t("dashboard.performance.highPriority")}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 transition-colors group-hover:bg-rose-100 dark:group-hover:bg-rose-950/40">
                  <AlertTriangle className="size-4" />
                </div>
              </div>
              <div className="mt-3 h-9 flex items-center">
                {isPageLoading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
                ) : (
                  <p className="text-3xl lg:text-4xl font-semibold">{performanceStats.highPriority}</p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.performance.highPriorityTip")}
              </p>
            </div>

            {/* Average Priority Score */}
            <div className="group rounded-2xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/40 min-w-0 w-full overflow-hidden break-words">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{t("dashboard.performance.averagePriority")}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 transition-colors group-hover:bg-amber-100 dark:group-hover:bg-amber-950/40">
                  <Sliders className="size-4" />
                </div>
              </div>
              <div className="mt-3 h-9 flex items-center">
                {isPageLoading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
                ) : (
                  <p className="text-3xl lg:text-4xl font-semibold">{performanceStats.avgPriorityScore}</p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.performance.averagePriorityTip")}
              </p>
            </div>

            {/* Average AI Confidence */}
            <div className="group rounded-2xl border border-border bg-background p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-teal-500/40 min-w-0 w-full overflow-hidden break-words">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{t("dashboard.performance.averageConfidence")}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-500 transition-colors group-hover:bg-teal-100 dark:group-hover:bg-teal-950/40">
                  <Target className="size-4" />
                </div>
              </div>
              <div className="mt-3 h-9 flex items-center">
                {isPageLoading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-slate-900/10 dark:bg-slate-100/10" />
                ) : (
                  <p className="text-3xl lg:text-4xl font-semibold">{performanceStats.avgConfidence}%</p>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground/80">
                {t("dashboard.performance.averageConfidenceTip")}
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="recent-reports-title" className="mt-10 rounded-3xl border border-border bg-background p-4 sm:p-6 min-w-0 w-full overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="recent-reports-title" className="text-xl font-semibold">{t("dashboard.recentReports.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.recentReports.subtitle")}
              </p>
            </div>
          </div>

          {isPageLoading ? (
            <p className="mt-6 text-sm text-muted-foreground animate-pulse">{t("dashboard.recentReports.loading")}</p>
          ) : error ? (
            <div className="mt-6">
              <ErrorCard message={error} />
            </div>
          ) : reports.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              {t("dashboard.recentReports.empty")}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {reports.slice(0, 5).map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </section>

        {/* Gamification Details Section */}
        {profile && (
          <div className="mt-10 grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Badges Gallery */}
            <section aria-labelledby="badges-gallery-title" className="lg:col-span-2 rounded-3xl border border-border bg-background p-5 sm:p-6 min-w-0 w-full overflow-hidden">
              <div className="mb-6">
                <h2 id="badges-gallery-title" className="text-xl font-semibold">{t("dashboard.gamification.badgesTitle")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.gamification.badgesSubtitle")}
                </p>
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {BADGES.map((badge) => {
                  const isUnlocked = profile.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-4 transition-all duration-300",
                        isUnlocked
                          ? "border-emerald-500/30 bg-emerald-500/5 shadow-xs"
                          : "border-border bg-background opacity-60 grayscale"
                      )}
                    >
                      <div className="text-3xl lg:text-4xl shrink-0" aria-hidden="true">{badge.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="font-semibold text-xs text-foreground truncate">
                            {t(`badges.${badge.id}.name`)}
                          </span>
                          {!isUnlocked && <Lock className="h-3 w-3 text-muted-foreground shrink-0" aria-label="Locked" />}
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground leading-normal line-clamp-2">
                          {t(`badges.${badge.id}.description`)}
                        </p>
                        {isUnlocked && (
                          <span className="mt-2 inline-flex items-center text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                            +{badge.pointsAwarded} {t("dashboard.gamification.pts")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Leaderboard Widget */}
            <aside className="lg:col-span-1" aria-label="Leaderboard ranking">
              <Leaderboard />
            </aside>
          </div>
        )}
      </motion.main>
    </AuthGuard>
  );
}
