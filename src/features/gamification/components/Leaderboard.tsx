"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Medal, Trophy, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { db } from "@/firebase";

interface LeaderboardUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  heroPoints: number;
  heroLevel: string;
  badges: string[];
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("heroPoints", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const topUsers = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            uid: doc.id,
            displayName: data.displayName || "Anonymous Hero",
            photoURL: data.photoURL,
            heroPoints: data.heroPoints || 0,
            heroLevel: data.heroLevel || "Community Starter",
            badges: data.badges || [],
          } as LeaderboardUser;
        });
        setUsers(topUsers);
        setLoading(false);
      },
      (err) => {
        console.error("Leaderboard subscription error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-background p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
              <div className="h-5 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-background p-5 shadow-sm min-w-0 w-full overflow-hidden">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" aria-hidden="true" />
          <h3 className="font-semibold text-lg text-foreground">{t("dashboard.leaderboard.title")}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{t("dashboard.leaderboard.subtitle")}</span>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("dashboard.leaderboard.empty")}</p>
      ) : (
        <ol className="space-y-2 max-h-[500px] overflow-y-auto pr-1" role="list">
          {users.map((item, index) => {
            const isTop3 = index < 3;
            const rankColors = [
              "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400", // Gold
              "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400",   // Silver
              "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400", // Bronze
            ];

            return (
              <li
                key={item.uid}
                role="listitem"
                className="flex items-center justify-between p-3 rounded-2xl border border-border/40 hover:bg-slate-950/5 dark:hover:bg-slate-100/5 transition-all duration-200"
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Rank Indicator */}
                  <div className="w-8 shrink-0 flex justify-center">
                    {index === 0 ? (
                      <Trophy className="h-5 w-5 text-amber-500" aria-label="First Place" />
                    ) : index === 1 ? (
                      <Medal className="h-5 w-5 text-slate-400" aria-label="Second Place" />
                    ) : index === 2 ? (
                      <Medal className="h-5 w-5 text-orange-400" aria-label="Third Place" />
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  {item.photoURL ? (
                    <img
                      src={item.photoURL}
                      alt={item.displayName}
                      className="h-9 w-9 rounded-xl object-cover border border-border/80 shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/20">
                      {item.displayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Name and Level */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {item.displayName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">
                      {t(`badges.${item.heroLevel.toLowerCase().replace(" ", "_")}.name`, { defaultValue: item.heroLevel })}
                    </p>
                  </div>
                </div>

                {/* Score & Badges */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{item.badges.length}</span>{" "}
                    {item.badges.length === 1 ? t("dashboard.gamification.badge") : t("dashboard.gamification.badges")}
                  </div>
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 px-3 py-1 text-sm font-bold min-w-[70px] text-center border border-indigo-500/10">
                    {item.heroPoints} {t("dashboard.gamification.pts")}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
