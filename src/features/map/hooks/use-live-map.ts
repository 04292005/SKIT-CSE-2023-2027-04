import { useEffect, useState, useMemo } from "react";
import type { Report, Category, ReportStatus } from "@/features/report/types";
import { subscribeToReports } from "../services/map.service";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function useLiveMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "All">("All");

  const { user, loading: authLoading } = useAuth();

  // Real-time listener
  useEffect(() => {
    if (authLoading) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToReports(
      (data) => {
        setReports(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setReports([]);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  // Geolocation handler
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn("Browser location access denied or unavailable:", err.message);
        }
      );
    }
  }, []);

  // Client-side filtering
  // Ignore reports without valid coordinates (as per user instruction)
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. Must have valid coordinates
      const lat = report.location?.latitude;
      const lng = report.location?.longitude;
      if (typeof lat !== "number" || typeof lng !== "number") {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "All" && report.category !== selectedCategory) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus !== "All" && report.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [reports, selectedCategory, selectedStatus]);

  // Statistics calculation (consistent with dashboard/requirements)
  const statistics = useMemo(() => {
    const total = reports.length;
    const active = reports.filter((r) => r.status !== "Resolved").length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const highPriority = reports.filter(
      (r) => (r.aiAnalysis?.priorityScore ?? 0) >= 80
    ).length;

    return { total, active, resolved, highPriority };
  }, [reports]);

  return {
    reports,
    filteredReports,
    loading,
    error,
    userLocation,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus,
    statistics,
  };
}
