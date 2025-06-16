import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  AcademicCapIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  TrophyIcon,
  CpuChipIcon,
  SparklesIcon,
  FolderIcon,
  BookOpenIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import GlobalSearch from '../search/GlobalSearch';

import OnboardingTour, { useOnboarding, sagaOnboardingSteps } from '../onboarding/OnboardingTour';
import {
  HomeIcon as HomeIconSolid, 
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid, 
  AcademicCapIcon as AcademicCapIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  TrophyIcon as TrophyIconSolid,
  CpuChipIcon as CpuChipIconSolid,
  SparklesIcon as SparklesIconSolid,
  FolderIcon as FolderIconSolid,
  BookOpenIcon as BookOpenIconSolid
} from '@heroicons/react/24/solid';

// Tipos para notificações
interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      title: 'João curtiu seu treino',
      message: 'João Silva curtiu seu treino de peito e tríceps',
      timestamp: '2 min atrás',
      isRead: false,
      avatar: 'J'
    },
    {
      id: 2,
      type: 'follow',
      title: 'Novo seguidor',
      message: 'Maria Santos começou a te seguir',
      timestamp: '1 hora atrás',
      isRead: false,
      avatar: 'M'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Nova conquista desbloqueada!',
      message: 'Parabéns! Você completou 7 dias consecutivos de treino',
      timestamp: '3 horas atrás',
      isRead: false,
      avatar: '🏆'
    },
    {
      id: 4,
      type: 'comment',
      title: 'Pedro comentou',
      message: 'Pedro Costa: "Excelente treino! Continue assim 💪"',
      timestamp: '1 dia atrás',
      isRead: true,
      avatar: 'P'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Lembrete de treino',
      message: 'Não esqueça do seu treino de pernas hoje às 18:00',
      timestamp: '2 dias atrás',
      isRead: true,
      avatar: '⏰'
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'achievement': return '🏆';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/feed' && location.pathname === '/');
  };

  const menuItems = [
    { 
      path: '/feed', 
      label: 'Feed', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid,
      description: 'Início'
    },
    { 
      path: '/routines', 
      label: 'Rotinas', 
      icon: FolderIcon, 
      iconSolid: FolderIconSolid,
      description: 'Minhas Rotinas'
    },
    { 
      path: '/exercises', 
      label: 'Exercícios', 
      icon: BookOpenIcon, 
      iconSolid: BookOpenIconSolid,
      description: 'Biblioteca'
    },
    { 
      path: '/profile', 
      label: 'Perfil', 
      icon: UserIcon, 
      iconSolid: UserIconSolid,
      description: 'Meu Perfil'
    },
    // Divisor para features extras do SAGA
    { 
      path: '/analytics', 
      label: 'Análises', 
      icon: ChartBarIcon, 
      iconSolid: ChartBarIconSolid,
      description: 'Análise IA',
      isExtra: true
    },
    { 
      path: '/coach', 
      label: 'Coach', 
      icon: CpuChipIcon, 
      iconSolid: CpuChipIconSolid,
      description: 'Coach Virtual',
      isExtra: true
    },
    { 
      path: '/ai', 
      label: 'IA Tools', 
      icon: SparklesIcon, 
      iconSolid: SparklesIconSolid,
      description: 'Ferramentas IA',
      isExtra: true
    },
    { 
      path: '/rewards', 
      label: 'Recompensas', 
      icon: TrophyIcon, 
      iconSolid: TrophyIconSolid,
      description: 'Recompensas',
      isExtra: true
    },
    { 
      path: '/settings', 
      label: 'Configurações', 
      icon: Cog6ToothIcon, 
      iconSolid: Cog6ToothIconSolid,
      description: 'Configurações'
    }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#1a1a1b] border-r border-[#2d2d30] transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-[#2d2d30]">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SAGA
                </span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[#2d2d30] transition-colors"
            >
              <div className="w-4 h-4 flex flex-col justify-center gap-1">
                <div className="w-full h-0.5 bg-gray-400"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
                <div className="w-full h-0.5 bg-gray-400"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = isActive(item.path) ? item.iconSolid : item.icon;
            const isActiveItem = isActive(item.path);
            
            // Adicionar separador antes das features extras
            const showDivider = item.isExtra && index > 0 && !menuItems[index - 1].isExtra;
            
            return (
              <React.Fragment key={item.path}>
                {showDivider && (
                  <div className="border-t border-[#2d2d30] my-3"></div>
                )}
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActiveItem
                      ? 'bg-[#2d2d30] text-white border border-[#404040]'
                      : 'text-[#8b8b8b] hover:bg-[#2d2d30] hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActiveItem ? 'text-purple-400' : ''}`} />
                  {!isSidebarCollapsed && (
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="text-xs text-[#666] group-hover:text-[#888]">
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-[#2d2d30]">
          <Link 
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">M</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Matheus</span>
                <span className="text-xs text-[#666] hover:text-[#888] transition-colors">Ver perfil</span>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-[#1a1a1b] border-b border-[#2d2d30] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {menuItems.find(item => isActive(item.path))?.label || 'SAGA'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Global Search */}
            <GlobalSearch 
              className="w-80"
              onResultSelect={(result) => {
                console.log('Resultado selecionado:', result);
                // Navegar para o resultado apropriado
              }}
              showFilters={true}
            />
            
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-[#2d2d30] transition-colors relative"
              >
                <BellIcon className="w-5 h-5 text-[#8b8b8b] hover:text-white transition-colors" />
                {/* Badge de notificação */}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                  </div>
                )}
              </button>

              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1b] border border-[#2d2d30] rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-[#2d2d30] flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notificações</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg hover:bg-[#2d2d30] transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4 text-[#8b8b8b]" />
                      </button>
                    </div>
                  </div>

                  {/* Lista de notificações */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[#8b8b8b]">
                        <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => !notification.isRead && markAsRead(notification.id)}
                          className={`p-4 border-b border-[#2d2d30] last:border-b-0 cursor-pointer transition-colors ${
                            !notification.isRead 
                              ? 'bg-[#2d2d30]/50 hover:bg-[#2d2d30]/70' 
                              : 'hover:bg-[#2d2d30]/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar/Icon */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                              notification.avatar && notification.avatar.length === 1
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                : 'bg-[#404040]'
                            }`}>
                              {notification.avatar || getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Conteúdo */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-medium ${
                                  !notification.isRead ? 'text-white' : 'text-[#b0b0b0]'
                                }`}>
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className={`text-xs mt-1 ${
                                !notification.isRead ? 'text-[#8b8b8b]' : 'text-[#666]'
                              }`}>
                                {notification.message}
                              </p>
                              <span className="text-xs text-[#666] mt-1">
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-[#2d2d30] text-center">
                      <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        Ver todas as notificações
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <main className="min-h-full bg-[#0a0a0b]">
            <div className="pt-8 pb-20 px-4">
              <Outlet />
            </div>
          </main>
        </div>


      </div>
    </div>
  );
};

export default MainLayout; 