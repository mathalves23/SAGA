import { ExerciseRecord } from './recordsService';

// Dados mock de exercícios com histórico
export const mockExerciseHistory = {
  'supino-reto': [
    {
      id: '1',
      date: '2024-12-01',
      sets: [
        { weight: 20, reps: 12 },
        { weight: 20, reps: 10 },
        { weight: 20, reps: 8 }
      ]
    },
    {
      id: '2', 
      date: '2024-12-03',
      sets: [
        { weight: 22, reps: 10 },
        { weight: 22, reps: 8 },
        { weight: 20, reps: 12 }
      ]
    },
    {
      id: '3',
      date: '2024-12-05',
      sets: [
        { weight: 25, reps: 8 },
        { weight: 22, reps: 10 },
        { weight: 20, reps: 12 }
      ]
    }
  ],
  'agachamento': [
    {
      id: '4',
      date: '2024-12-02',
      sets: [
        { weight: 40, reps: 15 },
        { weight: 40, reps: 12 },
        { weight: 35, reps: 15 }
      ]
    },
    {
      id: '5',
      date: '2024-12-04',
      sets: [
        { weight: 45, reps: 12 },
        { weight: 42, reps: 15 },
        { weight: 40, reps: 15 }
      ]
    }
  ],
  'levantamento-terra': [
    {
      id: '6',
      date: '2024-12-01',
      sets: [
        { weight: 60, reps: 8 },
        { weight: 55, reps: 10 },
        { weight: 50, reps: 12 }
      ]
    },
    {
      id: '7',
      date: '2024-12-06',
      sets: [
        { weight: 65, reps: 6 },
        { weight: 60, reps: 8 },
        { weight: 55, reps: 10 }
      ]
    }
  ],
  'desenvolvimento-ombros': [
    {
      id: '8',
      date: '2024-12-02',
      sets: [
        { weight: 15, reps: 12 },
        { weight: 15, reps: 10 },
        { weight: 12, reps: 15 }
      ]
    },
    {
      id: '9',
      date: '2024-12-05',
      sets: [
        { weight: 18, reps: 10 },
        { weight: 16, reps: 12 },
        { weight: 15, reps: 12 }
      ]
    }
  ],
  'rosca-biceps': [
    {
      id: '10',
      date: '2024-12-03',
      sets: [
        { weight: 12, reps: 15 },
        { weight: 12, reps: 12 },
        { weight: 10, reps: 15 }
      ]
    },
    {
      id: '11',
      date: '2024-12-06',
      sets: [
        { weight: 14, reps: 12 },
        { weight: 12, reps: 15 },
        { weight: 12, reps: 12 }
      ]
    }
  ]
};

// Dados mock de recordes do usuário
export const mockUserRecords: ExerciseRecord[] = [
  {
    id: 'record-1',
    exerciseId: 'supino-reto',
    exerciseName: 'Supino Reto',
    recordType: 'WEIGHT',
    weight: 25,
    reps: 8,
    volume: 200,
    date: '2024-12-05T10:30:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-2',
    exerciseId: 'supino-reto',
    exerciseName: 'Supino Reto',
    recordType: 'REPS',
    weight: 20,
    reps: 12,
    volume: 240,
    date: '2024-12-01T09:15:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-3',
    exerciseId: 'agachamento',
    exerciseName: 'Agachamento',
    recordType: 'WEIGHT',
    weight: 45,
    reps: 12,
    volume: 540,
    date: '2024-12-04T11:00:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-4',
    exerciseId: 'agachamento',
    exerciseName: 'Agachamento',
    recordType: 'REPS',
    weight: 40,
    reps: 15,
    volume: 600,
    date: '2024-12-02T10:45:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-5',
    exerciseId: 'levantamento-terra',
    exerciseName: 'Levantamento Terra',
    recordType: 'WEIGHT',
    weight: 65,
    reps: 6,
    volume: 390,
    date: '2024-12-06T08:30:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-6',
    exerciseId: 'levantamento-terra',
    exerciseName: 'Levantamento Terra',
    recordType: 'VOLUME',
    weight: 60,
    reps: 8,
    volume: 480,
    date: '2024-12-01T09:00:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-7',
    exerciseId: 'desenvolvimento-ombros',
    exerciseName: 'Desenvolvimento de Ombros',
    recordType: 'WEIGHT',
    weight: 18,
    reps: 10,
    volume: 180,
    date: '2024-12-05T16:20:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-8',
    exerciseId: 'desenvolvimento-ombros',
    exerciseName: 'Desenvolvimento de Ombros',
    recordType: 'REPS',
    weight: 12,
    reps: 15,
    volume: 180,
    date: '2024-12-02T15:45:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-9',
    exerciseId: 'rosca-biceps',
    exerciseName: 'Rosca Bíceps',
    recordType: 'WEIGHT',
    weight: 14,
    reps: 12,
    volume: 168,
    date: '2024-12-06T17:10:00Z',
    userId: 'user-1'
  },
  {
    id: 'record-10',
    exerciseId: 'rosca-biceps',
    exerciseName: 'Rosca Bíceps',
    recordType: 'REPS',
    weight: 12,
    reps: 15,
    volume: 180,
    date: '2024-12-03T16:30:00Z',
    userId: 'user-1'
  }
];

// Função para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 