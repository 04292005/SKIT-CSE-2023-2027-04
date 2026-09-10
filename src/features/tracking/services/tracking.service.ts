import {
  TRACKING_STATUSES,
  type ReportTrackingData,
  type TrackingStatus,
  type TrackingTimelineItem,
} from "../types";

const STATUS_DESCRIPTIONS: Record<TrackingStatus, string> = {
  Pending: "Submitted",
  Verified: "AI Verified",
  Assigned: "Assigned",
  "In Progress": "In Progress",
  Resolved: "Resolved",
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getReportProgress(status: TrackingStatus) {
  const index = TRACKING_STATUSES.indexOf(status);
  if (index < 0) {
    return 0;
  }

  return (index + 1) * 20;
}

export function getStatusColor(status: TrackingStatus) {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-700";
    case "Verified":
      return "bg-blue-100 text-blue-700";
    case "Assigned":
      return "bg-violet-100 text-violet-700";
    case "In Progress":
      return "bg-orange-100 text-orange-700";
    case "Resolved":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function formatTimeline(report: ReportTrackingData): TrackingTimelineItem[] {
  const history = report.statusHistory ?? [];

  if (history.length === 0) {
    const createdTimestamp = report.createdAt ? formatTimestamp(new Date(report.createdAt)) : "";

    const timeline: TrackingTimelineItem[] = [
      {
        status: "Pending",
        description: STATUS_DESCRIPTIONS.Pending,
        timestamp: createdTimestamp,
        state: report.status === "Pending" ? "current" : "complete",
      },
    ];

    if (report.status !== "Pending") {
      timeline.push({
        status: report.status,
        description: STATUS_DESCRIPTIONS[report.status],
        timestamp: report.updatedAt ? formatTimestamp(new Date(report.updatedAt)) : createdTimestamp,
        state: "current",
      });
    }

    return timeline;
  }

  const sortedHistory = [...history].sort((a, b) => {
    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return aTime - bTime;
  });

  const currentIndex = TRACKING_STATUSES.indexOf(report.status);

  return sortedHistory.map((entry) => {
    const status = entry.status;
    const statusIndex = TRACKING_STATUSES.indexOf(status);
    const state: TrackingTimelineItem["state"] =
      statusIndex < currentIndex
        ? "complete"
        : status === report.status
        ? "current"
        : "pending";

    return {
      status,
      description: entry.description ?? STATUS_DESCRIPTIONS[status],
      timestamp: entry.timestamp ? formatTimestamp(new Date(entry.timestamp)) : "",
      state,
    };
  });
}
