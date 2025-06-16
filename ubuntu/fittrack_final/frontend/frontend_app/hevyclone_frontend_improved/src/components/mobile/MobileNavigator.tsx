import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  User, 
  Plus,
  Search,
  Bell,
  Settings
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

const tabs: Tab[] = [
  { id: 'home', name: 'Início', icon: Home, path: '/', color: '#3b82f6' },
  { id: 'exercises', name: 'Exercícios', icon: Dumbbell, path: '/exercises', color: '#10b981' },
  { id: 'add', name: 'Treinar', icon: Plus, path: '/workout/start', color: '#f59e0b' },
  { id: 'progress', name: 'Progresso', icon: TrendingUp, path: '/progress', color: '#8b5cf6' },
  { id: 'profile', name: 'Perfil', icon: User, path: '/profile', color: '#ef4444' }
];

interface MobileNavigatorProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const MobileNavigator: React.FC<MobileNavigatorProps> = ({
  activeTab,
  onTabChange,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollThreshold = 10;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        setIsVisible(!scrollingDown || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Animate visibility
  useEffect(() => {
    controls.start({
      y: isVisible ? 0 : 100,
      opacity: isVisible ? 1 : 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    });
  }, [isVisible, controls]);

  // Haptic feedback (if supported)
  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[intensity]);
    }
  };

  // Handle tab selection
  const handleTabPress = (tab: Tab) => {
    triggerHaptic('light');
    onTabChange(tab.id);
    
    // Add press animation
    controls.start({
      scale: 0.95,
      transition: { duration: 0.1 }
    }).then(() => {
      controls.start({
        scale: 1,
        transition: { duration: 0.1 }
      });
    });
  };

  // Swipe gesture handling
  const handlePan = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    if (Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let nextIndex;
      
      if (offset.x > 0 && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      } else if (offset.x < 0 && currentIndex < tabs.length - 1) {
        nextIndex = currentIndex + 1;
      }
      
      if (nextIndex !== undefined) {
        triggerHaptic('medium');
        onTabChange(tabs[nextIndex].id);
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
      onPan={handlePan}
      onPanEnd={handlePan}
    >
      {/* Background with blur effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/90 to-transparent backdrop-blur-xl border-t border-gray-800/50" />
        
        {/* Safe area padding for iOS */}
        <div className="relative px-4 pb-safe">
          <div className="flex items-center justify-around py-2 max-w-md mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isAddButton = tab.id === 'add';
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabPress(tab)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-2xl
                    transition-all duration-300 ease-out min-w-[60px]
                    ${isAddButton ? 'transform -translate-y-3' : ''}
                    ${isActive ? 'text-white' : 'text-gray-400'}
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  initial={false}
                  animate={{
                    color: isActive ? '#ffffff' : '#9ca3af'
                  }}
                >
                  {/* Active indicator */}
                  {isActive && !isAddButton && (
                    <motion.div
                      className="absolute -top-1 left-1/2 w-1 h-1 bg-blue-500 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                  
                  {/* Add button special styling */}
                  {isAddButton ? (
                    <motion.div
                      className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25"
                      whileHover={{ 
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                        scale: 1.05
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={isActive ? {
                        rotate: 45,
                        transition: { duration: 0.3 }
                      } : {
                        rotate: 0,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Icon 
                        size={24} 
                        className="text-white drop-shadow-sm"
                        strokeWidth={2.5}
                      />
                      
                      {/* Floating particles effect */}
                      {isActive && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              initial={{ 
                                scale: 0,
                                x: 0,
                                y: 0,
                                opacity: 1
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                x: [0, (i - 1) * 20],
                                y: [0, -20 - i * 5],
                                opacity: [1, 1, 0]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: 'easeOut'
                              }}
                            />
                          ))}
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-xl
                        ${isActive ? 'bg-gray-800/50' : 'bg-transparent'}
                      `}
                      animate={{
                        backgroundColor: isActive ? 'rgba(31, 41, 55, 0.5)' : 'transparent',
                        scale: isActive ? 1.1 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className="drop-shadow-sm"
                      />
                    </motion.div>
                  )}
                  
                  {/* Tab label */}
                  <motion.span
                    className={`
                      text-xs font-medium mt-1 select-none
                      ${isAddButton ? 'text-white' : ''}
                    `}
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1 : 0.9,
                      fontWeight: isActive ? 600 : 500
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.name}
                  </motion.span>
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 0, opacity: 0 }}
                    whileTap={{
                      scale: 1.5,
                      opacity: [0, 0.3, 0],
                      transition: { duration: 0.4 }
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Quick actions overlay */}
      {activeTab === 'add' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-full left-4 right-4 mb-4"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 border border-gray-800/50 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30"
                onClick={() => triggerHaptic('medium')}
              >
                <Dumbbell size={20} className="text-green-400" />
                <span className="text-white font-medium">Novo Treino</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl border border-purple-500/30"
                onClick={() => triggerHaptic('medium')}
              >
                <Search size={20} className="text-purple-400" />
                <span className="text-white font-medium">Buscar</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 