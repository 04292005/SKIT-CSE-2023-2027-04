"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import i18n from "i18next";

import { db } from "@/firebase";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Report } from "@/features/report/types";
import { subscribeToUserReports } from "@/features/report/services/report.service";
import {
  calculateHeroLevel,
  calculateReportPoints,
  calculateBadgePoints,
  checkUnlockedBadges,
} from "../services/gamification.service";
import { BADGES, POINT_VALUES, type HeroLevel, type BadgeDefinition } from "../constants";
import { AchievementToast } from "../components/AchievementToast";

interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  heroPoints: number;
  heroLevel: HeroLevel;
  streak: number;
  badges: string[];
  lastActiveDate?: any;
  preferredLanguage?: string;
}

interface GamificationContextType {
  profile: UserProfileData | null;
  reports: Report[];
  loading: boolean;
  loginPoints: number;
  triggerToast: (badge: BadgeDefinition) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginPoints, setLoginPoints] = useState<number>(0);
  
  // Toast notifications queue
  const [activeToast, setActiveToast] = useState<BadgeDefinition | null>(null);

  const streakChecked = useRef<string | null>(null);
  const initialPointsCalculated = useRef<string | null>(null);

  // Setup toast triggering
  const triggerToast = (badge: BadgeDefinition) => {
    setActiveToast(badge);
  };

  // Real-time listener for user profile and reports
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setReports([]);
      setLoading(false);
      setLoginPoints(0);
      streakChecked.current = null;
      initialPointsCalculated.current = null;
      return;
    }

    setLoading(true);

    // 1. Subscribe to profile document
    const userRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserProfileData;
        setProfile(data);
      }
    });

    // 2. Subscribe to reports list
    const unsubscribeReports = subscribeToUserReports(
      user.uid,
      (data) => {
        setReports(data);
        setLoading(false);
      },
      (err) => {
        console.error("Gamification context reports error:", err);
        setReports([]);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeProfile();
      unsubscribeReports();
    };
  }, [user?.uid, authLoading]);

  // Handle language preference sync
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      if (profile && profile.preferredLanguage && i18n.language !== profile.preferredLanguage) {
        i18n.changeLanguage(profile.preferredLanguage);
      }
    } else {
      const savedLang = localStorage.getItem("preferredLanguage") || "en";
      if (i18n.language !== savedLang) {
        i18n.changeLanguage(savedLang);
      }
    }
  }, [user, authLoading, profile?.preferredLanguage]);

  useEffect(() => {
    if (!profile || !user) return;
    const currentUser = user;
    const currentProfile = profile;
    if (streakChecked.current === currentUser.uid) return;
    streakChecked.current = currentUser.uid;

    async function checkDailyStreak() {
      const userRef = doc(db, "users", currentUser.uid);
      const lastActive = currentProfile.lastActiveDate?.toDate
        ? currentProfile.lastActiveDate.toDate()
        : currentProfile.lastActiveDate
        ? new Date(currentProfile.lastActiveDate)
        : null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!lastActive) {
        // First login ever
        const addedPoints = POINT_VALUES.DAILY_LOGIN;
        setLoginPoints(addedPoints);
        
        await updateDoc(userRef, {
          streak: 1,
          lastActiveDate: Timestamp.now(),
          heroPoints: currentProfile.heroPoints + addedPoints,
          heroLevel: calculateHeroLevel(currentProfile.heroPoints + addedPoints),
        });
      } else {
        const lastActiveDay = new Date(lastActive);
        lastActiveDay.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastActiveDay.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          // It's a new day!
          let newStreak = 1;
          if (diffDays === 1) {
            newStreak = currentProfile.streak + 1; // consecutive day
          }

          const addedPoints = POINT_VALUES.DAILY_LOGIN;
          
          // Calculate initial loginPoints on first check of the day
          const reportPoints = calculateReportPoints(reports);
          const badgePoints = calculateBadgePoints(currentProfile.badges);
          const currentLoginPoints = Math.max(0, currentProfile.heroPoints - (reportPoints + badgePoints));
          setLoginPoints(currentLoginPoints + addedPoints);

          await updateDoc(userRef, {
            streak: newStreak,
            lastActiveDate: Timestamp.now(),
            heroPoints: currentProfile.heroPoints + addedPoints,
            heroLevel: calculateHeroLevel(currentProfile.heroPoints + addedPoints),
          });
        } else {
          // Same day login, calculate and set loginPoints without incrementing
          const reportPoints = calculateReportPoints(reports);
          const badgePoints = calculateBadgePoints(currentProfile.badges);
          const currentLoginPoints = Math.max(0, currentProfile.heroPoints - (reportPoints + badgePoints));
          setLoginPoints(currentLoginPoints);
        }
      }
    }

    checkDailyStreak();
  }, [profile?.uid, reports.length]);

  // Points sync and badge check loop
  useEffect(() => {
    if (!profile || !user) return;
    const currentUser = user;
    const currentProfile = profile;
    if (loading) return;

    // Check if initial loginPoints is setup
    if (initialPointsCalculated.current !== currentUser.uid) {
      initialPointsCalculated.current = currentUser.uid;
      const reportPoints = calculateReportPoints(reports);
      const badgePoints = calculateBadgePoints(currentProfile.badges);
      setLoginPoints(Math.max(0, currentProfile.heroPoints - (reportPoints + badgePoints)));
      return;
    }

    async function syncGamification() {
      const userRef = doc(db, "users", currentUser.uid);
      const reportPoints = calculateReportPoints(reports);
      
      // Step 1: Check if any new badges need to be unlocked
      const unlockedBadgeIds = checkUnlockedBadges(reports, currentProfile.heroPoints, currentProfile.streak);
      const newBadgeIds = unlockedBadgeIds.filter((id) => !currentProfile.badges.includes(id));

      if (newBadgeIds.length > 0) {
        const updatedBadges = [...currentProfile.badges, ...newBadgeIds];
        const newBadgePoints = calculateBadgePoints(newBadgeIds);
        
        // Calculate new total points including the new badge rewards
        const nextReportPoints = calculateReportPoints(reports);
        const nextBadgePoints = calculateBadgePoints(updatedBadges);
        const nextTotalPoints = nextReportPoints + nextBadgePoints + loginPoints;
        const nextLevel = calculateHeroLevel(nextTotalPoints);

        await updateDoc(userRef, {
          badges: updatedBadges,
          heroPoints: nextTotalPoints,
          heroLevel: nextLevel,
        });

        // Trigger notifications for new badges
        newBadgeIds.forEach((badgeId) => {
          const badgeDef = BADGES.find((b) => b.id === badgeId);
          if (badgeDef) {
            triggerToast(badgeDef);
          }
        });
      } else {
        // Step 2: Regular points sync if reports or status changed
        const badgePoints = calculateBadgePoints(currentProfile.badges);
        const expectedPoints = reportPoints + badgePoints + loginPoints;

        if (currentProfile.heroPoints !== expectedPoints) {
          const expectedLevel = calculateHeroLevel(expectedPoints);
          await updateDoc(userRef, {
            heroPoints: expectedPoints,
            heroLevel: expectedLevel,
          });
        }
      }
    }

    syncGamification();
  }, [reports, profile?.streak]);

  return (
    <GamificationContext.Provider value={{ profile, reports, loading, loginPoints, triggerToast }}>
      {children}
      {activeToast && (
        <AchievementToast
          badge={activeToast}
          onClose={() => setActiveToast(null)}
        />
      )}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
