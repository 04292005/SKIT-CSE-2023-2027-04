"use client";

import { useMemo } from "react";

import { formatTimeline, getReportProgress } from "../services/tracking.service";
import type { ReportTrackingData, ReportTrackingResult, TrackingStatus } from "../types";

function statusHistoryKey(statusHistory?: ReportTrackingData["statusHistory"]) {
  if (!statusHistory) return "";
  return statusHistory
    .map(
      (entry) =>
        `${entry.status}-${entry.timestamp?.toISOString() ?? ""}-${entry.description ?? ""}`
    )
    .join("|");
}

export function useReportTracking(report?: ReportTrackingData | null): ReportTrackingResult {
  const currentStatus = report?.status ?? "Pending";

  const result = useMemo(() => {
    const status = report?.status ?? "Pending";

    return {
      currentStatus: status,
      progressPercentage: getReportProgress(status),
      timeline: formatTimeline({
        status,
        createdAt: report?.createdAt,
        updatedAt: report?.updatedAt,
        statusHistory: report?.statusHistory ?? null,
      }),
      loading: false,
    };
  }, [report?.createdAt?.getTime(), report?.updatedAt?.getTime(), report?.status, statusHistoryKey(report?.statusHistory)]);

  return result;
}
