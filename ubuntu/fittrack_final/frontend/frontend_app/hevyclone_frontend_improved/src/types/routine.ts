// src/types/routine.ts
import { Exercise } from "./exercise";

export type Routine = {
  id: number;
  title?: string;
  name?: string;
  description: string;
  creator_id?: number;
  created_at?: string;
  updated_at?: string;
  exercises?: RoutineExercise[];
  workouts?: any[];
  targetProfileLevel?: string;
  durationWeeks?: number;
  division?: string; // Optional now
};

export type RoutineExercise = {
  id: number;
  routine_id: number;
  exercise_id: number;
  position: number;
  sets?: number;
  reps?: number;
  rest_seconds?: number;
  exercise?: Exercise;
};
