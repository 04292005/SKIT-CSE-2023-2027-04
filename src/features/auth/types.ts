export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    heroPoints: number;
    heroLevel:
      | "Community Starter"
      | "Civic Volunteer"
      | "Community Guardian"
      | "City Hero"
      | "Civic Champion"
      | "Community Legend";
    reportsSubmitted: number;
    reportsVerified: number;
    streak: number;
    badges: string[];
    createdAt: Date | null;
  }