import { useTranslation } from "react-i18next";
import type { Category } from "@/features/report/types";

export function MapLegend() {
  const { t } = useTranslation();

  const legendItems: { label: Category | "Other"; color: string }[] = [
    { label: "Roads", color: "bg-indigo-600" },
    { label: "Garbage", color: "bg-orange-500" },
    { label: "Street Lights", color: "bg-amber-400" },
    { label: "Water", color: "bg-sky-500" },
    { label: "Traffic", color: "bg-purple-500" },
    { label: "Safety", color: "bg-rose-600" },
    { label: "Other", color: "bg-slate-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {t("liveMap.legend")}:
      </span>
      <div className="flex flex-wrap gap-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} aria-hidden="true" />
            <span className="text-foreground/85">
              {t("categories." + item.label) || item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
