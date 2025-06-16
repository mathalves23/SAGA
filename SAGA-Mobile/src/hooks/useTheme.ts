import { useContext } from 'react';
import { Appearance } from 'react-native';

// Definir cores do tema
const lightTheme = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#ffffff',
  surface: '#f9fafb',
  card: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const darkTheme = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#111827',
  surface: '#1f2937',
  card: '#374151',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#4b5563',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const useTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
    theme: isDark ? 'dark' : 'light'
  };
}; 