// src/types/user.ts
import type { Routine } from "./routine";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'USER' | 'ADMIN' | 'PREMIUM';
  createdAt: string;
  updatedAt: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  stats?: {
    totalWorkouts: number;
    totalTime: number;
    currentStreak: number;
    maxStreak: number;
  };
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  birthday?: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
}

export interface UserSettings {
  notifications: {
    workoutReminders: boolean;
    socialUpdates: boolean;
    achievements: boolean;
    weeklyProgress: boolean;
  };
  privacy: {
    profileVisible: boolean;
    workoutsVisible: boolean;
    statsVisible: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    units: 'metric' | 'imperial';
    restTimerSound: boolean;
  };
}
