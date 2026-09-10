import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/firebase";

import type {
  Category,
  Report,
  ReportLocation,
  ReportPayload,
  ReportStatus,
  TrackingHistoryEntry,
} from "../types";

const INITIAL_STATUS: ReportStatus = "Pending";

export async function submitReport(payload: ReportPayload) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in.");
  }

  const docRef = await addDoc(collection(db, "reports"), {
    uid: user.uid,
    displayName: user.displayName ?? "",
    email: user.email ?? "",

    description: payload.description,
    category: payload.category,

    aiAnalysis: payload.aiAnalysis ?? null,

    mediaType: payload.mediaType,
    mimeType: payload.mimeType,

    location: payload.location ?? null,

    status: INITIAL_STATUS,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function fetchUserReports() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in.");
  }

  const reportsQuery = query(
    collection(db, "reports"),
    where("uid", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(reportsQuery);

  return snapshot.docs.map((doc) => {
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
      description: data.description,
      category: data.category as Category,
      status: data.status as ReportStatus,
      mediaType: data.mediaType as "image" | "video" | undefined,
      location: data.location as ReportLocation | undefined,
      aiAnalysis: data.aiAnalysis ?? null,
      createdAt: data.createdAt?.toDate?.() ?? null,
      updatedAt: data.updatedAt?.toDate?.() ?? null,
      statusHistory,
    };
  });
}

export async function fetchReportById(reportId: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be logged in.");
  }

  const reportRef = doc(db, "reports", reportId);
  const snapshot = await getDoc(reportRef);

  if (!snapshot.exists()) {
    throw new Error("Report not found.");
  }

  const data = snapshot.data();

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
    id: snapshot.id,
    description: data.description,
    category: data.category as Category,
    status: data.status as ReportStatus,
    mediaType: data.mediaType as "image" | "video" | undefined,
    location: data.location as ReportLocation | undefined,
    aiAnalysis: data.aiAnalysis ?? null,
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
    statusHistory,
  };
}

export function subscribeToUserReports(
  uid: string,
  onUpdate: (reports: Report[]) => void,
  onError: (error: any) => void
) {
  const reportsQuery = query(
    collection(db, "reports"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reportsQuery,
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
          description: data.description,
          category: data.category as Category,
          status: data.status as ReportStatus,
          mediaType: data.mediaType as "image" | "video" | undefined,
          location: data.location as ReportLocation | undefined,
          aiAnalysis: data.aiAnalysis ?? null,
          createdAt: data.createdAt?.toDate?.() ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          statusHistory,
        } as Report;
      });

      onUpdate(reports);
    },
    (err) => {
      console.error("Firestore user reports subscription error:", err);
      onError(err);
    }
  );
}
