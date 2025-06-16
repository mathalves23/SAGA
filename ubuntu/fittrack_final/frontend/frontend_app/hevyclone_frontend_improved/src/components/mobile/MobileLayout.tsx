import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  User,
  Search,
  Bell,
  Menu,
  Plus
} from 'lucide-react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: number;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems: NavItem[] = [
    { id: 'feed', label: 'Feed', icon: Home, path: '/feed' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, path: '/workouts' },
    { id: 'add', label: '', icon: Plus, path: '/workout/new' },
    { id: 'progress', label: 'Progresso', icon: TrendingUp, path: '/progress' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' }
  ];

  useEffect(() => {
    const path = location.pathname;
    const currentTab = navItems.find(item => 
      path.startsWith(item.path) || (item.path === '/feed' && path === '/')
    );
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    if (item.id === 'add') {
      // FAB behavior
      navigate(item.path);
    } else {
      setActiveTab(item.id);
      navigate(item.path);
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'feed': 'SAGA',
      'workouts': 'Meus Treinos',
      'exercises': 'Exercícios',
      'routines': 'Rotinas',
      'progress': 'Progresso',
      'profile': 'Perfil',
      'settings': 'Configurações'
    };

    const path = location.pathname;
    if (path.includes('/workout/')) return 'Treino';
    if (path.includes('/exercise/')) return 'Exercício';
    if (path.includes('/routine/')) return 'Rotina';
    
    return titles[activeTab] || 'SAGA';
  };

  const showBackButton = () => {
    const paths = ['/workout/', '/exercise/', '/routine/', '/settings', '/notifications'];
    return paths.some(path => location.pathname.includes(path));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  return (
    <div className="mobile-layout min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className={`mobile-header transition-all duration-200 ${
        isScrolled ? 'shadow-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm' : ''
      }`}>
        <div className="flex items-center">
          {showBackButton() ? (
            <button
              onClick={handleBack}
              className="mobile-header-btn"
              aria-label="Voltar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="mobile-header-btn lg:hidden"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <h1 className="mobile-header-title ml-2">{getPageTitle()}</h1>
        </div>

        <div className="mobile-header-actions">
          <button
            onClick={() => navigate('/search')}
            className="mobile-header-btn"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/notifications')}
            className="mobile-header-btn relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-2">
                {navItems
                  .filter(item => item.id !== 'add')
                  .map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleNavClick(item);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                
                <hr className="my-4 border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </button>

                <button
                  onClick={() => {
                    // Logout logic
                    localStorage.removeItem('saga-auth-token');
                    navigate('/login');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mobile-content">
        {children}
      </main>

      {/* Floating Action Button - Only show on specific pages */}
      {(activeTab === 'feed' || activeTab === 'workouts') && (
        <button
          onClick={() => navigate('/workout/new')}
          className="mobile-fab"
          aria-label="Novo Treino"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="mobile-nav safe-area-bottom">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAddButton = item.id === 'add';

          if (isAddButton) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="relative"
                aria-label="Novo Treino"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <Icon className={`mobile-nav-icon ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className={`mobile-nav-label ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

// PWA Install Prompt Component
const PWAInstallPrompt: React.FC = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallPrompt || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 md:hidden">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
            Instalar SAGA
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
            Adicione à tela inicial para acesso rápido
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg font-medium"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-xs"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileLayout; 