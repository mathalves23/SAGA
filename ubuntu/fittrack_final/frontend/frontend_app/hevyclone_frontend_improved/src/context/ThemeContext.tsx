import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Padrão escuro

  useEffect(() => {
    // Carregar tema salvo ou usar escuro como padrão
    const savedTheme = localStorage.getItem('saga-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema no documento
    const root = document.documentElement;
    
    // Remover classe anterior
    root.classList.remove('light', 'dark');
    
    // Adicionar nova classe e atributo
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    
    // Salvar no localStorage
    localStorage.setItem('saga-theme', theme);
    
    // Log para debug
    console.log('Tema aplicado:', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Alternando tema de', prevTheme, 'para', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa estar dentro de <ThemeProvider>');
  }
  return context;
}; 