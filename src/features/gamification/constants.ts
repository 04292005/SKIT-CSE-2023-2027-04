export const POINT_VALUES = {
  SUBMITTED: 10,
  AI_VERIFIED: 15,
  ASSIGNED: 10,
  RESOLVED: 25,
  DAILY_LOGIN: 5,
} as const;

export const HERO_LEVELS = [
  "Community Starter",
  "Civic Volunteer",
  "Community Guardian",
  "City Hero",
  "Civic Champion",
  "Community Legend",
] as const;

export type HeroLevel = typeof HERO_LEVELS[number];

export const LEVEL_THRESHOLDS = [
  { level: "Community Starter", minPoints: 0 },
  { level: "Civic Volunteer", minPoints: 100 },
  { level: "Community Guardian", minPoints: 250 },
  { level: "City Hero", minPoints: 500 },
  { level: "Civic Champion", minPoints: 1000 },
  { level: "Community Legend", minPoints: 2500 },
] as const;

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or lucide icon name
  pointsAwarded: number;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "first_report",
    name: "First Report",
    description: "Submitted your first civic report.",
    icon: "🌱",
    pointsAwarded: 20,
  },
  {
    id: "five_reports",
    name: "5 Reports",
    description: "Submitted five civic reports.",
    icon: "🌟",
    pointsAwarded: 50,
  },
  {
    id: "ten_reports",
    name: "10 Reports",
    description: "Submitted ten civic reports.",
    icon: "🏆",
    pointsAwarded: 100,
  },
  {
    id: "points_100",
    name: "100 Hero Points",
    description: "Reached 100 Hero Points.",
    icon: "⚡",
    pointsAwarded: 50,
  },
  {
    id: "points_500",
    name: "500 Hero Points",
    description: "Reached 500 Hero Points.",
    icon: "💥",
    pointsAwarded: 100,
  },
  {
    id: "streak_7",
    name: "7 Day Streak",
    description: "Maintained a 7-day active streak.",
    icon: "🔥",
    pointsAwarded: 100,
  },
  {
    id: "clean_city_hero",
    name: "Clean City Hero",
    description: "Submitted a report to help clean the city.",
    icon: "🧹",
    pointsAwarded: 30,
  },
  {
    id: "traffic_guardian",
    name: "Traffic Guardian",
    description: "Reported traffic signal or safety issues.",
    icon: "🚦",
    pointsAwarded: 30,
  },
  {
    id: "environment_protector",
    name: "Environment Protector",
    description: "Reported water leakages or sewerage issues.",
    icon: "💧",
    pointsAwarded: 30,
  },
];
