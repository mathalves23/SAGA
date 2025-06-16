import React, { createContext, useContext, useEffect, useState } from 'react';

// Tipos
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTheme: 'light' | 'dark';
}

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('saga-theme');
    return (saved as Theme) || 'system';
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      let resolvedTheme: 'light' | 'dark';

      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolvedTheme = theme;
      }

      setCurrentTheme(resolvedTheme);
      
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('saga-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Componente de Toggle
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'dropdown' | 'switch';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabels = true,
  size = 'md',
  variant = 'button'
}) => {
  const { theme, currentTheme, setTheme } = useTheme();

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        className={`${buttonSizes[size]} rounded-lg hover:bg-[#2d2d30] transition-colors flex items-center gap-2`}
        aria-label={`Alternar para tema ${currentTheme === 'dark' ? 'claro' : 'escuro'}`}
      >
        {currentTheme === 'dark' ? (
          <MoonIcon className={`${iconSizes[size]} text-blue-400`} />
        ) : (
          <SunIcon className={`${iconSizes[size]} text-yellow-500`} />
        )}
        
        {showLabels && (
          <span className="text-sm text-[#8b8b8b]">
            {currentTheme === 'dark' ? 'Escuro' : 'Claro'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    const [isOpen, setIsOpen] = useState(false);

    const themeOptions = [
      { value: 'light', label: 'Claro', icon: SunIcon },
      { value: 'dark', label: 'Escuro', icon: MoonIcon },
      { value: 'system', label: 'Sistema', icon: ComputerDesktopIcon }
    ];

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${buttonSizes[size]} rounded-lg hover:bg-[#2d2d30] transition-colors flex items-center gap-2`}
          aria-label="Selecionar tema"
        >
          {currentTheme === 'dark' ? (
            <MoonIcon className={`${iconSizes[size]} text-blue-400`} />
          ) : (
            <SunIcon className={`${iconSizes[size]} text-yellow-500`} />
          )}
          
          {showLabels && (
            <span className="text-sm text-[#8b8b8b]">Tema</span>
          )}
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 bg-[#1a1a1b] border border-[#2d2d30] rounded-lg shadow-xl z-20 min-w-32">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value as Theme);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-[#2d2d30] flex items-center gap-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      theme === option.value ? 'text-purple-400' : 'text-[#8b8b8b]'
                    }`}
                  >
                    <Icon className={iconSizes[size]} />
                    {option.label}
                    {theme === option.value && (
                      <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  // Variant: button (default)
  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className={`${buttonSizes[size]} rounded-lg hover:bg-[#2d2d30] transition-all duration-200 flex items-center gap-2 group`}
      aria-label={`Alternar para tema ${currentTheme === 'dark' ? 'claro' : 'escuro'}`}
    >
      <div className="relative">
        {currentTheme === 'dark' ? (
          <MoonIcon className={`${iconSizes[size]} text-blue-400 group-hover:text-blue-300 transition-colors`} />
        ) : (
          <SunIcon className={`${iconSizes[size]} text-yellow-500 group-hover:text-yellow-400 transition-colors`} />
        )}
        
        {/* Efeito de transição */}
        <div className={`absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-10 transition-opacity`} />
      </div>
      
      {showLabels && (
        <span className="text-sm text-[#8b8b8b] group-hover:text-white transition-colors">
          {currentTheme === 'dark' ? 'Escuro' : 'Claro'}
        </span>
      )}
    </button>
  );
};

// Hook para classes CSS dinâmicas baseadas no tema
export const useThemeClasses = () => {
  const { currentTheme } = useTheme();
  
  return {
    bg: {
      primary: currentTheme === 'dark' ? 'bg-[#0a0a0b]' : 'bg-white',
      secondary: currentTheme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-gray-50',
      tertiary: currentTheme === 'dark' ? 'bg-[#2d2d30]' : 'bg-gray-100'
    },
    text: {
      primary: currentTheme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: currentTheme === 'dark' ? 'text-[#8b8b8b]' : 'text-gray-600',
      muted: currentTheme === 'dark' ? 'text-[#666]' : 'text-gray-400'
    },
    border: {
      primary: currentTheme === 'dark' ? 'border-[#2d2d30]' : 'border-gray-200',
      secondary: currentTheme === 'dark' ? 'border-[#404040]' : 'border-gray-300'
    }
  };
};

export default useTheme; 