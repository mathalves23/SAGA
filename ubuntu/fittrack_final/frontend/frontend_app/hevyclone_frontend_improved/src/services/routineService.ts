// src/services/routineService.ts
import api from "./api";
import { Routine } from "../types/routine";
import { Exercise } from "../types/exercise";

// Exercícios mock para usar nas rotinas
const mockExercises: Exercise[] = [
  // Exercícios de peito
  { id: 1, name: "Supino Reto", description: "Exercício básico para peitorais", primary_muscle_group_id: 1, equipment_id: 1, primaryMuscleGroupName: "Peitorais", equipmentName: "Barra" },
  { id: 2, name: "Supino Inclinado", description: "Foco na porção superior do peitoral", primary_muscle_group_id: 1, equipment_id: 1, primaryMuscleGroupName: "Peitorais", equipmentName: "Barra" },
  { id: 3, name: "Flexão de Braço", description: "Exercício clássico usando peso corporal", primary_muscle_group_id: 1, equipment_id: 6, primaryMuscleGroupName: "Peitorais", equipmentName: "Peso Corporal" },
  { id: 4, name: "Crucifixo com Halteres", description: "Isolamento para peitorais", primary_muscle_group_id: 1, equipment_id: 2, primaryMuscleGroupName: "Peitorais", equipmentName: "Halteres" },
  
  // Exercícios de costas
  { id: 5, name: "Barra Fixa", description: "Exercício fundamental para dorsal", primary_muscle_group_id: 2, equipment_id: 6, primaryMuscleGroupName: "Dorsais", equipmentName: "Peso Corporal" },
  { id: 6, name: "Remada Curvada", description: "Trabalha toda a musculatura das costas", primary_muscle_group_id: 2, equipment_id: 1, primaryMuscleGroupName: "Dorsais", equipmentName: "Barra" },
  { id: 7, name: "Remada com Halteres", description: "Remada unilateral com halter", primary_muscle_group_id: 2, equipment_id: 2, primaryMuscleGroupName: "Dorsais", equipmentName: "Halteres" },
  { id: 8, name: "Puxada Frontal", description: "Exercício na polia para dorsais", primary_muscle_group_id: 2, equipment_id: 3, primaryMuscleGroupName: "Dorsais", equipmentName: "Cabo" },
  
  // Exercícios de pernas
  { id: 9, name: "Agachamento Livre", description: "Rei dos exercícios para pernas", primary_muscle_group_id: 3, equipment_id: 1, primaryMuscleGroupName: "Quadríceps", equipmentName: "Barra" },
  { id: 10, name: "Leg Press", description: "Exercício na máquina para pernas", primary_muscle_group_id: 3, equipment_id: 4, primaryMuscleGroupName: "Quadríceps", equipmentName: "Máquina" },
  { id: 11, name: "Levantamento Terra", description: "Exercício completo para posterior", primary_muscle_group_id: 4, equipment_id: 1, primaryMuscleGroupName: "Glúteos", equipmentName: "Barra" },
  { id: 12, name: "Afundo", description: "Exercício unilateral para pernas", primary_muscle_group_id: 3, equipment_id: 2, primaryMuscleGroupName: "Quadríceps", equipmentName: "Halteres" },
  
  // Exercícios de ombros
  { id: 13, name: "Desenvolvimento Militar", description: "Exercício básico para ombros", primary_muscle_group_id: 5, equipment_id: 1, primaryMuscleGroupName: "Deltoides", equipmentName: "Barra" },
  { id: 14, name: "Elevação Lateral", description: "Isolamento para deltoides medial", primary_muscle_group_id: 5, equipment_id: 2, primaryMuscleGroupName: "Deltoides", equipmentName: "Halteres" },
  { id: 15, name: "Elevação Frontal", description: "Isolamento para deltoides anterior", primary_muscle_group_id: 5, equipment_id: 2, primaryMuscleGroupName: "Deltoides", equipmentName: "Halteres" },
  
  // Exercícios de braços
  { id: 16, name: "Rosca Direta", description: "Exercício básico para bíceps", primary_muscle_group_id: 6, equipment_id: 1, primaryMuscleGroupName: "Bíceps", equipmentName: "Barra" },
  { id: 17, name: "Tríceps Testa", description: "Isolamento para tríceps", primary_muscle_group_id: 7, equipment_id: 1, primaryMuscleGroupName: "Tríceps", equipmentName: "Barra" },
  { id: 18, name: "Mergulho", description: "Exercício para tríceps com peso corporal", primary_muscle_group_id: 7, equipment_id: 6, primaryMuscleGroupName: "Tríceps", equipmentName: "Peso Corporal" },
  
  // Exercícios de core
  { id: 19, name: "Prancha", description: "Exercício isométrico para core", primary_muscle_group_id: 8, equipment_id: 6, primaryMuscleGroupName: "Abdominais", equipmentName: "Peso Corporal" },
  { id: 20, name: "Abdominal Supra", description: "Exercício clássico para abdominais", primary_muscle_group_id: 8, equipment_id: 6, primaryMuscleGroupName: "Abdominais", equipmentName: "Peso Corporal" },
  
  // Exercícios funcionais/cardio
  { id: 21, name: "Burpees", description: "Exercício funcional completo", primary_muscle_group_id: 9, equipment_id: 6, primaryMuscleGroupName: "Corpo Todo", equipmentName: "Peso Corporal" },
  { id: 22, name: "Mountain Climbers", description: "Exercício cardio funcional", primary_muscle_group_id: 8, equipment_id: 6, primaryMuscleGroupName: "Abdominais", equipmentName: "Peso Corporal" },
  { id: 23, name: "Corrida Estacionária", description: "Cardio de baixo impacto", primary_muscle_group_id: 10, equipment_id: 6, primaryMuscleGroupName: "Cardio", equipmentName: "Peso Corporal" },
  { id: 24, name: "Agachamento Jump", description: "Exercício pliométrico", primary_muscle_group_id: 3, equipment_id: 6, primaryMuscleGroupName: "Quadríceps", equipmentName: "Peso Corporal" }
];

// Dados mock para rotinas quando o backend não estiver disponível
const mockRoutines: Routine[] = [
  // 1. Push/Pull/Legs Clássico
  {
    id: 1,
    name: "Push/Pull/Legs Clássico",
    title: "Push/Pull/Legs Clássico",
    description: "Divisão clássica de 3 dias alternando empurrar, puxar e pernas. Ideal para ganho de massa muscular e força.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 12,
    division: "Push/Pull/Legs",
    created_at: "2024-01-15T10:30:00Z",
    workouts: [
      {
        id: 1,
        name: "Dia A - Push (Peito, Ombros, Tríceps)",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 1, sets: 4, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 1) },
          { id: 2, sets: 3, reps: 10, restTime: "75s", exercise: mockExercises.find(e => e.id === 2) },
          { id: 3, sets: 4, reps: 10, restTime: "75s", exercise: mockExercises.find(e => e.id === 13) },
          { id: 4, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 14) },
          { id: 5, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 17) },
          { id: 6, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 18) }
        ]
      },
      {
        id: 2,
        name: "Dia B - Pull (Costas e Bíceps)",
        dayOfWeek: "Quarta-feira",
        workoutExercises: [
          { id: 7, sets: 4, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 8, sets: 4, reps: 10, restTime: "75s", exercise: mockExercises.find(e => e.id === 6) },
          { id: 9, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 8) },
          { id: 10, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 7) },
          { id: 11, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 16) }
        ]
      },
      {
        id: 3,
        name: "Dia C - Legs (Pernas Completo)",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 12, sets: 4, reps: 10, restTime: "120s", exercise: mockExercises.find(e => e.id === 9) },
          { id: 13, sets: 4, reps: 8, restTime: "120s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 14, sets: 3, reps: 15, restTime: "90s", exercise: mockExercises.find(e => e.id === 10) },
          { id: 15, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 12) }
        ]
      }
    ]
  },

  // 2. Full Body Iniciante
  {
    id: 2,
    name: "Full Body para Iniciantes",
    title: "Full Body para Iniciantes",
    description: "Treino completo 3x por semana para quem está começando. Foco em movimento básicos e técnica.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 8,
    division: "Full Body",
    created_at: "2024-02-01T14:20:00Z",
    workouts: [
      {
        id: 4,
        name: "Dia A - Full Body Básico",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 16, sets: 3, reps: 10, restTime: "60s", exercise: mockExercises.find(e => e.id === 3) },
          { id: 17, sets: 3, reps: 12, restTime: "90s", exercise: mockExercises.find(e => e.id === 9) },
          { id: 18, sets: 3, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 19, sets: 3, reps: 30, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) }
        ]
      },
      {
        id: 5,
        name: "Dia B - Full Body Intermediário",
        dayOfWeek: "Quarta-feira",
        workoutExercises: [
          { id: 20, sets: 3, reps: 10, restTime: "60s", exercise: mockExercises.find(e => e.id === 13) },
          { id: 21, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 16) },
          { id: 22, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 12) },
          { id: 23, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      },
      {
        id: 6,
        name: "Dia C - Full Body Avançado",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 24, sets: 3, reps: 10, restTime: "60s", exercise: mockExercises.find(e => e.id === 17) },
          { id: 25, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 26, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 7) },
          { id: 27, sets: 3, reps: 8, restTime: "60s", exercise: mockExercises.find(e => e.id === 21) }
        ]
      }
    ]
  },

  // 3. HIIT Queima Gordura
  {
    id: 3,
    name: "HIIT Queima Gordura",
    title: "HIIT Queima Gordura",
    description: "Treino intervalado de alta intensidade 4x por semana. Queime calorias e melhore o condicionamento.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 6,
    division: "HIIT",
    created_at: "2024-02-10T09:15:00Z",
    workouts: [
      {
        id: 7,
        name: "Dia A - HIIT Funcional",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 28, sets: 4, reps: 10, restTime: "30s", exercise: mockExercises.find(e => e.id === 21) },
          { id: 29, sets: 4, reps: 20, restTime: "30s", exercise: mockExercises.find(e => e.id === 22) },
          { id: 30, sets: 4, reps: 15, restTime: "30s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 31, sets: 3, reps: 45, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) }
        ]
      },
      {
        id: 8,
        name: "Dia B - HIIT Cardio",
        dayOfWeek: "Terça-feira",
        workoutExercises: [
          { id: 32, sets: 3, reps: 15, restTime: "30s", exercise: mockExercises.find(e => e.id === 3) },
          { id: 33, sets: 3, reps: 30, restTime: "60s", exercise: mockExercises.find(e => e.id === 23) },
          { id: 34, sets: 4, reps: 12, restTime: "30s", exercise: mockExercises.find(e => e.id === 18) },
          { id: 35, sets: 3, reps: 20, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      },
      {
        id: 9,
        name: "Dia C - HIIT Força",
        dayOfWeek: "Quinta-feira",
        workoutExercises: [
          { id: 36, sets: 4, reps: 8, restTime: "45s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 37, sets: 4, reps: 15, restTime: "30s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 38, sets: 3, reps: 12, restTime: "30s", exercise: mockExercises.find(e => e.id === 1) },
          { id: 39, sets: 3, reps: 8, restTime: "60s", exercise: mockExercises.find(e => e.id === 21) }
        ]
      },
      {
        id: 10,
        name: "Dia D - HIIT Recovery",
        dayOfWeek: "Sábado",
        workoutExercises: [
          { id: 40, sets: 3, reps: 60, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 41, sets: 3, reps: 20, restTime: "45s", exercise: mockExercises.find(e => e.id === 22) },
          { id: 42, sets: 2, reps: 30, restTime: "60s", exercise: mockExercises.find(e => e.id === 23) }
        ]
      }
    ]
  },

  // 4. Upper/Lower Split
  {
    id: 4,
    name: "Upper/Lower Split",
    title: "Upper/Lower Split",
    description: "Divisão 4x por semana alternando superiores e inferiores. Ótimo para força e hipertrofia.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 10,
    division: "Upper/Lower",
    created_at: "2024-02-15T11:00:00Z",
    workouts: [
      {
        id: 11,
        name: "Dia A - Upper Body (Peito Focus)",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 43, sets: 4, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 1) },
          { id: 44, sets: 4, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 6) },
          { id: 45, sets: 3, reps: 10, restTime: "75s", exercise: mockExercises.find(e => e.id === 13) },
          { id: 46, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 16) },
          { id: 47, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 17) }
        ]
      },
      {
        id: 12,
        name: "Dia B - Lower Body (Pernas Completo)",
        dayOfWeek: "Terça-feira",
        workoutExercises: [
          { id: 48, sets: 4, reps: 8, restTime: "120s", exercise: mockExercises.find(e => e.id === 9) },
          { id: 49, sets: 4, reps: 6, restTime: "120s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 50, sets: 3, reps: 15, restTime: "90s", exercise: mockExercises.find(e => e.id === 10) },
          { id: 51, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 12) }
        ]
      },
      {
        id: 13,
        name: "Dia C - Upper Body (Costas Focus)",
        dayOfWeek: "Quinta-feira",
        workoutExercises: [
          { id: 52, sets: 4, reps: 10, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 53, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 2) },
          { id: 54, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 8) },
          { id: 55, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 14) },
          { id: 56, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 18) }
        ]
      },
      {
        id: 14,
        name: "Dia D - Lower Body (Glúteos Focus)",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 57, sets: 4, reps: 12, restTime: "90s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 58, sets: 4, reps: 15, restTime: "75s", exercise: mockExercises.find(e => e.id === 12) },
          { id: 59, sets: 3, reps: 20, restTime: "60s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 60, sets: 3, reps: 45, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) }
        ]
      }
    ]
  },

  // 5. Calistenia Avançada
  {
    id: 5,
    name: "Calistenia Avançada",
    title: "Calistenia Avançada",
    description: "Treino usando apenas peso corporal 5x por semana. Desenvolva força funcional e controle corporal.",
    targetProfileLevel: "Avançado",
    durationWeeks: 16,
    division: "Calistenia",
    created_at: "2024-02-20T16:45:00Z",
    exercises: [
      { id: 31, routine_id: 5, exercise_id: 3, position: 1, sets: 4, reps: 15, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 3) },
      { id: 32, routine_id: 5, exercise_id: 5, position: 2, sets: 4, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 5) },
      { id: 33, routine_id: 5, exercise_id: 18, position: 3, sets: 4, reps: 12, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 18) },
      { id: 34, routine_id: 5, exercise_id: 24, position: 4, sets: 4, reps: 20, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 35, routine_id: 5, exercise_id: 19, position: 5, sets: 3, reps: 60, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 19) },
      { id: 36, routine_id: 5, exercise_id: 21, position: 6, sets: 3, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 21) }
    ]
  },

  // 6. Powerlifting Básico
  {
    id: 6,
    name: "Powerlifting Básico",
    title: "Powerlifting Básico",
    description: "Foque nos 3 levantamentos principais 3x por semana. Desenvolva força máxima nos básicos.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 12,
    division: "Powerlifting",
    created_at: "2024-02-25T08:30:00Z",
    exercises: [
      { id: 37, routine_id: 6, exercise_id: 1, position: 1, sets: 5, reps: 5, rest_seconds: 180, exercise: mockExercises.find(e => e.id === 1) },
      { id: 38, routine_id: 6, exercise_id: 9, position: 2, sets: 5, reps: 5, rest_seconds: 180, exercise: mockExercises.find(e => e.id === 9) },
      { id: 39, routine_id: 6, exercise_id: 11, position: 3, sets: 5, reps: 5, rest_seconds: 180, exercise: mockExercises.find(e => e.id === 11) }
    ]
  },

  // 7. Treino de Definição
  {
    id: 7,
    name: "Definição e Cut",
    title: "Definição e Cut",
    description: "Treino 5x por semana com volume alto e descanso reduzido. Ideal para fase de cutting.",
    targetProfileLevel: "Avançado",
    durationWeeks: 8,
    division: "Cut",
    created_at: "2024-03-01T13:15:00Z",
    exercises: [
      { id: 48, routine_id: 7, exercise_id: 1, position: 1, sets: 4, reps: 15, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 1) },
      { id: 49, routine_id: 7, exercise_id: 6, position: 2, sets: 4, reps: 15, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 6) },
      { id: 50, routine_id: 7, exercise_id: 10, position: 3, sets: 4, reps: 20, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 10) },
      { id: 51, routine_id: 7, exercise_id: 14, position: 4, sets: 3, reps: 15, rest_seconds: 30, exercise: mockExercises.find(e => e.id === 14) },
      { id: 52, routine_id: 7, exercise_id: 21, position: 5, sets: 3, reps: 12, rest_seconds: 30, exercise: mockExercises.find(e => e.id === 21) }
    ]
  },

  // 8. Funcional CrossFit Style
  {
    id: 8,
    name: "Funcional CrossFit Style",
    title: "Funcional CrossFit Style",
    description: "WODs variados 4x por semana. Melhore força, resistência e mobilidade simultaneamente.",
    targetProfileLevel: "Avançado",
    durationWeeks: 10,
    division: "Funcional",
    created_at: "2024-03-05T07:00:00Z",
    exercises: [
      { id: 53, routine_id: 8, exercise_id: 21, position: 1, sets: 5, reps: 15, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 21) },
      { id: 54, routine_id: 8, exercise_id: 11, position: 2, sets: 5, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 11) },
      { id: 55, routine_id: 8, exercise_id: 5, position: 3, sets: 5, reps: 12, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 5) },
      { id: 56, routine_id: 8, exercise_id: 24, position: 4, sets: 4, reps: 20, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 57, routine_id: 8, exercise_id: 22, position: 5, sets: 4, reps: 30, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 22) }
    ]
  },

  // 9. Força para Mulheres
  {
    id: 9,
    name: "Força para Mulheres",
    title: "Força para Mulheres",
    description: "Treino especializado 4x por semana com foco em glúteos, core e membros superiores.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 12,
    division: "Feminino",
    created_at: "2024-03-10T15:20:00Z",
    exercises: [
      { id: 58, routine_id: 9, exercise_id: 11, position: 1, sets: 4, reps: 12, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 11) },
      { id: 59, routine_id: 9, exercise_id: 12, position: 2, sets: 3, reps: 15, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 12) },
      { id: 60, routine_id: 9, exercise_id: 19, position: 3, sets: 3, reps: 45, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 19) },
      { id: 61, routine_id: 9, exercise_id: 20, position: 4, sets: 3, reps: 20, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 20) },
      { id: 62, routine_id: 9, exercise_id: 14, position: 5, sets: 3, reps: 12, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 14) }
    ]
  },

  // 10. Atlético/Esportivo
  {
    id: 10,
    name: "Preparação Atlética",
    title: "Preparação Atlética",
    description: "Treino 4x por semana para atletas. Foco em explosão, agilidade e resistência específica.",
    targetProfileLevel: "Avançado",
    durationWeeks: 14,
    division: "Atlético",
    created_at: "2024-03-15T09:45:00Z",
    exercises: [
      { id: 63, routine_id: 10, exercise_id: 24, position: 1, sets: 4, reps: 12, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 64, routine_id: 10, exercise_id: 21, position: 2, sets: 4, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 21) },
      { id: 65, routine_id: 10, exercise_id: 11, position: 3, sets: 4, reps: 8, rest_seconds: 120, exercise: mockExercises.find(e => e.id === 11) },
      { id: 66, routine_id: 10, exercise_id: 22, position: 4, sets: 3, reps: 30, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 22) },
      { id: 67, routine_id: 10, exercise_id: 5, position: 5, sets: 4, reps: 10, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 5) }
    ]
  },

  // 11. Volume Alemão
  {
    id: 11,
    name: "Volume Training Alemão",
    title: "Volume Training Alemão",
    description: "Método 10x10 clássico 4x por semana. Hipertrofia extrema com volume alto.",
    targetProfileLevel: "Avançado",
    durationWeeks: 6,
    division: "Volume",
    created_at: "2024-03-20T12:00:00Z",
    exercises: [
      { id: 70, routine_id: 11, exercise_id: 1, position: 1, sets: 10, reps: 10, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 1) },
      { id: 71, routine_id: 11, exercise_id: 9, position: 2, sets: 10, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 9) },
      { id: 72, routine_id: 11, exercise_id: 6, position: 3, sets: 10, reps: 10, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 6) },
      { id: 73, routine_id: 11, exercise_id: 13, position: 4, sets: 10, reps: 10, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 13) }
    ]
  },

  // 12. Home Workout
  {
    id: 12,
    name: "Treino em Casa",
    title: "Treino em Casa",
    description: "Exercícios eficazes 5x por semana sem equipamentos. Perfeito para treinar em casa.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 8,
    division: "Home",
    created_at: "2024-03-25T18:30:00Z",
    workouts: [
      {
        id: 15,
        name: "Dia A - Superior (Peito e Tríceps)",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 61, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 3) },
          { id: 62, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 18) },
          { id: 63, sets: 3, reps: 30, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 64, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      },
      {
        id: 16,
        name: "Dia B - Inferior (Pernas e Glúteos)",
        dayOfWeek: "Terça-feira",
        workoutExercises: [
          { id: 65, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 66, sets: 3, reps: 20, restTime: "60s", exercise: mockExercises.find(e => e.id === 12) },
          { id: 67, sets: 3, reps: 45, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 68, sets: 3, reps: 60, restTime: "60s", exercise: mockExercises.find(e => e.id === 23) }
        ]
      },
      {
        id: 17,
        name: "Dia C - Costas e Bíceps",
        dayOfWeek: "Quarta-feira",
        workoutExercises: [
          { id: 69, sets: 3, reps: 8, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 70, sets: 3, reps: 20, restTime: "45s", exercise: mockExercises.find(e => e.id === 22) },
          { id: 71, sets: 3, reps: 60, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 72, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      },
      {
        id: 18,
        name: "Dia D - HIIT Funcional",
        dayOfWeek: "Quinta-feira",
        workoutExercises: [
          { id: 73, sets: 3, reps: 8, restTime: "60s", exercise: mockExercises.find(e => e.id === 21) },
          { id: 74, sets: 3, reps: 20, restTime: "30s", exercise: mockExercises.find(e => e.id === 22) },
          { id: 75, sets: 3, reps: 15, restTime: "30s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 76, sets: 3, reps: 10, restTime: "45s", exercise: mockExercises.find(e => e.id === 3) }
        ]
      },
      {
        id: 19,
        name: "Dia E - Full Body Recovery",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 77, sets: 2, reps: 10, restTime: "60s", exercise: mockExercises.find(e => e.id === 3) },
          { id: 78, sets: 2, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 24) },
          { id: 79, sets: 2, reps: 60, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 80, sets: 2, reps: 30, restTime: "60s", exercise: mockExercises.find(e => e.id === 23) }
        ]
      }
    ]
  },

  // 13. Strongman Iniciante
  {
    id: 13,
    name: "Strongman para Iniciantes",
    title: "Strongman para Iniciantes",
    description: "Introdução ao strongman 3x por semana. Desenvolva força bruta e resistência.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 10,
    division: "Strongman",
    created_at: "2024-03-30T10:15:00Z",
    exercises: [
      { id: 74, routine_id: 13, exercise_id: 11, position: 1, sets: 5, reps: 5, rest_seconds: 180, exercise: mockExercises.find(e => e.id === 11) },
      { id: 75, routine_id: 13, exercise_id: 9, position: 2, sets: 5, reps: 5, rest_seconds: 180, exercise: mockExercises.find(e => e.id === 9) },
      { id: 76, routine_id: 13, exercise_id: 6, position: 3, sets: 4, reps: 8, rest_seconds: 150, exercise: mockExercises.find(e => e.id === 6) },
      { id: 77, routine_id: 13, exercise_id: 12, position: 4, sets: 4, reps: 10, rest_seconds: 120, exercise: mockExercises.find(e => e.id === 12) }
    ]
  },

  // 14. Mobilidade e Flexibilidade
  {
    id: 14,
    name: "Mobilidade e Flexibilidade",
    title: "Mobilidade e Flexibilidade",
    description: "Rotina diária de mobilidade 7x por semana. Melhore amplitude e previna lesões.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 4,
    division: "Mobilidade",
    created_at: "2024-04-01T06:00:00Z",
    exercises: [
      { id: 78, routine_id: 14, exercise_id: 19, position: 1, sets: 3, reps: 45, rest_seconds: 30, exercise: mockExercises.find(e => e.id === 19) },
      { id: 79, routine_id: 14, exercise_id: 20, position: 2, sets: 3, reps: 20, rest_seconds: 30, exercise: mockExercises.find(e => e.id === 20) },
      { id: 100, routine_id: 14, exercise_id: 23, position: 3, sets: 2, reps: 60, rest_seconds: 30, exercise: mockExercises.find(e => e.id === 23) }
    ]
  },

  // 15. Bro Split Clássico
  {
    id: 15,
    name: "Bro Split Clássico",
    title: "Bro Split Clássico",
    description: "Uma parte do corpo por dia, 5x por semana. Método tradicional de bodybuilding.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 12,
    division: "Bro Split",
    created_at: "2024-04-05T14:45:00Z",
    workouts: [
      {
        id: 20,
        name: "Dia A - Peito",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 81, sets: 4, reps: 10, restTime: "75s", exercise: mockExercises.find(e => e.id === 1) },
          { id: 82, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 2) },
          { id: 83, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 4) },
          { id: 84, sets: 3, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 3) }
        ]
      },
      {
        id: 21,
        name: "Dia B - Costas",
        dayOfWeek: "Terça-feira",
        workoutExercises: [
          { id: 85, sets: 4, reps: 10, restTime: "90s", exercise: mockExercises.find(e => e.id === 6) },
          { id: 86, sets: 4, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 8) },
          { id: 87, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 7) },
          { id: 88, sets: 3, reps: 10, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) }
        ]
      },
      {
        id: 22,
        name: "Dia C - Pernas",
        dayOfWeek: "Quarta-feira",
        workoutExercises: [
          { id: 89, sets: 4, reps: 12, restTime: "120s", exercise: mockExercises.find(e => e.id === 9) },
          { id: 90, sets: 4, reps: 10, restTime: "120s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 91, sets: 3, reps: 15, restTime: "90s", exercise: mockExercises.find(e => e.id === 10) },
          { id: 92, sets: 3, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 12) }
        ]
      },
      {
        id: 23,
        name: "Dia D - Ombros",
        dayOfWeek: "Quinta-feira",
        workoutExercises: [
          { id: 93, sets: 4, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 13) },
          { id: 94, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 14) },
          { id: 95, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 15) },
          { id: 96, sets: 3, reps: 30, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) }
        ]
      },
      {
        id: 24,
        name: "Dia E - Braços (Bíceps e Tríceps)",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 97, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 16) },
          { id: 98, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 17) },
          { id: 99, sets: 3, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 18) },
          { id: 100, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      }
    ]
  },

  // 16. Corrida e Resistência
  {
    id: 16,
    name: "Corrida e Resistência",
    title: "Corrida e Resistência",
    description: "Programa 4x por semana combinando corrida e exercícios de resistência cardiovascular.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 16,
    division: "Cardio",
    created_at: "2024-04-10T05:30:00Z",
    exercises: [
      { id: 92, routine_id: 16, exercise_id: 23, position: 1, sets: 3, reps: 20, rest_seconds: 120, exercise: mockExercises.find(e => e.id === 23) },
      { id: 93, routine_id: 16, exercise_id: 24, position: 2, sets: 3, reps: 15, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 94, routine_id: 16, exercise_id: 22, position: 3, sets: 3, reps: 30, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 22) },
      { id: 95, routine_id: 16, exercise_id: 21, position: 4, sets: 2, reps: 10, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 21) }
    ]
  },

  // 17. Idosos Ativos
  {
    id: 17,
    name: "Treino para Idosos Ativos",
    title: "Treino para Idosos Ativos",
    description: "Exercícios seguros 3x por semana focados em equilíbrio, força e qualidade de vida.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 12,
    division: "Sênior",
    created_at: "2024-04-15T09:00:00Z",
    exercises: [
      { id: 96, routine_id: 17, exercise_id: 3, position: 1, sets: 2, reps: 8, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 3) },
      { id: 97, routine_id: 17, exercise_id: 24, position: 2, sets: 2, reps: 10, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 98, routine_id: 17, exercise_id: 19, position: 3, sets: 2, reps: 30, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 19) },
      { id: 99, routine_id: 17, exercise_id: 23, position: 4, sets: 2, reps: 15, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 23) }
    ]
  },

  // 18. Híbrido Força/Cardio
  {
    id: 18,
    name: "Híbrido Força/Cardio",
    title: "Híbrido Força/Cardio",
    description: "Combinação perfeita 4x por semana. Desenvolva força enquanto mantém o cardio.",
    targetProfileLevel: "Intermediário",
    durationWeeks: 10,
    division: "Híbrido",
    created_at: "2024-04-20T16:15:00Z",
    exercises: [
      { id: 101, routine_id: 18, exercise_id: 1, position: 1, sets: 4, reps: 10, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 1) },
      { id: 102, routine_id: 18, exercise_id: 22, position: 2, sets: 3, reps: 20, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 22) },
      { id: 103, routine_id: 18, exercise_id: 9, position: 3, sets: 4, reps: 12, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 9) },
      { id: 104, routine_id: 18, exercise_id: 21, position: 4, sets: 3, reps: 8, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 21) },
      { id: 105, routine_id: 18, exercise_id: 6, position: 5, sets: 3, reps: 12, rest_seconds: 75, exercise: mockExercises.find(e => e.id === 6) }
    ]
  },

  // 19. Reabilitação e Volta aos Treinos
  {
    id: 19,
    name: "Reabilitação Pós-Lesão",
    title: "Reabilitação Pós-Lesão",
    description: "Retorno gradual 3x por semana após lesões. Movimento seguro e progressão controlada.",
    targetProfileLevel: "Iniciante",
    durationWeeks: 8,
    division: "Reabilitação",
    created_at: "2024-04-25T11:30:00Z",
    exercises: [
      { id: 106, routine_id: 19, exercise_id: 3, position: 1, sets: 2, reps: 5, rest_seconds: 90, exercise: mockExercises.find(e => e.id === 3) },
      { id: 107, routine_id: 19, exercise_id: 24, position: 2, sets: 2, reps: 8, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 24) },
      { id: 108, routine_id: 19, exercise_id: 19, position: 3, sets: 2, reps: 20, rest_seconds: 45, exercise: mockExercises.find(e => e.id === 19) },
      { id: 109, routine_id: 19, exercise_id: 23, position: 4, sets: 2, reps: 10, rest_seconds: 60, exercise: mockExercises.find(e => e.id === 23) }
    ]
  },

  // 20. Máxima Hipertrofia
  {
    id: 20,
    name: "Máxima Hipertrofia",
    title: "Máxima Hipertrofia",
    description: "Volume extremo 6x por semana para hipertrofia máxima. Para praticantes experientes.",
    targetProfileLevel: "Avançado",
    durationWeeks: 8,
    division: "Hipertrofia",
    created_at: "2024-04-30T13:45:00Z",
    workouts: [
      {
        id: 101,
        name: "Dia A - Peito e Tríceps Pesado",
        dayOfWeek: "Segunda-feira",
        workoutExercises: [
          { id: 401, sets: 5, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 1) },
          { id: 402, sets: 4, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 2) },
          { id: 403, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 4) },
          { id: 404, sets: 4, reps: 12, restTime: "45s", exercise: mockExercises.find(e => e.id === 17) },
          { id: 405, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 18) }
        ]
      },
      {
        id: 102,
        name: "Dia B - Costas e Bíceps Intenso",
        dayOfWeek: "Terça-feira",
        workoutExercises: [
          { id: 406, sets: 5, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 6) },
          { id: 407, sets: 4, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 8) },
          { id: 408, sets: 4, reps: 10, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 409, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 16) },
          { id: 410, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 7) }
        ]
      },
      {
        id: 103,
        name: "Dia C - Pernas Hipertrofia",
        dayOfWeek: "Quarta-feira",
        workoutExercises: [
          { id: 411, sets: 5, reps: 15, restTime: "90s", exercise: mockExercises.find(e => e.id === 9) },
          { id: 412, sets: 4, reps: 12, restTime: "90s", exercise: mockExercises.find(e => e.id === 11) },
          { id: 413, sets: 4, reps: 20, restTime: "75s", exercise: mockExercises.find(e => e.id === 10) },
          { id: 414, sets: 4, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 12) },
          { id: 415, sets: 3, reps: 60, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) }
        ]
      },
      {
        id: 104,
        name: "Dia D - Ombros e Antebraço",
        dayOfWeek: "Quinta-feira",
        workoutExercises: [
          { id: 416, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 13) },
          { id: 417, sets: 4, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 14) },
          { id: 418, sets: 4, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 15) },
          { id: 419, sets: 3, reps: 30, restTime: "45s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 420, sets: 3, reps: 20, restTime: "30s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      },
      {
        id: 105,
        name: "Dia E - Peito e Braços Volume",
        dayOfWeek: "Sexta-feira",
        workoutExercises: [
          { id: 421, sets: 4, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 2) },
          { id: 422, sets: 4, reps: 12, restTime: "60s", exercise: mockExercises.find(e => e.id === 3) },
          { id: 423, sets: 4, reps: 12, restTime: "45s", exercise: mockExercises.find(e => e.id === 16) },
          { id: 424, sets: 4, reps: 12, restTime: "45s", exercise: mockExercises.find(e => e.id === 17) },
          { id: 425, sets: 3, reps: 15, restTime: "45s", exercise: mockExercises.find(e => e.id === 18) }
        ]
      },
      {
        id: 106,
        name: "Dia F - Costas e Core",
        dayOfWeek: "Sábado",
        workoutExercises: [
          { id: 426, sets: 4, reps: 12, restTime: "75s", exercise: mockExercises.find(e => e.id === 8) },
          { id: 427, sets: 4, reps: 15, restTime: "60s", exercise: mockExercises.find(e => e.id === 7) },
          { id: 428, sets: 3, reps: 10, restTime: "90s", exercise: mockExercises.find(e => e.id === 5) },
          { id: 429, sets: 4, reps: 60, restTime: "30s", exercise: mockExercises.find(e => e.id === 19) },
          { id: 430, sets: 3, reps: 25, restTime: "45s", exercise: mockExercises.find(e => e.id === 20) }
        ]
      }
    ]
  }
];

export const routineService = {
  getAll: async (): Promise<Routine[]> => {
    try {
      const response = await api.get("/routines");
      return response.data as unknown;
    } catch (error) {
      console.log("Backend indisponível, usando dados locais das rotinas");
      return mockRoutines;
    }
  },
  
  getById: async (id: string | number): Promise<Routine> => {
    try {
      const response = await api.get(`/routines/${id}`);
      return response.data as unknown;
    } catch (error) {
      const routine = mockRoutines.find(r => r.id === Number(id));
      if (!routine) {
        throw new Error(`Rotina com ID ${id} não encontrada`);
      }
      return routine;
    }
  },
  
  getDetails: async (id: number): Promise<any> => {
    try {
      const response = await api.get(`/routines/${id}/details`);
      return response.data as unknown;
    } catch (error) {
      const routine = mockRoutines.find(r => r.id === Number(id));
      return routine || null;
    }
  },
  
  create: async (data: Partial<Routine>): Promise<Routine> => {
    try {
      const response = await api.post("/routines", data);
      return response.data as unknown;
    } catch (error) {
      // Mock de criação
      const newRoutine: Routine = {
        id: Date.now(),
        name: data.name || "Nova Rotina",
        title: data.title || data.name || "Nova Rotina",
        description: data.description || "Descrição da nova rotina",
        targetProfileLevel: data.targetProfileLevel || "Iniciante",
        durationWeeks: data.durationWeeks || 4,
        division: data.division || "Personalizada",
        created_at: new Date().toISOString(),
        exercises: []
      };
      mockRoutines.push(newRoutine);
      return newRoutine;
    }
  },
  
  createComplete: async (data: any): Promise<Routine> => {
    try {
      const response = await api.post("/routines/complete", data);
      return response.data as unknown;
    } catch (error) {
      return await routineService.create(data);
    }
  },
  
  update: async (id: string | number, data: Partial<Routine>): Promise<Routine> => {
    try {
      const response = await api.put(`/routines/${id}`, data);
      return response.data as unknown;
    } catch (error) {
      const routineIndex = mockRoutines.findIndex(r => r.id === Number(id));
      if (routineIndex === -1) {
        throw new Error(`Rotina com ID ${id} não encontrada`);
      }
      mockRoutines[routineIndex] = { ...mockRoutines[routineIndex], ...data };
      return mockRoutines[routineIndex];
    }
  },
  
  delete: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/routines/${id}`);
    } catch (error) {
      const routineIndex = mockRoutines.findIndex(r => r.id === Number(id));
      if (routineIndex > -1) {
        mockRoutines.splice(routineIndex, 1);
      }
    }
  },
  
  getPredefined: async (filters = {}): Promise<Routine[]> => {
    try {
      const response = await api.get("/routines/predefined", { params: filters });
      return response.data as unknown;
    } catch (error) {
      return mockRoutines;
    }
  },
  
  start: async (routineId: string | number) => {
    try {
      const response = await api.post(`/user-routines/start/${routineId}`);
      return response.data as unknown;
    } catch (error) {
      return { message: "Rotina iniciada (modo offline)", routineId };
    }
  },
  
  abandon: async (userRoutineId: string | number) => {
    try {
      const response = await api.post(`/user-routines/abandon/${userRoutineId}`);
      return response.data as unknown;
    } catch (error) {
      return { message: "Rotina abandonada (modo offline)", userRoutineId };
    }
  }
};
