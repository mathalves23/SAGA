// Navigation Types for SAGA Mobile App

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

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  WorkoutDetailsScreen: { workoutId: string };
  ExerciseDetailsScreen: { exerciseId: string };
};

export type WorkoutStackParamList = {
  WorkoutsScreen: undefined;
  WorkoutDetailsScreen: { workoutId: string };
  CreateWorkoutScreen: undefined;
  ExerciseDetailsScreen: { exerciseId: string };
};

export type ExerciseStackParamList = {
  ExercisesScreen: undefined;
  ExerciseDetailsScreen: { exerciseId: string };
  ExerciseLibraryScreen: undefined;
};

export type ProgressStackParamList = {
  ProgressScreen: undefined;
  ProgressDetailsScreen: { type: string };
  ProgressHistoryScreen: undefined;
};

export type NutritionStackParamList = {
  NutritionScreen: undefined;
  FoodDetailsScreen: { foodId: string };
  MealPlannerScreen: undefined;
  RecipesScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  SettingsScreen: undefined;
  AboutScreen: undefined;
};

// Additional param lists for specific features
export type GamificationStackParamList = {
  GamificationHomeScreen: undefined;
  AchievementsScreen: undefined;
  LeaderboardScreen: undefined;
  ChallengesScreen: undefined;
};

export type IntegrationsStackParamList = {
  SmartIntegrationsScreen: undefined;
  WearableSetupScreen: { deviceType: string };
  SmartHomeScreen: undefined;
  HealthKitScreen: undefined;
};

export type AnalyticsStackParamList = {
  AnalyticsScreen: undefined;
  DetailedAnalyticsScreen: { metric: string };
  ExportDataScreen: undefined;
};

// Common navigation props
export type NavigationProps<T extends keyof any> = {
  navigation: any;
  route: {
    params: T;
  };
};

// Screen component types
export type ScreenComponent<T = undefined> = React.FC<{
  navigation: any;
  route: T extends undefined ? { params?: any } : { params: T };
}>;

export default RootStackParamList; 