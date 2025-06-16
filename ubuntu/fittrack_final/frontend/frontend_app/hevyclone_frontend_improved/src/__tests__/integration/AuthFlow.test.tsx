import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';

// Mock básico do App para testar fluxo de autenticação
const MockApp = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);
  const [error, setError] = React.useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      if (email === 'teste@exemplo.com' && password === 'senha123') {
        setUser({ name: 'Usuário Teste', email });
        setIsLoggedIn(true);
        localStorage.setItem('saga-auth-token', 'mock-token-123');
        setError('');
      } else {
        setError('Credenciais inválidas');
      }
    } catch {
      setError('Erro de conexão');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('saga-auth-token');
  };

  if (isLoggedIn && user) {
    return (
      <div>
        <h1>Feed</h1>
        <p>Bem-vindo, {user.name}!</p>
        <button onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        handleLogin(formData.get('email') as string, formData.get('password') as string);
      }}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Fluxo de Autenticação - Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('deve realizar fluxo completo de login com sucesso', async () => {
    render(<MockApp />);

    // Verificar se está na página de login
    expect(screen.getByText('Login')).toBeInTheDocument();

    // Preencher formulário de login
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });

    // Submeter formulário
    fireEvent.click(loginButton);

    // Verificar se o login foi processado
    await waitFor(() => {
      expect(screen.getByText('Feed')).toBeInTheDocument();
      expect(screen.getByText('Bem-vindo, Usuário Teste!')).toBeInTheDocument();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('saga-auth-token', 'mock-token-123');
  });

  it('deve exibir erro quando login falha', async () => {
    render(<MockApp />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(loginButton);

    // Verificar se o erro é exibido
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('deve realizar logout e limpar estado', async () => {
    render(<MockApp />);

    // Fazer login primeiro
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Feed')).toBeInTheDocument();
    });

    // Fazer logout
    const logoutButton = screen.getByRole('button', { name: /sair/i });
    fireEvent.click(logoutButton);

    // Verificar se voltou para a tela de login
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('saga-auth-token');
  });

  it('deve manter estado durante interações múltiplas', async () => {
    render(<MockApp />);

    // Tentar login incorreto
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    // Corrigir e fazer login correto
    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Feed')).toBeInTheDocument();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('saga-auth-token', 'mock-token-123');
  });

  it('deve validar campos obrigatórios antes de submeter', async () => {
    render(<MockApp />);

    const loginButton = screen.getByRole('button', { name: /entrar/i });
    
    // Tentar submeter sem preencher campos
    fireEvent.click(loginButton);

    // HTML5 validation deve impedir submit
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeRequired();
    
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordInput).toBeRequired();
  });

  it('deve lidar com múltiplos estados de erro', async () => {
    render(<MockApp />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });

    // Primeiro erro
    fireEvent.change(emailInput, { target: { value: 'erro1@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    // Segundo erro - deve limpar o erro anterior
    fireEvent.change(emailInput, { target: { value: 'erro2@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'outrasenha' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    // Sucesso - deve limpar erro
    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Feed')).toBeInTheDocument();
      expect(screen.queryByText('Credenciais inválidas')).not.toBeInTheDocument();
    });
  });
}); 