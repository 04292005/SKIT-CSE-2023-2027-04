import type { Category, ReportStatus } from "@/features/report/types";

export interface MapFiltersState {
  category: Category | "All";
  status: ReportStatus | "All";
}

export interface MapStatisticsData {
  total: number;
  active: number;
  resolved: number;
  highPriority: number;
}
