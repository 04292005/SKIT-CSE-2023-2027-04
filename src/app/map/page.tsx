"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { ErrorCard } from "@/components/common";
import { SectionTitle } from "@/components/common/section-title";
import { useLiveMap } from "@/features/map/hooks/use-live-map";
import { MapFilters } from "@/features/map/components/MapFilters";
import { MapLegend } from "@/features/map/components/MapLegend";
import { MapStatistics } from "@/features/map/components/MapStatistics";

// Dynamic import of LiveMap to disable SSR (since Leaflet requires 'window' object)
const LiveMap = dynamic(
  () => import("@/features/map/components/LiveMap").then((mod) => mod.LiveMap),
  {
    ssr: false,
    loading: () => {
      // Inline use of hook would fail here, but translation dictionary is loaded, we can use a basic translation or text.
      // Better to return a simple loading indicator that is translated inside the page component, but for the loader:
      return (
        <div className="flex h-[400px] w-full animate-pulse items-center justify-center sm:h-[550px] rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-muted-foreground text-sm font-medium">Loading interactive map…</p>
        </div>
      );
    },
  }
);

export default function MapPage() {
  const { t } = useTranslation();
  const {
    filteredReports,
    loading,
    error,
    userLocation,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus,
    statistics,
  } = useLiveMap();

  return (
    <main className="w-full bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:py-24 lg:px-8">
      <SectionTitle
        title={t("liveMap.title")}
        subtitle={t("liveMap.subtitle")}
        description={t("liveMap.description")}
      />

      <div className="mt-8">
        {/* Statistics Row */}
        <MapStatistics
          total={statistics.total}
          active={statistics.active}
          resolved={statistics.resolved}
          highPriority={statistics.highPriority}
          loading={loading}
        />

        {error ? (
          <div className="mt-6">
            <ErrorCard message="Unable to load the community map. Please check your network connection." />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Filter and Legend Row */}
            <div className="surface-card flex flex-col items-start gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <MapFilters
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                onSelectCategory={setSelectedCategory}
                onSelectStatus={setSelectedStatus}
              />
              <MapLegend />
            </div>

            {/* Map Container */}
            {loading ? (
              <div className="flex h-[400px] w-full animate-pulse items-center justify-center sm:h-[550px] rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-muted-foreground text-sm font-medium">{t("liveMap.connecting")}</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex h-[400px] w-full items-center justify-center p-6 text-center sm:h-[550px] rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="max-w-md space-y-3">
                  <p className="text-lg font-semibold text-foreground">{t("liveMap.empty.title")}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("liveMap.empty.description")}
                  </p>
                </div>
              </div>
            ) : (
              <LiveMap reports={filteredReports} userLocation={userLocation} />
            )}
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
