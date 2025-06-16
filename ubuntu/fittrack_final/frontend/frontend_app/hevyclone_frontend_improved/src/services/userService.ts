// src/services/userService.ts
import api from "./api";
import { User } from "../types/user";

// Chave para armazenar dados do perfil no localStorage
const PROFILE_STORAGE_KEY = 'user_profile';

// Função para carregar dados do localStorage
const loadProfileFromStorage = (): any => {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Erro ao carregar perfil do localStorage:', error);
    return null;
  }
};

// Função para salvar dados no localStorage
const saveProfileToStorage = (profile: any): void => {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Erro ao salvar perfil no localStorage:', error);
  }
};

// Dados mock para usuário quando o backend não estiver disponível
const getDefaultProfile = () => {
  const storedProfile = loadProfileFromStorage();
  if (storedProfile) {
    // Corrigir email incorreto se existir
    if (storedProfile.email === 'usuario@saga.com') {
      storedProfile.email = 'matheus.aalves@hotmail.com';
      saveProfileToStorage(storedProfile);
    }
    return storedProfile;
  }
  
  return {
    id: "1",
    username: "usuario_saga",
    email: "matheus.aalves@hotmail.com",
    name: "Matheus Alves",
    full_name: "Matheus Alves",
    bio: "Apaixonado por fitness e vida saudável",
    height: "",
    weight: "",
    age: "",
    fitnessGoal: "",
    profile_image_url: "",
    profileImage: "",
    role: "USER"
  };
};

let mockUser = getDefaultProfile();

const mockStats = {
  totalWorkouts: 15,
  totalExercises: 45,
  totalWeight: 12500,
  currentStreak: 5,
  bestStreak: 12,
  personalRecords: 8
};

const mockPersonalRecords = [
  { exercise: "Supino Reto", weight: 80, date: "2024-12-01" },
  { exercise: "Agachamento", weight: 100, date: "2024-11-28" },
  { exercise: "Levantamento Terra", weight: 120, date: "2024-11-25" }
];

const mockFriends = [
  { id: 2, name: "João Silva", avatar: "/avatars/joao.jpg", status: "ativo" },
  { id: 3, name: "Maria Santos", avatar: "/avatars/maria.jpg", status: "ativo" },
  { id: 4, name: "Pedro Costa", avatar: "/avatars/pedro.jpg", status: "offline" }
];

const mockPendingRequests = [
  { id: 5, name: "Ana Oliveira", avatar: "/avatars/ana.jpg", sentAt: "2024-12-05T14:30:00Z" }
];

export const userService = {
  getProfile: async (): Promise<any> => {
    try {
      const response = await api.get("/users/profile");
      const profile = response.data as unknown;
      saveProfileToStorage(profile);
      return profile;
    } catch (error) {
      console.log("Backend indisponível, usando dados locais do usuário");
      return mockUser;
    }
  },
  
  updateProfile: async (profileData: any): Promise<any> => {
    try {
      const response = await api.put("/users/profile", profileData);
      const updatedProfile = response.data as unknown;
      saveProfileToStorage(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.log("Backend indisponível, salvando perfil localmente");
      // Atualiza dados mock localmente
      const updatedUser = { ...mockUser, ...profileData };
      mockUser = updatedUser;
      saveProfileToStorage(updatedUser);
      return updatedUser;
    }
  },
  
  getStats: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/stats/progress`);
      return response.data as unknown;
    } catch (error) {
      return mockStats;
    }
  },
  
  updateUserInfo: async (userId: number, data: Partial<User>) => {
    try {
      const response = await api.put(`/users/${userId}`, data);
      return response.data as unknown;
    } catch (error) {
      return { ...mockUser, ...data };
    }
  },
  
  getPersonalRecords: async () => {
    try {
      const response = await api.get("/users/personal-records");
      return response.data as unknown;
    } catch (error) {
      return mockPersonalRecords;
    }
  },
  
  getFriends: async (userId: number) => {
    try {
      const response = await api.get(`/friends/${userId}`);
      return response.data as unknown;
    } catch (error) {
      return mockFriends;
    }
  },
  
  getPendingRequests: async (userId: number) => {
    try {
      const response = await api.get(`/friends/pending/received/${userId}`);
      return response.data as unknown;
    } catch (error) {
      return mockPendingRequests;
    }
  },
  
  acceptFriend: async (friendshipId: number) => {
    try {
      const response = await api.post(`/friends/accept/${friendshipId}`);
      return response.data as unknown;
    } catch (error) {
      return { message: "Amizade aceita (modo offline)", friendshipId };
    }
  }
};
