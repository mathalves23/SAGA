// src/services/workoutService.ts
import api from "./api";
import { Workout } from "../types/workout";

// Dados mock para workouts quando o backend não estiver disponível
const mockWorkouts: Workout[] = [
  {
    id: 1,
    user_id: 1,
    routine_id: 1,
    date: "2024-12-01",
    duration_minutes: 65,
    notes: "Treino Push - Dia 1",
    created_at: "2024-12-01T10:30:00Z",
    updated_at: "2024-12-01T11:45:00Z"
  },
  {
    id: 2,
    user_id: 1,
    routine_id: 2,
    date: "2024-12-03",
    duration_minutes: 55,
    notes: "Treino Pull - Dia 2",
    created_at: "2024-12-03T14:20:00Z",
    updated_at: "2024-12-03T15:30:00Z"
  },
  {
    id: 3,
    user_id: 1,
    routine_id: 3,
    date: "2024-12-05",
    duration_minutes: 75,
    notes: "Treino Legs - Dia 3",
    created_at: "2024-12-05T09:15:00Z",
    updated_at: "2024-12-05T10:45:00Z"
  }
];

export const workoutService = {
  getAllLogs: async (): Promise<Workout[]> => {
    try {
      const response = await api.get("/user-workout-logs");
      return response.data as unknown;
    } catch (error) {
      console.log("Backend indisponível, usando dados locais dos workouts");
      return mockWorkouts;
    }
  },
  
  getLogById: async (id: string | number): Promise<Workout> => {
    try {
      const response = await api.get(`/user-workout-logs/${id}`);
      return response.data as unknown;
    } catch (error) {
      const workout = mockWorkouts.find(w => w.id === Number(id));
      if (!workout) {
        throw new Error(`Workout com ID ${id} não encontrado`);
      }
      return workout;
    }
  },

  getWorkoutById: async (id: string | number): Promise<Workout> => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data as unknown;
    } catch (error) {
      const workout = mockWorkouts.find(w => w.id === Number(id));
      if (!workout) {
        throw new Error(`Workout com ID ${id} não encontrado`);
      }
      return workout;
    }
  },
  
  logWorkout: async (data: any): Promise<Workout> => {
    try {
      const response = await api.post("/user-workout-logs", data);
      return response.data as unknown;
    } catch (error) {
      // Mock de criação de workout
      const newWorkout: Workout = {
        id: Date.now(),
        user_id: data.user_id || 1,
        routine_id: data.routine_id,
        date: data.date || new Date().toISOString().split('T')[0],
        duration_minutes: data.duration_minutes || 0,
        notes: data.notes || "Novo Treino",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockWorkouts.push(newWorkout);
      return newWorkout;
    }
  },
  
  updateWorkout: async (id: string | number, data: Partial<Workout>): Promise<Workout> => {
    try {
      const response = await api.put(`/user-workout-logs/${id}`, data);
      return response.data as unknown;
    } catch (error) {
      const workoutIndex = mockWorkouts.findIndex(w => w.id === Number(id));
      if (workoutIndex === -1) {
        throw new Error(`Workout com ID ${id} não encontrado`);
      }
      mockWorkouts[workoutIndex] = { 
        ...mockWorkouts[workoutIndex], 
        ...data,
        updated_at: new Date().toISOString()
      };
      return mockWorkouts[workoutIndex];
    }
  },
  
  deleteWorkout: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/user-workout-logs/${id}`);
    } catch (error) {
      const workoutIndex = mockWorkouts.findIndex(w => w.id === Number(id));
      if (workoutIndex > -1) {
        mockWorkouts.splice(workoutIndex, 1);
      }
    }
  }
};
