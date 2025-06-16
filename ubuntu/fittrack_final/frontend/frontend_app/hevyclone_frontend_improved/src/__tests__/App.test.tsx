import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock do react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

// Mock de todas as páginas lazy-loaded para evitar erros
vi.mock('../pages/auth/LoginPage', () => ({
  __esModule: true,
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../pages/auth/RegisterPage', () => ({
  __esModule: true,
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock('../pages/feed/FeedPage', () => ({
  __esModule: true,
  default: () => <div data-testid="feed-page">Feed Page</div>,
}));

// Mock do Sidebar
vi.mock('../components/layout/Sidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

// Mock do LoadingSpinner
vi.mock('../components/ui/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock do contexto de autenticação
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    loading: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock do ThemeProvider
vi.mock('../hooks/useTheme', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

describe('App Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
    // Verificamos se não há erro de renderização
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  it('should render login page when not authenticated', async () => {
    await act(async () => {
      render(<App />);
    });
    // Como o usuário não está autenticado, deve renderizar a página de login
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
}); 