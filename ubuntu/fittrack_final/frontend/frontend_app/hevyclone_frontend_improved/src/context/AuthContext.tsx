// src/context/AuthContext.tsx - Versão Simplificada
import React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("saga-auth-token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  const login = async (email: string, password: string) => {
    try {
      // Extrair nome do email ou usar dados de registro se disponível
      let userName = 'Usuário Demo';
      if (email === 'matheus.aalves@hotmail.com') {
        userName = 'Matheus Alves';
      } else {
        // Extrair nome do email (parte antes do @)
        const emailPart = email.split('@')[0];
        userName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
      }
      
      // Verificar se há dados de perfil salvos
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name && parsed.name !== 'mathalves') {
            userName = parsed.name;
          }
        } catch (e) {
          console.log('Erro ao carregar nome do perfil salvo');
        }
      }
      
      // Simulação de login por enquanto
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: userName,
          email: email,
          role: 'USER'
        }
      };

      setToken(mockResponse.token);
      localStorage.setItem("saga-auth-token", mockResponse.token);
      setUser(mockResponse.user);
      localStorage.setItem("saga-user", JSON.stringify(mockResponse.user));
      
      // Usar window.location para redirecionamento quando necessário
      // O redirecionamento será tratado pelos ProtectedRoute/PublicRoute
    } catch (error) {
    console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("saga-auth-token");
    localStorage.removeItem("saga-refresh-token");
    localStorage.removeItem("saga-user");
    setToken(null);
    setUser(null);
    
    // Usar window.location para redirecionamento
    window.location.href = '/login';
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulação de registro por enquanto
      // Fazer login automaticamente após registro
      await login(email, password);
    } catch (error) {
    console.error("Erro no registro:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Inicializando autenticação...");
      const savedToken = localStorage.getItem("saga-auth-token");
      const savedUser = localStorage.getItem("saga-user");
      
      console.log("Token salvo:", !!savedToken);
      console.log("Usuário salvo:", !!savedUser);
      
      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log("Dados do usuário carregados:", parsedUser.email);
          
          // Corrigir email incorreto se existir
          if (parsedUser.email === 'usuario@saga.com') {
            parsedUser.email = 'matheus.aalves@hotmail.com';
            parsedUser.name = 'Matheus Alves';
            localStorage.setItem("saga-user", JSON.stringify(parsedUser));
          }
          
          // Verificar se há dados de perfil mais recentes
          const savedProfile = localStorage.getItem('user_profile');
          if (savedProfile) {
            try {
              const profileData = JSON.parse(savedProfile);
              // Corrigir email no perfil também
              if (profileData.email === 'usuario@saga.com') {
                profileData.email = 'matheus.aalves@hotmail.com';
                localStorage.setItem('user_profile', JSON.stringify(profileData));
              }
              if (profileData.name && profileData.name !== 'mathalves') {
                parsedUser.name = profileData.name;
                // Atualizar o localStorage do user também
                localStorage.setItem("saga-user", JSON.stringify(parsedUser));
              }
            } catch (e) {
              console.log('Erro ao carregar dados do perfil para sincronizar');
            }
          }
          
          setToken(savedToken);
          setUser(parsedUser);
          console.log("Estado de autenticação definido");
        } catch (error) {
    console.error("Erro ao carregar dados salvos:", error);
          localStorage.removeItem("saga-auth-token");
          localStorage.removeItem("saga-user");
        }
      } else {
        console.log("Nenhum token/usuário salvo encontrado");
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        isAdmin,
        login,
        logout,
        user,
        setUser,
        loading,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  }
  return context;
};

export type { AuthContextType };
