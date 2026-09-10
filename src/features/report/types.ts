import type { VisionAnalysis } from "@/ai/agents/vision";

export type Category =
  | "Roads"
  | "Garbage"
  | "Street Lights"
  | "Water"
  | "Traffic"
  | "Safety"
  | "Other";

export type ReportStatus =
  | "Pending"
  | "Verified"
  | "Assigned"
  | "In Progress"
  | "Resolved";

export interface ReportLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface AIAnalysis {
  category: string;
  severity: "Low" | "Medium" | "High";
  priorityScore: number;
  department: string;
  summary: string;
  confidence: number;
}

export interface ReportPayload {
  description: string;
  category: Category;

  media?: File | null;

  mediaType: "image" | "video" | null;

  mimeType: string | null;

  location?: ReportLocation | null;

  aiAnalysis?: VisionAnalysis | null;
}

export interface TrackingHistoryEntry {
  status: ReportStatus;
  description?: string;
  timestamp?: Date | null;
}

export interface Report {
  id?: string;

  description: string;

  category: Category;

  mediaType?: "image" | "video";

  location?: ReportLocation;

  status: ReportStatus;

  aiAnalysis?: VisionAnalysis | null;

  createdAt?: Date | null;

  updatedAt?: Date | null;

  statusHistory?: TrackingHistoryEntry[] | null;
}