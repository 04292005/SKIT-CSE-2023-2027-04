"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Report, Category, ReportLocation, ReportStatus, TrackingHistoryEntry } from "@/features/report/types";

export function useLiveReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!reportId) {
      setReport(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, "reports", reportId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError("Report not found");
          setReport(null);
          setLoading(false);
          return;
        }

        try {
          const data = snapshot.data();

          const statusHistory = Array.isArray(data.statusHistory)
            ? (data.statusHistory as unknown[]).map((entry) => {
                const raw = entry as Record<string, any>;

                const timestamp = raw.timestamp
                  ? (typeof raw.timestamp.toDate === "function"
                      ? raw.timestamp.toDate()
                      : new Date(raw.timestamp))
                  : null;

                return {
                  status: raw.status as ReportStatus,
                  description: typeof raw.description === "string" ? raw.description : undefined,
                  timestamp,
                } as TrackingHistoryEntry;
              })
            : null;

          const createdAt = data.createdAt
            ? (typeof data.createdAt.toDate === "function"
                ? data.createdAt.toDate()
                : new Date(data.createdAt))
            : null;

          const updatedAt = data.updatedAt
            ? (typeof data.updatedAt.toDate === "function"
                ? data.updatedAt.toDate()
                : new Date(data.updatedAt))
            : null;

          const reportData: Report = {
            id: snapshot.id,
            description: data.description,
            category: data.category as Category,
            status: data.status as ReportStatus,
            mediaType: data.mediaType as "image" | "video" | undefined,
            location: data.location as ReportLocation | undefined,
            aiAnalysis: data.aiAnalysis ?? null,
            createdAt,
            updatedAt,
            statusHistory,
          };

          setReport(reportData);
          setError(null);
        } catch (err) {
          console.error("Error parsing report details:", err);
          setError("Failed to parse report details.");
          setReport(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error listening to report:", err);
        setError("Unable to load report details. Please try again later.");
        setReport(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading, reportId]);

  return { report, loading, error };
}

