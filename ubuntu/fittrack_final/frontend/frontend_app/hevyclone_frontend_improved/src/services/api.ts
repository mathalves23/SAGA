// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { User } from "../types/user";

// Tipos de resposta da API
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

// Configuração da API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

class ApiService {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação
        const token = localStorage.getItem('saga-auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar request ID para debugging
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Adicionar timestamp
        config.headers['X-Timestamp'] = new Date().toISOString();

        // Log da requisição em desenvolvimento
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data as unknown,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (!error.response) {
          return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
        }

        // Handle specific error codes
        const errorMessage = this.getErrorMessage(error);
        
        if (import.meta.env.DEV) {
          console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: errorMessage,
          });
        }

        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = this.performTokenRefresh();
    
    try {
      const newToken = await this.refreshTokenPromise;
      this.refreshTokenPromise = null;
      return newToken;
    } catch (error) {
      this.refreshTokenPromise = null;
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('saga-refresh-token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data as unknown;
    
    localStorage.setItem('saga-auth-token', accessToken);
    localStorage.setItem('saga-refresh-token', newRefreshToken);

    return accessToken;
  }

  private handleAuthError() {
    localStorage.removeItem('saga-auth-token');
    localStorage.removeItem('saga-refresh-token');
    localStorage.removeItem('saga-user');
    
    // Redirecionar para login
    window.location.href = '/login';
  }

  private getErrorMessage(error: AxiosError): string {
    const response = error.response;
    
    if (!response) {
      return 'Erro de conexão';
    }

    const data = response.data as unknown as any;
    
    // Mensagens específicas por status
    const statusMessages: Record<number, string> = {
      400: 'Dados inválidos',
      401: 'Não autorizado',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      409: 'Conflito nos dados',
      429: 'Muitas tentativas. Tente novamente em alguns minutos',
      500: 'Erro interno do servidor',
      502: 'Serviço temporariamente indisponível',
      503: 'Serviço em manutenção',
    };

    // Tentar extrair mensagem da resposta
    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return typeof data.error === 'string' ? data.error : data.error.message;
    }

    // Usar mensagem padrão por status
    return statusMessages[response.status] || 'Erro desconhecido';
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data as unknown.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data as unknown.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data as unknown.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data as unknown.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data as unknown.data;
  }

  // Upload de arquivos
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data as unknown.data;
  }

  // Batch requests
  async batch<T>(requests: Array<() => Promise<any>>): Promise<T[]> {
    const results = await Promise.allSettled(requests.map(req => req()));
    
    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Batch request ${index} failed:`, result.reason);
        throw result.reason;
      }
    });
  }

  // Retry logic
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = API_CONFIG.retryAttempts
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Não fazer retry para erros 4xx (client errors)
        if (error instanceof Error && error.message.includes('4')) {
          break;
        }

        // Aguardar antes da próxima tentativa
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.retryDelay * attempt)
        );
      }
    }

    throw lastError!;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Instância singleton
export const apiService = new ApiService();

// API Endpoints específicos do SAGA
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; password: string }) =>
    apiService.post('/auth/register', userData),
  
  logout: () =>
    apiService.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    apiService.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiService.post('/auth/reset-password', { token, password }),
  
  refreshToken: () =>
    apiService.post('/auth/refresh'),
};

export const userAPI = {
  getProfile: () =>
    apiService.get('/user/profile'),
  
  updateProfile: (data: any) =>
    apiService.put('/user/profile', data),
  
  uploadAvatar: (file: File, onProgress?: (progress: number) => void) =>
    apiService.uploadFile('/user/avatar', file, onProgress),
  
  getSettings: () =>
    apiService.get('/user/settings'),
  
  updateSettings: (settings: any) =>
    apiService.put('/user/settings', settings),
};

export const workoutAPI = {
  getWorkouts: (params?: any) =>
    apiService.get('/workouts', params),
  
  getWorkout: (id: string) =>
    apiService.get(`/workouts/${id}`),
  
  createWorkout: (workout: any) =>
    apiService.post('/workouts', workout),
  
  updateWorkout: (id: string, workout: any) =>
    apiService.put(`/workouts/${id}`, workout),
  
  deleteWorkout: (id: string) =>
    apiService.delete(`/workouts/${id}`),
  
  startWorkout: (id: string) =>
    apiService.post(`/workouts/${id}/start`),
  
  finishWorkout: (id: string, data: any) =>
    apiService.post(`/workouts/${id}/finish`, data),
};

export const exerciseAPI = {
  getExercises: (params?: any) =>
    apiService.get('/exercises', params),
  
  getExercise: (id: string) =>
    apiService.get(`/exercises/${id}`),
  
  createExercise: (exercise: any) =>
    apiService.post('/exercises', exercise),
  
  updateExercise: (id: string, exercise: any) =>
    apiService.put(`/exercises/${id}`, exercise),
  
  deleteExercise: (id: string) =>
    apiService.delete(`/exercises/${id}`),
  
  getCategories: () =>
    apiService.get('/exercises/categories'),
  
  getEquipment: () =>
    apiService.get('/exercises/equipment'),
};

export const progressAPI = {
  getStats: (period?: string) =>
    apiService.get('/progress/stats', { period }),
  
  getWeightHistory: () =>
    apiService.get('/progress/weight'),
  
  addWeightEntry: (weight: number, date: string) =>
    apiService.post('/progress/weight', { weight, date }),
  
  getAchievements: () =>
    apiService.get('/progress/achievements'),
  
  getGoals: () =>
    apiService.get('/progress/goals'),
  
  createGoal: (goal: any) =>
    apiService.post('/progress/goals', goal),
  
  updateGoal: (id: string, goal: any) =>
    apiService.put(`/progress/goals/${id}`, goal),
};

export const socialAPI = {
  getFeed: (params?: any) =>
    apiService.get('/social/feed', params),
  
  getFollowers: (userId?: string) =>
    apiService.get(`/social/followers/${userId || 'me'}`),
  
  getFollowing: (userId?: string) =>
    apiService.get(`/social/following/${userId || 'me'}`),
  
  followUser: (userId: string) =>
    apiService.post(`/social/follow/${userId}`),
  
  unfollowUser: (userId: string) =>
    apiService.delete(`/social/follow/${userId}`),
  
  likePost: (postId: string) =>
    apiService.post(`/social/posts/${postId}/like`),
  
  commentPost: (postId: string, comment: string) =>
    apiService.post(`/social/posts/${postId}/comments`, { comment }),
  
  shareWorkout: (workoutId: string, caption?: string) =>
    apiService.post('/social/share', { workoutId, caption }),
};

export const notificationAPI = {
  getNotifications: (params?: any) =>
    apiService.get('/notifications', params),
  
  markAsRead: (id: string) =>
    apiService.patch(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    apiService.patch('/notifications/read-all'),
  
  getSettings: () =>
    apiService.get('/notifications/settings'),
  
  updateSettings: (settings: any) =>
    apiService.put('/notifications/settings', settings),
  
  subscribe: (subscription: any) =>
    apiService.post('/notifications/subscribe', subscription),
  
  unsubscribe: () =>
    apiService.delete('/notifications/subscribe'),
};

// Export client para uso direto quando necessário
export { apiService as default };
