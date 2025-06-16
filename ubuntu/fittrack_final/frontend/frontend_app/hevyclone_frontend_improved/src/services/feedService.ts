// src/services/feedService.ts
import api from "./api";
import { FeedDTO } from "../types/feed";

// Dados mock para feed quando o backend não estiver disponível
const mockFeedItems: FeedDTO[] = [
  {
    workoutId: 1,
    userId: 1,
    friendName: "João Silva",
    workoutDate: "2024-12-06T10:30:00Z",
    exercises: [
      { exerciseName: "Supino Reto", totalReps: 32, maxWeight: 70 },
      { exerciseName: "Desenvolvimento Ombros", totalReps: 37, maxWeight: 40 },
      { exerciseName: "Tríceps Pulley", totalReps: 39, maxWeight: 30 }
    ],
    achievements: [
      { title: "Primeiro treino da semana", icon: "🎯", date: "2024-12-06T10:30:00Z" }
    ],
    challenges: [],
    rankings: [
      { metric: "Volume Total", value: 1250 }
    ]
  },
  {
    workoutId: 2,
    userId: 2,
    friendName: "Maria Santos",
    workoutDate: "2024-12-06T08:15:00Z",
    exercises: [
      { exerciseName: "Supino Reto", totalReps: 24, maxWeight: 80 },
      { exerciseName: "Leg Press", totalReps: 45, maxWeight: 120 }
    ],
    achievements: [
      { title: "Novo recorde pessoal", icon: "🏆", date: "2024-12-06T08:15:00Z" },
      { title: "80kg no Supino", icon: "💪", date: "2024-12-06T08:15:00Z" }
    ],
    challenges: [],
    rankings: [
      { metric: "Peso Máximo", value: 80 }
    ]
  },
  {
    workoutId: 3,
    userId: 3,
    friendName: "Pedro Costa",
    workoutDate: "2024-12-05T16:45:00Z",
    exercises: [
      { exerciseName: "Burpees", totalReps: 50, maxWeight: 0 },
      { exerciseName: "Mountain Climbers", totalReps: 100, maxWeight: 0 },
      { exerciseName: "Jump Squats", totalReps: 60, maxWeight: 0 }
    ],
    achievements: [
      { title: "Queimou 300 calorias", icon: "🔥", date: "2024-12-05T16:45:00Z" }
    ],
    challenges: [
      { title: "Desafio HIIT", challengerName: "Pedro Costa", opponentName: "Você", deadline: "2024-12-15T23:59:59Z", accepted: false }
    ],
    rankings: [
      { metric: "Calorias Queimadas", value: 300 }
    ]
  }
];

export const feedService = {
  getFeed: async (): Promise<FeedDTO[]> => {
    try {
      const response = await api.get("/feed");
      return response.data as unknown;
    } catch (error) {
      console.log("Backend indisponível, usando dados locais do feed");
      return mockFeedItems;
    }
  },
  
  getDiscoverFeed: async (): Promise<FeedDTO[]> => {
    try {
      const response = await api.get("/feed/discover");
      return response.data as unknown;
    } catch (error) {
      // Retorna uma versão filtrada dos dados mock para discover
      return mockFeedItems.filter(item => item.achievements.length > 0 || item.rankings.some(r => r.value > 50));
    }
  },
  
  saveWorkout: async (userId: number, workoutId: number) => {
    try {
      const response = await api.post("/feed/interactions/save-workout", { userId, workoutId });
      return response.data as unknown;
    } catch (error) {
      return { message: "Treino salvo (modo offline)", userId, workoutId };
    }
  },
  
  followUser: async (userId: number, followeeId: number) => {
    try {
      const response = await api.post("/feed/interactions/follow", { userId, followeeId });
      return response.data as unknown;
    } catch (error) {
      return { message: "Usuário seguido (modo offline)", userId, followeeId };
    }
  },
  
  comment: async (payload: { 
    userId: number; 
    workoutId: number; 
    comment: string; 
    parentCommentId?: number 
  }) => {
    try {
      const response = await api.post("/feed/interactions/comment", payload);
      return response.data as unknown;
    } catch (error) {
      return { 
        id: Date.now(),
        message: "Comentário adicionado (modo offline)", 
        ...payload,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  getComments: async (workoutId: number) => {
    try {
      const response = await api.get(`/feed/interactions/comments/${workoutId}`);
      return response.data as unknown;
    } catch (error) {
      // Retorna comentários mock
      return [
        {
          id: 1,
          user: { name: "Ana", avatar: "/avatars/ana.jpg" },
          text: "Parabéns pelo treino! 👏",
          timestamp: "2024-12-06T11:00:00Z"
        },
        {
          id: 2,
          user: { name: "Carlos", avatar: "/avatars/carlos.jpg" },
          text: "Inspirador! Vou tentar essa rotina.",
          timestamp: "2024-12-06T11:15:00Z"
        }
      ];
    }
  },
  
  likeItem: async (userId: number, itemId: number, itemType: 'workout' | 'routine' | 'comment') => {
    try {
      const response = await api.post("/feed/interactions/like", { 
        userId, 
        itemId, 
        itemType 
      });
      return response.data as unknown;
    } catch (error) {
      // No FeedDTO não temos stats, então apenas retornamos sucesso
      return { message: "Like adicionado (modo offline)", userId, itemId, itemType };
    }
  },
  
  unlikeItem: async (userId: number, itemId: number, itemType: 'workout' | 'routine' | 'comment') => {
    try {
      const response = await api.post("/feed/interactions/unlike", { 
        userId, 
        itemId, 
        itemType 
      });
      return response.data as unknown;
    } catch (error) {
      // No FeedDTO não temos stats, então apenas retornamos sucesso
      return { message: "Like removido (modo offline)", userId, itemId, itemType };
    }
  }
};
