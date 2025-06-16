import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api'; // Mesmo backend da web

class AuthService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Mock temporário até conectar com backend real
      const mockResponse: AuthResponse = {
        token: `mobile-token-${Date.now()}`,
        refreshToken: `mobile-refresh-${Date.now()}`,
        user: {
          id: '1',
          name: email === 'matheus.aalves@hotmail.com' ? 'Matheus Alves' : 'Usuário Demo',
          email: email,
          role: 'USER',
          preferences: {
            theme: 'light',
            language: 'pt',
            notifications: true,
            units: 'metric',
          },
        },
        expiresIn: 3600,
      };

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockResponse;

      // TODO: Substituir por chamada real quando backend estiver pronto
      // const response = await this.client.post('/auth/login', { email, password });
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      // Mock temporário
      const mockResponse: AuthResponse = {
        token: `mobile-token-${Date.now()}`,
        refreshToken: `mobile-refresh-${Date.now()}`,
        user: {
          id: Date.now().toString(),
          name,
          email,
          role: 'USER',
          preferences: {
            theme: 'light',
            language: 'pt',
            notifications: true,
            units: 'metric',
          },
        },
        expiresIn: 3600,
      };

      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return mockResponse;

      // TODO: Substituir por chamada real
      // const response = await this.client.post('/auth/register', { name, email, password });
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Mock temporário
      const mockResponse: AuthResponse = {
        token: `mobile-token-refreshed-${Date.now()}`,
        refreshToken: `mobile-refresh-refreshed-${Date.now()}`,
        user: {
          id: '1',
          name: 'Matheus Alves',
          email: 'matheus.aalves@hotmail.com',
          role: 'USER',
          preferences: {
            theme: 'light',
            language: 'pt',
            notifications: true,
            units: 'metric',
          },
        },
        expiresIn: 3600,
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;

      // TODO: Substituir por chamada real
      // const response = await this.client.post('/auth/refresh', { refreshToken });
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar token de acesso.');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      // Mock temporário
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return { message: 'E-mail de recuperação enviado com sucesso!' };

      // TODO: Substituir por chamada real
      // const response = await this.client.post('/auth/forgot-password', { email });
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao solicitar recuperação de senha.');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Mock temporário
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return { message: 'Senha alterada com sucesso!' };

      // TODO: Substituir por chamada real
      // const response = await this.client.post('/auth/reset-password', { token, newPassword });
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao redefinir senha.');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      // Mock temporário
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedUser: User = {
        id: '1',
        name: userData.name || 'Matheus Alves',
        email: userData.email || 'matheus.aalves@hotmail.com',
        role: 'USER',
        avatar: userData.avatar,
        preferences: userData.preferences || {
          theme: 'light',
          language: 'pt',
          notifications: true,
          units: 'metric',
        },
      };

      return updatedUser;

      // TODO: Substituir por chamada real
      // const response = await this.client.put('/auth/profile', userData);
      // return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar perfil.');
    }
  }
}

export const authService = new AuthService(); 