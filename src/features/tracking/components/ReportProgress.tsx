"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { TRACKING_STATUSES } from "../types";
import { getReportProgress } from "../services/tracking.service";
import type { TrackingStatus } from "../types";
import { getTimelineStatusKey } from "../utils";

interface ReportProgressProps {
  status: TrackingStatus;
}

export function ReportProgress({ status }: ReportProgressProps) {
  const progressPercentage = getReportProgress(status);
  const currentIndex = TRACKING_STATUSES.indexOf(status);
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{t("tracking.progress.title")}</p>
          <p className="text-xs text-muted-foreground">
            {t("tracking.progress.description")}
          </p>
        </div>
        <div className="text-sm font-semibold text-primary">{progressPercentage}%</div>
      </div>

      <div className="relative mb-6 h-2 w-full rounded-full bg-slate-200 dark:bg-white/5">
        <motion.div
          className="h-full rounded-full bg-emerald-500"
          initial={prefersReducedMotion ? false : { width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Mobile Vertical Stepper (< 768px) */}
      <div className="space-y-4 md:hidden">
        {TRACKING_STATUSES.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center border ${ isComplete ? "border-emerald-500 bg-emerald-500 text-white" : isCurrent ? "border-primary bg-primary text-primary-foreground" : "border-slate-200 bg-slate-100 dark:bg-white/5 text-slate-500" } rounded-xl`}
              >
                {isComplete ? (
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <span
                  className={`text-sm font-medium ${ isCurrent ? "text-foreground font-semibold" : "text-muted-foreground" }`}
                >
                  {t(`tracking.status.${getTimelineStatusKey(step)}`, { defaultValue: step })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Horizontal Stepper (>= 768px) */}
      <div className="hidden md:block overflow-x-auto w-full">
        <div className="flex min-w-[520px] items-start gap-4 py-2">
          {TRACKING_STATUSES.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex min-w-[120px] flex-1 flex-col items-center text-center">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center border ${ isComplete ? "border-emerald-500 bg-emerald-500 text-white" : isCurrent ? "border-primary bg-primary text-primary-foreground" : "border-slate-200 bg-slate-100 dark:bg-white/5 text-slate-500" } rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                <p className="text-sm font-medium leading-tight">{t(`tracking.status.${getTimelineStatusKey(step)}`, { defaultValue: step })}</p>

                {index < TRACKING_STATUSES.length - 1 ? (
                  <div className="mt-4 flex h-6 w-full items-center justify-center" aria-hidden="true">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
