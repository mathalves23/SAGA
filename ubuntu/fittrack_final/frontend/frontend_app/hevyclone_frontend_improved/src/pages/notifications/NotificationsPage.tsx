// src/pages/NotificationsPage.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  HeartIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  CheckCircleIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BoltIcon,
  StarIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  FireIcon as FireIconSolid,
  TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';

interface Notification {
  id: string;
  type: 'workout' | 'nutrition' | 'achievement' | 'social' | 'reminder' | 'motivation' | 'progress';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: React.ElementType;
  iconColor: string;
  actionUrl?: string;
  actionText?: string;
  data?: any;
}

interface NotificationSettings {
  workoutReminders: boolean;
  workoutTime: string;
  nutritionReminders: boolean;
  nutritionTimes: string[];
  achievements: boolean;
  socialUpdates: boolean;
  progressReports: boolean;
  motivationalMessages: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

interface SmartSuggestion {
  id: string;
  type: 'time' | 'frequency' | 'content';
  title: string;
  description: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  accepted?: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState<'inbox' | 'settings' | 'smart' | 'history'>('inbox');
  const [settings, setSettings] = useState<NotificationSettings>({
    workoutReminders: true,
    workoutTime: '18:00',
    nutritionReminders: true,
    nutritionTimes: ['08:00', '12:00', '19:00'],
    achievements: true,
    socialUpdates: true,
    progressReports: true,
    motivationalMessages: true,
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    },
    frequency: 'immediate'
  });
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'workout' | 'nutrition' | 'achievement' | 'social'>('all');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    // Verificar permissões de notificação
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Dados mockados de notificações
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'workout',
        title: 'Hora do Treino! 💪',
        message: 'Seu treino de peito está agendado para agora. Vamos lá!',
        time: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        priority: 'high',
        icon: FireIcon,
        iconColor: 'text-red-500',
        actionUrl: '/workout/start',
        actionText: 'Iniciar Treino'
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Nova Conquista Desbloqueada! 🏆',
        message: 'Parabéns! Você completou 100 treinos e desbloqueou a conquista "Maratonista".',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        icon: TrophyIcon,
        iconColor: 'text-yellow-500',
        actionUrl: '/achievements',
        actionText: 'Ver Conquistas'
      },
      {
        id: '3',
        type: 'nutrition',
        title: 'Lembrete de Hidratação 💧',
        message: 'Você ainda não atingiu sua meta de água hoje. Que tal beber um copo agora?',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low',
        icon: HeartIcon,
        iconColor: 'text-blue-500'
      },
      {
        id: '4',
        type: 'social',
        title: 'Ana Santos curtiu seu treino 👍',
        message: 'Ana Santos e mais 3 pessoas curtiram seu treino de hoje.',
        time: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low',
        icon: UserGroupIcon,
        iconColor: 'text-purple-500',
        actionUrl: '/social',
        actionText: 'Ver Atividade'
      },
      {
        id: '5',
        type: 'progress',
        title: 'Relatório Semanal Disponível 📊',
        message: 'Seu relatório de progresso da semana está pronto. Você teve uma ótima evolução!',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        icon: ChartBarIcon,
        iconColor: 'text-green-500',
        actionUrl: '/analytics',
        actionText: 'Ver Relatório'
      },
      {
        id: '6',
        type: 'motivation',
        title: 'Motivação do Dia ⭐',
        message: 'Lembre-se: cada treino é um passo em direção à sua melhor versão!',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low',
        icon: SparklesIcon,
        iconColor: 'text-pink-500'
      }
    ];

    const mockSmartSuggestions: SmartSuggestion[] = [
      {
        id: '1',
        type: 'time',
        title: 'Melhor Horário para Treino',
        description: 'Baseado no seu histórico',
        currentValue: '18:00',
        suggestedValue: '19:30',
        reason: 'Você tem 85% mais chance de completar treinos às 19:30'
      },
      {
        id: '2',
        type: 'frequency',
        title: 'Frequência de Lembretes',
        description: 'Otimizar para sua rotina',
        currentValue: 'Diário',
        suggestedValue: 'Segunda, Quarta, Sexta',
        reason: 'Evita sobrecarga e mantém motivação alta'
      },
      {
        id: '3',
        type: 'content',
        title: 'Tipo de Motivação',
        description: 'Personalizar mensagens',
        currentValue: 'Genérica',
        suggestedValue: 'Focada em Força',
        reason: 'Seus treinos mostram preferência por exercícios de força'
      }
    ];

    setNotifications(mockNotifications);
    setSmartSuggestions(mockSmartSuggestions);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    }
    return false;
  };

  const sendTestNotification = () => {
    if (permissionStatus === 'granted') {
      new Notification('SAGA Fitness', {
        body: 'Notificação de teste enviada com sucesso! 🎉',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notif => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notif.isRead;
      return notif.type === filter;
    });
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const Icon = notification.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border-2 ${getPriorityColor(notification.priority)} ${
          !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`}>
            <Icon className={`h-5 w-5 ${notification.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-gray-500">
                  {notification.time.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className={`text-sm mb-3 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Marcar como lida
                  </motion.button>
                )}
                
                {notification.actionText && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    {notification.actionText}
                  </motion.button>
                )}
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {notification.priority}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const SettingToggle = ({ 
    label, 
    description, 
    checked, 
    onChange 
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-block h-5 w-5 mt-0.5 bg-white rounded-full shadow"
        />
      </motion.button>
    </div>
  );

  const SmartSuggestionCard = ({ suggestion }: { suggestion: SmartSuggestion }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-purple-500" />
          <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
        </div>
        <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
          IA
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Atual:</span>
          <span className="font-medium">{suggestion.currentValue}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Sugerido:</span>
          <span className="font-medium text-purple-600">{suggestion.suggestedValue}</span>
        </div>
      </div>
      
      <div className="p-3 bg-white rounded-lg border border-purple-100 mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <InformationCircleIcon className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">Por que isso?</span>
        </div>
        <p className="text-sm text-gray-600">{suggestion.reason}</p>
      </div>
      
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Aplicar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Ignorar
        </motion.button>
      </div>
    </motion.div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <BellIcon className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
                <p className="text-gray-600">Gerencie seus alertas e lembretes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['inbox', 'settings', 'smart', 'history'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                      selectedTab === tab
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllAsRead}
                  className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  Marcar todas como lidas
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {selectedTab === 'inbox' && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {(['all', 'unread', 'workout', 'nutrition', 'achievement', 'social'] as const).map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      filter === filterType
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {filterType === 'all' ? 'Todas' : 
                     filterType === 'unread' ? 'Não lidas' :
                     filterType === 'workout' ? 'Treino' :
                     filterType === 'nutrition' ? 'Nutrição' :
                     filterType === 'achievement' ? 'Conquistas' :
                     'Social'}
                    {filterType === 'unread' && unreadCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {getFilteredNotifications().length > 0 ? (
                  getFilteredNotifications().map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BellIconSolid className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação</h3>
                    <p className="text-gray-600">
                      {filter === 'unread' ? 
                        'Todas as notificações foram lidas!' : 
                        'Você não tem notificações neste filtro.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {selectedTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Permission Status */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Permissões</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {permissionStatus === 'granted' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        Notificações Push: {
                          permissionStatus === 'granted' ? 'Permitidas' :
                          permissionStatus === 'denied' ? 'Bloqueadas' :
                          'Não solicitadas'
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        {permissionStatus === 'granted' ? 
                          'Você receberá notificações push' :
                          'Clique para habilitar notificações push'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {permissionStatus !== 'granted' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={requestNotificationPermission}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      >
                        Habilitar
                      </motion.button>
                    )}
                    {permissionStatus === 'granted' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendTestNotification}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Testar
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações de Notificação</h3>
                <div className="space-y-4">
                  <SettingToggle
                    label="Lembretes de Treino"
                    description="Receba lembretes para não perder seus treinos"
                    checked={settings.workoutReminders}
                    onChange={(checked) => setSettings(prev => ({ ...prev, workoutReminders: checked }))}
                  />
                  
                  <SettingToggle
                    label="Lembretes de Nutrição"
                    description="Receba lembretes sobre refeições e hidratação"
                    checked={settings.nutritionReminders}
                    onChange={(checked) => setSettings(prev => ({ ...prev, nutritionReminders: checked }))}
                  />
                  
                  <SettingToggle
                    label="Conquistas"
                    description="Seja notificado quando desbloquear novas conquistas"
                    checked={settings.achievements}
                    onChange={(checked) => setSettings(prev => ({ ...prev, achievements: checked }))}
                  />
                  
                  <SettingToggle
                    label="Atualizações Sociais"
                    description="Receba notificações sobre atividades de amigos"
                    checked={settings.socialUpdates}
                    onChange={(checked) => setSettings(prev => ({ ...prev, socialUpdates: checked }))}
                  />
                  
                  <SettingToggle
                    label="Relatórios de Progresso"
                    description="Receba relatórios semanais e mensais do seu progresso"
                    checked={settings.progressReports}
                    onChange={(checked) => setSettings(prev => ({ ...prev, progressReports: checked }))}
                  />
                  
                  <SettingToggle
                    label="Mensagens Motivacionais"
                    description="Receba mensagens diárias de motivação"
                    checked={settings.motivationalMessages}
                    onChange={(checked) => setSettings(prev => ({ ...prev, motivationalMessages: checked }))}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações Avançadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário do Treino
                    </label>
                    <input
                      type="time"
                      value={settings.workoutTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, workoutTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência
                    </label>
                    <select
                      value={settings.frequency}
                      onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="immediate">Imediata</option>
                      <option value="hourly">Por hora</option>
                      <option value="daily">Diária</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Horário Silencioso</h4>
                      <p className="text-sm text-gray-600">Pausar notificações durante determinado período</p>
                    </div>
                    <SettingToggle
                      label=""
                      description=""
                      checked={settings.quietHours.enabled}
                      onChange={(checked) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, enabled: checked }
                      }))}
                    />
                  </div>
                  
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Início
                        </label>
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fim
                        </label>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => setSettings(prev => ({ 
                            ...prev, 
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'smart' && (
            <motion.div
              key="smart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <SparklesIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sugestões Inteligentes</h2>
                <p className="text-gray-600">IA analisou seus hábitos e sugere otimizações</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {smartSuggestions.map(suggestion => (
                  <SmartSuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
