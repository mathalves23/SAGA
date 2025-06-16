import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '../../services/pushNotifications';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'workout' | 'social' | 'progress' | 'system';
}

const NotificationSettings: React.FC = () => {
  const {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    service
  } = usePushNotifications();

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'workout_reminders',
      label: 'Lembretes de Treino',
      description: 'Receba lembretes para não perder seus treinos',
      enabled: true,
      category: 'workout'
    },
    {
      id: 'achievement_notifications',
      label: 'Conquistas',
      description: 'Seja notificado quando alcançar novas conquistas',
      enabled: true,
      category: 'progress'
    },
    {
      id: 'social_updates',
      label: 'Atualizações Sociais',
      description: 'Curtidas, comentários e novos seguidores',
      enabled: true,
      category: 'social'
    },
    {
      id: 'weekly_progress',
      label: 'Progresso Semanal',
      description: 'Resumo semanal dos seus treinos e progresso',
      enabled: true,
      category: 'progress'
    },
    {
      id: 'friend_activities',
      label: 'Atividades de Amigos',
      description: 'Quando seus amigos completam treinos',
      enabled: false,
      category: 'social'
    },
    {
      id: 'rest_day_reminders',
      label: 'Dias de Descanso',
      description: 'Lembretes sobre a importância do descanso',
      enabled: true,
      category: 'workout'
    },
    {
      id: 'nutrition_tips',
      label: 'Dicas de Nutrição',
      description: 'Dicas personalizadas de alimentação',
      enabled: false,
      category: 'system'
    },
    {
      id: 'motivational_quotes',
      label: 'Frases Motivacionais',
      description: 'Receba inspiração diária para seus treinos',
      enabled: false,
      category: 'system'
    }
  ]);

  const [testNotification, setTestNotification] = useState(false);

  useEffect(() => {
    // Carregar preferências salvas
    const savedPreferences = localStorage.getItem('saga-notification-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => 
          prev.map(pref => ({
            ...pref,
            enabled: parsed[pref.id] ?? pref.enabled
          }))
        );
      } catch (error) {
    console.error('Erro ao carregar preferências:', error);
      }
    }
  }, []);

  const savePreferences = (newPreferences: NotificationPreference[]) => {
    const prefsObj = newPreferences.reduce((acc, pref) => {
      acc[pref.id] = pref.enabled;
      return acc;
    }, {} as Record<string, boolean>);

    localStorage.setItem('saga-notification-preferences', JSON.stringify(prefsObj));
  };

  const handleTogglePreference = (id: string) => {
    const newPreferences = preferences.map(pref =>
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    );
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const handleEnableNotifications = async () => {
    try {
      await subscribe();
      if (isSubscribed) {
        service.setupAutomaticNotifications();
      }
    } catch (error) {
    console.error('Erro ao ativar notificações:', error);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      await unsubscribe();
    } catch (error) {
    console.error('Erro ao desativar notificações:', error);
    }
  };

  const handleTestNotification = async () => {
    if (!isSubscribed || permission !== 'granted') return;

    setTestNotification(true);
    
    try {
      await service.sendLocalNotification({
        title: '🔔 Teste do SAGA',
        body: 'As notificações estão funcionando perfeitamente!',
        icon: '/icon-192.png',
        tag: 'test-notification',
        data: { type: 'test' }
      });
    } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error);
    }

    setTimeout(() => setTestNotification(false), 2000);
  };

  const getStatusColor = () => {
    if (!isSupported) return 'text-gray-500';
    if (permission === 'denied') return 'text-red-500';
    if (isSubscribed) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusText = () => {
    if (!isSupported) return 'Não suportado neste navegador';
    if (permission === 'denied') return 'Permissão negada';
    if (isSubscribed) return 'Ativo';
    return 'Inativo';
  };

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  const categoryLabels = {
    workout: 'Treinos',
    social: 'Social',
    progress: 'Progresso',
    system: 'Sistema'
  };

  const categoryIcons = {
    workout: '🏋️',
    social: '👥',
    progress: '📊',
    system: '⚙️'
  };

  if (!isSupported) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Notificações Não Suportadas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Seu navegador não suporta notificações push. Considere usar um navegador mais recente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status das Notificações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Status das Notificações
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
          <div className="flex space-x-3">
            {isSubscribed ? (
              <>
                <button
                  onClick={handleTestNotification}
                  disabled={testNotification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {testNotification ? 'Enviando...' : 'Testar'}
                </button>
                <button
                  onClick={handleDisableNotifications}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Desativar
                </button>
              </>
            ) : (
              <button
                onClick={handleEnableNotifications}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ativar Notificações
              </button>
            )}
          </div>
        </div>

        {permission === 'denied' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Permissão Negada
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Para ativar as notificações, você precisa permitir nas configurações do navegador.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferências de Notificação */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Preferências de Notificação
          </h3>

          <div className="space-y-6">
            {Object.entries(groupedPreferences).map(([category, prefs]) => (
              <div key={category}>
                <h4 className="flex items-center text-md font-medium text-gray-900 dark:text-white mb-3">
                  <span className="mr-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h4>
                
                <div className="space-y-3 ml-6">
                  {prefs.map(pref => (
                    <div key={pref.id} className="flex items-start justify-between py-2">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                          {pref.label}
                        </label>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {pref.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference(pref.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pref.enabled
                            ? 'bg-green-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pref.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Horários Personalizados */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Horários Personalizados
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Lembrete de Treino
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Horário diário para lembrete de treino
                </p>
              </div>
              <input
                type="time"
                defaultValue="19:00"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Relatório Semanal
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Dia da semana para relatório de progresso
                </p>
              </div>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="0">Domingo</option>
                <option value="1">Segunda</option>
                <option value="2">Terça</option>
                <option value="3">Quarta</option>
                <option value="4">Quinta</option>
                <option value="5">Sexta</option>
                <option value="6">Sábado</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings; 