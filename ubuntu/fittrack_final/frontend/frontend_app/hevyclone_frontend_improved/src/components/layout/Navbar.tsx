import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X, 
  Home, 
  Dumbbell, 
  Target, 
  History, 
  Users, 
  Bell, 
  User, 
  LogOut,
  Settings,
  Moon,
  Sun
} from '../ui/Icons';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };
  
  return (
    <div className="flex items-center space-x-2">
      {/* Toggle Dark/Light Mode */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 focus-ring"
        title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Navbar; 