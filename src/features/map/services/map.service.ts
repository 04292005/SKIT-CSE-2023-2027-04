import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import type { Report, Category, ReportStatus, TrackingHistoryEntry } from "@/features/report/types";

export function subscribeToReports(
  onUpdate: (reports: Report[]) => void,
  onError: (error: any) => void
) {
  
  const reportsCollection = collection(db, "reports");

  return onSnapshot(
    reportsCollection,
    (snapshot) => {
      const reports = snapshot.docs.map((doc) => {
        const data = doc.data();

        const statusHistory = Array.isArray(data.statusHistory)
          ? (data.statusHistory as unknown[]).map((entry) => {
              const raw = entry as Record<string, any>;

              return {
                status: raw.status as ReportStatus,
                description: typeof raw.description === "string" ? raw.description : undefined,
                timestamp: raw.timestamp?.toDate?.() ?? null,
              } as TrackingHistoryEntry;
            })
          : null;

        return {
          id: doc.id,
          description: data.description || "",
          category: data.category as Category,
          status: data.status as ReportStatus,
          mediaType: data.mediaType as "image" | "video" | undefined,
          location: data.location || undefined,
          aiAnalysis: data.aiAnalysis || null,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          statusHistory,
        } as Report;
      });

      onUpdate(reports);
    },
    (err) => {
      console.error("Firestore live map subscription error:", err);
      onError(err);
    }
  );
}
