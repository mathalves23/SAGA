import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('saga_token');
      const userData = await AsyncStorage.getItem('saga_user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      await SecureStore.setItemAsync('saga_token', response.token);
      await SecureStore.setItemAsync('saga_refresh_token', response.refreshToken);
      await AsyncStorage.setItem('saga_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.register(name, email, password);
      
      await SecureStore.setItemAsync('saga_token', response.token);
      await SecureStore.setItemAsync('saga_refresh_token', response.refreshToken);
      await AsyncStorage.setItem('saga_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      await SecureStore.deleteItemAsync('saga_token');
      await SecureStore.deleteItemAsync('saga_refresh_token');
      await AsyncStorage.removeItem('saga_user');
      
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = await SecureStore.getItemAsync('saga_refresh_token');
      if (!refreshTokenValue) throw new Error('No refresh token');

      const response = await authService.refreshToken(refreshTokenValue);
      
      await SecureStore.setItemAsync('saga_token', response.token);
      await SecureStore.setItemAsync('saga_refresh_token', response.refreshToken);
      await AsyncStorage.setItem('saga_user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 