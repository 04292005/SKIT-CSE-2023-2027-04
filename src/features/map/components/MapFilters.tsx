import { useTranslation } from "react-i18next";
import type { Category, ReportStatus } from "@/features/report/types";
import { getTimelineStatusKey } from "@/features/tracking/utils";

interface MapFiltersProps {
  selectedCategory: Category | "All";
  selectedStatus: ReportStatus | "All";
  onSelectCategory: (category: Category | "All") => void;
  onSelectStatus: (status: ReportStatus | "All") => void;
}

export function MapFilters({
  selectedCategory,
  selectedStatus,
  onSelectCategory,
  onSelectStatus,
}: MapFiltersProps) {
  const { t } = useTranslation();

  const categories: Category[] = [
    "Roads",
    "Garbage",
    "Street Lights",
    "Water",
    "Traffic",
    "Safety",
  ];

  const statuses: ReportStatus[] = [
    "Pending",
    "Assigned",
    "In Progress",
    "Resolved",
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Reset Filter "All" */}
      <button
        onClick={() => {
          onSelectCategory("All");
          onSelectStatus("All");
        }}
        aria-pressed={selectedCategory === "All" && selectedStatus === "All"}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${ selectedCategory === "All" && selectedStatus === "All" ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900" : "bg-background text-muted-foreground border-border hover:bg-slate-50 dark:hover:bg-slate-900" }`}
      >
        {t("liveMap.filters.all") || "All"}
      </button>

      {/* Category Chips */}
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            onSelectCategory(selectedCategory === cat ? "All" : cat);
          }}
          aria-pressed={selectedCategory === cat}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${ selectedCategory === cat ? "bg-indigo-600 text-white border-indigo-600 shadow-xs" : "bg-background text-muted-foreground border-border hover:bg-slate-50 dark:hover:bg-slate-900" }`}
        >
          {t("categories." + cat) || cat}
        </button>
      ))}

      {/* Vertical visual divider */}
      <div className="mx-1 hidden h-5 w-px self-center bg-border sm:block" aria-hidden="true" />

      {/* Status Chips */}
      {statuses.map((stat) => (
        <button
          key={stat}
          onClick={() => {
            onSelectStatus(selectedStatus === stat ? "All" : stat);
          }}
          aria-pressed={selectedStatus === stat}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${ selectedStatus === stat ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-background text-muted-foreground border-border hover:bg-slate-50 dark:hover:bg-slate-900" }`}
        >
          {t("tracking.status." + getTimelineStatusKey(stat), { defaultValue: stat })}
        </button>
      ))}
    </div>
  );
}
