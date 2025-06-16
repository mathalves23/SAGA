import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut,
  Search,
  Heart,
  Trophy,
  Target,
  Users
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
  category?: 'main' | 'features' | 'account';
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    // Main Navigation
    { id: 'feed', label: 'Feed', icon: Home, path: '/feed', category: 'main' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, path: '/workouts', category: 'main' },
    { id: 'exercises', label: 'Exercícios', icon: Search, path: '/exercises', category: 'main' },
    { id: 'progress', label: 'Progresso', icon: TrendingUp, path: '/progress', category: 'main' },
    
    // Features
    { id: 'routines', label: 'Rotinas', icon: Calendar, path: '/routines', category: 'features' },
    { id: 'goals', label: 'Metas', icon: Target, path: '/goals', category: 'features' },
    { id: 'social', label: 'Social', icon: Users, path: '/social', category: 'features' },
    { id: 'achievements', label: 'Conquistas', icon: Trophy, path: '/achievements', category: 'features' },
    { id: 'favorites', label: 'Favoritos', icon: Heart, path: '/favorites', category: 'features' },
    
    // AI & Analytics
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics', category: 'ai' },
    { id: 'coach', label: 'Coach', icon: Users, path: '/coach', category: 'ai' },
    { id: 'ai', label: 'IA Personal', icon: Brain, path: '/ai', category: 'ai' },
    
    // Account
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile', category: 'account' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings', category: 'account' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const groupedItems = navItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SAGA
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fitness App</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@saga.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="px-3 mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Principal
          </h3>
          <div className="space-y-1">
            {groupedItems.main?.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-3 mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Recursos
          </h3>
          <div className="space-y-1">
            {groupedItems.features?.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Section */}
        <div className="px-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Conta
          </h3>
          <div className="space-y-1">
            {groupedItems.account?.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 