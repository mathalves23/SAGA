// src/types/workout.ts
export type Workout = {
  id: number;
  user_id: number;
  routine_id?: number;
  date: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type WorkoutExercise = {
  id: number;
  workout_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  weight?: number;
  completed: boolean;
  notes?: string;
};
