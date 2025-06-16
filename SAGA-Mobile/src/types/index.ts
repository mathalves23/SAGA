// Tipos compartilhados para SAGA Mobile
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'USER' | 'ADMIN';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  notifications: boolean;
  units: 'metric' | 'imperial';
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  animationUrl?: string;
  equipment?: string[];
  difficultyLevelName?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  duration: number; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  createdAt: Date;
  userId: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // seconds
  restTime: number; // seconds
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workout: Workout;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'paused';
  completedExercises: string[];
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'weight' | 'strength' | 'endurance' | 'flexibility';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';
  userId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress: number; // 0-100
  requirements: string[];
}

export interface ProgressEntry {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements: Record<string, number>;
  photos?: string[];
  notes?: string;
  userId: string;
}

export interface Nutrition {
  id: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  water: number; // ml
  userId: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  calories: number;
  time: Date;
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'workout' | 'achievement' | 'goal' | 'social' | 'system';
  read: boolean;
  createdAt: Date;
  userId: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Workout: { workoutId?: string };
  Exercise: { exerciseId: string };
  Profile: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

// API Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// App State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
}

export interface WorkoutState {
  currentSession: WorkoutSession | null;
  activeWorkouts: Workout[];
  history: WorkoutSession[];
  isLoading: boolean;
}

export interface ProgressState {
  entries: ProgressEntry[];
  currentWeight?: number;
  goals: Goal[];
  achievements: Achievement[];
  isLoading: boolean;
} 