import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import type { Report, ReportStatus, TrackingHistoryEntry } from "@/features/report/types";
import type { UserProfile } from "@/features/auth/types";

export function subscribeToAllReports(
  onUpdate: (reports: Report[]) => void,
  onError: (error: any) => void
) {
  const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"));

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs.map((doc) => {
        const data = doc.data();

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

        return {
          id: doc.id,
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          description: data.description,
          category: data.category,
          status: data.status,
          mediaType: data.mediaType,
          mimeType: data.mimeType,
          location: data.location,
          aiAnalysis: data.aiAnalysis,
          createdAt,
          updatedAt,
          statusHistory,
        } as Report & { uid?: string; displayName?: string; email?: string };
      });

      onUpdate(reports);
    },
    (err) => {
      console.error("Error subscribing to all reports:", err);
      onError(err);
    }
  );
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  description: string
) {
  const reportRef = doc(db, "reports", reportId);
  await updateDoc(reportRef, {
    status,
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status,
      description,
      timestamp: new Date(),
    }),
  });
}

export async function assignReportDepartment(reportId: string, department: string) {
  const reportRef = doc(db, "reports", reportId);
  const snapshot = await getDoc(reportRef);
  if (!snapshot.exists()) return;

  const data = snapshot.data();
  const currentStatus = data.status || "Pending";
  const updates: any = {};

  const aiAnalysis = data.aiAnalysis || {
    category: data.category || "Other",
    severity: "Medium",
    priorityScore: 50,
    confidence: 100,
    summary: "Department assigned manually.",
  };
  aiAnalysis.department = department;
  updates.aiAnalysis = aiAnalysis;

  if (currentStatus === "Pending" || currentStatus === "Verified") {
    updates.status = "Assigned";
    updates.statusHistory = arrayUnion({
      status: "Assigned",
      description: "Assigned to department",
      timestamp: new Date(),
    });
  }

  updates.updatedAt = serverTimestamp();
  await updateDoc(reportRef, updates);
}

export function subscribeToAllUsers(
  onUpdate: (users: UserProfile[]) => void,
  onError: (error: any) => void
) {
  const usersQuery = query(collection(db, "users"), orderBy("joinedAt", "desc"));

  return onSnapshot(
    usersQuery,
    (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.joinedAt
          ? (typeof data.joinedAt.toDate === "function"
              ? data.joinedAt.toDate()
              : new Date(data.joinedAt))
          : null;

        return {
          uid: doc.id,
          displayName: data.displayName || "",
          email: data.email || "",
          photoURL: data.photoURL || "",
          role: data.role || "citizen",
          heroPoints: data.heroPoints ?? 0,
          heroLevel: data.heroLevel || "Community Starter",
          reportsSubmitted: data.reportsSubmitted ?? 0,
          reportsVerified: data.reportsVerified ?? 0,
          streak: data.streak ?? 0,
          badges: data.badges || [],
          createdAt,
        } as unknown as UserProfile;
      });

      onUpdate(users);
    },
    (err) => {
      console.error("Error subscribing to users list:", err);
      onError(err);
    }
  );
}

export async function setUserRole(userId: string, role: "admin" | "citizen") {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role });
}
