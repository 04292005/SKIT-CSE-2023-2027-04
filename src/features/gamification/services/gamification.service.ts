import type { Report } from "@/features/report/types";
import {
  LEVEL_THRESHOLDS,
  HERO_LEVELS,
  POINT_VALUES,
  BADGES,
  type HeroLevel,
} from "../constants";

/**
 * Calculates level name based on points.
 */
export function calculateHeroLevel(points: number): HeroLevel {
  let currentLevel: HeroLevel = "Community Starter";
  for (const threshold of LEVEL_THRESHOLDS) {
    if (points >= threshold.minPoints) {
      currentLevel = threshold.level;
    } else {
      break;
    }
  }
  return currentLevel;
}

/**
 * Calculates progression info to the next level.
 */
export function getLevelProgress(points: number) {
  const currentLevel = calculateHeroLevel(points);
  const currentIndex = HERO_LEVELS.indexOf(currentLevel);

  if (currentIndex === HERO_LEVELS.length - 1) {
    return {
      currentLevel,
      nextLevel: null,
      pointsRequired: 0,
      progressPercent: 100,
    };
  }

  const nextLevel = HERO_LEVELS[currentIndex + 1];
  const currentThreshold = LEVEL_THRESHOLDS[currentIndex].minPoints;
  const nextThreshold = LEVEL_THRESHOLDS[currentIndex + 1].minPoints;

  const pointsInCurrentRange = points - currentThreshold;
  const rangeWidth = nextThreshold - currentThreshold;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((pointsInCurrentRange / rangeWidth) * 100))
  );

  return {
    currentLevel,
    nextLevel,
    pointsRequired: nextThreshold - points,
    progressPercent,
  };
}

/**
 * Calculates points derived directly from a user's reports.
 */
export function calculateReportPoints(reports: Report[]): number {
  let points = 0;

  for (const report of reports) {
    // 1. Submitted (+10)
    points += POINT_VALUES.SUBMITTED;

    // We scan statusHistory to check which transitions occurred
    const history = report.statusHistory || [];
    const statuses = new Set(history.map((h) => h.status));

    // Also check current status in case history is out of sync
    if (report.status) {
      statuses.add(report.status);
    }

    // 2. AI Verified (+15)
    // The "Verified" step is part of the tracking statuses
    if (statuses.has("Verified") || statuses.has("Assigned") || statuses.has("In Progress") || statuses.has("Resolved")) {
      points += POINT_VALUES.AI_VERIFIED;
    }

    // 3. Report Assigned (+10)
    if (statuses.has("Assigned") || statuses.has("In Progress") || statuses.has("Resolved")) {
      points += POINT_VALUES.ASSIGNED;
    }

    // 4. Report Resolved (+25)
    if (statuses.has("Resolved")) {
      points += POINT_VALUES.RESOLVED;
    }
  }

  return points;
}

/**
 * Checks which badges are unlocked.
 */
export function checkUnlockedBadges(
  reports: Report[],
  points: number,
  streak: number
): string[] {
  const unlocked: string[] = [];

  const totalReports = reports.length;

  // First Report
  if (totalReports >= 1) {
    unlocked.push("first_report");
  }

  // 5 Reports
  if (totalReports >= 5) {
    unlocked.push("five_reports");
  }

  // 10 Reports
  if (totalReports >= 10) {
    unlocked.push("ten_reports");
  }

  // 100 Hero Points
  if (points >= 100) {
    unlocked.push("points_100");
  }

  // 500 Hero Points
  if (points >= 500) {
    unlocked.push("points_500");
  }

  // 7 Day Streak
  if (streak >= 7) {
    unlocked.push("streak_7");
  }

  // Clean City Hero (Garbage category)
  if (reports.some((r) => r.category === "Garbage")) {
    unlocked.push("clean_city_hero");
  }

  // Traffic Guardian (Traffic category)
  if (reports.some((r) => r.category === "Traffic")) {
    unlocked.push("traffic_guardian");
  }

  // Environment Protector (Water category)
  if (reports.some((r) => r.category === "Water")) {
    unlocked.push("environment_protector");
  }

  return unlocked;
}

/**
 * Calculates badge bonus points for a list of badge IDs.
 */
export function calculateBadgePoints(badgeIds: string[]): number {
  let points = 0;
  for (const id of badgeIds) {
    const badge = BADGES.find((b) => b.id === id);
    if (badge) {
      points += badge.pointsAwarded;
    }
  }
  return points;
}
