import type { ReportStatus } from "@/features/report/types";

export type TrackingStatus = ReportStatus;

export const TRACKING_STATUSES: TrackingStatus[] = [
  "Pending",
  "Verified",
  "Assigned",
  "In Progress",
  "Resolved",
];

export interface TrackingHistoryEntry {
  status: TrackingStatus;
  description?: string;
  timestamp?: Date | null;
}

export interface TrackingTimelineItem {
  status: TrackingStatus;
  description: string;
  timestamp: string;
  state: "complete" | "current" | "pending";
}

export interface ReportTrackingData {
  status: TrackingStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  statusHistory?: TrackingHistoryEntry[] | null;
}

export interface ReportTrackingResult {
  currentStatus: TrackingStatus;
  progressPercentage: number;
  timeline: TrackingTimelineItem[];
  loading: boolean;
}
