// src/services/exerciseService.ts
import api from "./api";
import { Exercise } from "../types/exercise";
import exercisesData from "../data/exercises.json";

// Função para mapear dados do JSON para o tipo Exercise
const mapJsonToExercise = (jsonExercise: any): Exercise => ({
  id: jsonExercise.id,
  name: jsonExercise.name,
  description: jsonExercise.description || "",
  instructions: jsonExercise.instructions || "",
  primary_muscle_group_id: 1, // Valor padrão, pois não temos IDs no JSON
  equipment_id: 1, // Valor padrão
  primaryMuscleGroupName: jsonExercise.primaryMuscleGroupName,
  equipmentName: jsonExercise.equipmentName,
  video_url: jsonExercise.videoUrl,
  image_url: jsonExercise.imageUrl
});

export const exerciseService = {
  getAll: async (): Promise<Exercise[]> => {
    try {
      // Tenta buscar do backend primeiro
      const response = await api.get("/exercises");
      return response.data as unknown;
    } catch (error) {
      // Se falhar, usa os dados locais
      console.log("Backend indisponível, usando dados locais dos exercícios");
      return exercisesData.map(mapJsonToExercise);
    }
  },
  
  getById: async (id: string | number): Promise<Exercise> => {
    try {
      const response = await api.get(`/exercises/${id}`);
      return response.data as unknown;
    } catch (error) {
      // Se falhar, busca nos dados locais
      const exercise = exercisesData.find(ex => ex.id === Number(id));
      if (!exercise) {
        throw new Error(`Exercício com ID ${id} não encontrado`);
      }
      return mapJsonToExercise(exercise);
    }
  },
  
  getByWorkout: async (workoutId: string | number) => {
    const response = await api.get(`/workout-exercises/workout/${workoutId}`);
    return response.data as unknown;
  },
  
  // Adicionando métodos para filtrar exercícios
  getByMuscleGroup: async (muscleGroupId: number): Promise<Exercise[]> => {
    try {
      const response = await api.get(`/exercises/muscle-group/${muscleGroupId}`);
      return response.data as unknown;
    } catch (error) {
      // Filtra dos dados locais por nome do grupo muscular
      const filtered = exercisesData.filter(ex => 
        ex.primaryMuscleGroupName?.toLowerCase().includes('biceps') && muscleGroupId === 1 ||
        ex.primaryMuscleGroupName?.toLowerCase().includes('chest') && muscleGroupId === 2 ||
        ex.primaryMuscleGroupName?.toLowerCase().includes('quadriceps') && muscleGroupId === 3
      );
      return filtered.map(mapJsonToExercise);
    }
  },
  
  getByEquipment: async (equipmentId: number): Promise<Exercise[]> => {
    try {
      const response = await api.get(`/exercises/equipment/${equipmentId}`);
      return response.data as unknown;
    } catch (error) {
      // Filtra dos dados locais por nome do equipamento
      const filtered = exercisesData.filter(ex => 
        ex.equipmentName?.toLowerCase().includes('nenhum') && equipmentId === 1 ||
        ex.equipmentName?.toLowerCase().includes('halter') && equipmentId === 2 ||
        ex.equipmentName?.toLowerCase().includes('barra') && equipmentId === 3
      );
      return filtered.map(mapJsonToExercise);
    }
  },
  

};
