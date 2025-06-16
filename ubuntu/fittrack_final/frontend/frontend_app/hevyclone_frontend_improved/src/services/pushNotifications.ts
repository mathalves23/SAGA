// Push Notifications Service para SAGA
interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  silent?: boolean;
  timestamp?: number;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  async initialize(): Promise<boolean> {
    try {
      // Verificar suporte
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications não suportadas neste navegador');
        return false;
      }

      // Registrar service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado para push notifications');

      // Verificar permissão atual
      this.permission = Notification.permission;

      return true;
    } catch (error) {
    console.error('Erro ao inicializar push notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (this.permission === 'granted') {
        return true;
      }

      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === 'granted') {
        console.log('Permissão para notificações concedida');
        return true;
      } else {
        console.log('Permissão para notificações negada');
        return false;
      }
    } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    try {
      if (!this.registration) {
        throw new Error('Service Worker não registrado');
      }

      if (this.permission !== 'granted') {
        const granted = await this.requestPermission();
        if (!granted) return null;
      }

      // Chave pública VAPID (em produção, usar variável de ambiente)
      const vapidPublicKey = 'BMrFLEFNh2Qj8w9_yGxgj8Qf5L7sKpJtYHOqNf9vR4hQ_8wFB2SgH3TZ9X4Y8YJhFN6Z8YjH4';

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('Inscrito em push notifications:', subscription);

      // Enviar subscription para servidor
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
    console.error('Erro ao se inscrever em push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.registration) return false;

      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Desinscrito de push notifications');
        return true;
      }
      return false;
    } catch (error) {
    console.error('Erro ao se desinscrever:', error);
      return false;
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<void> {
    try {
      if (this.permission !== 'granted') {
        console.warn('Permissão não concedida para notificações');
        return;
      }

      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        badge: payload.badge || '/badge-72.png',
        image: payload.image,
        tag: payload.tag,
        data: payload.data,
        actions: payload.actions,
        silent: payload.silent || false,
        timestamp: payload.timestamp || Date.now(),
        requireInteraction: false,
        renotify: true
      };

      if (this.registration) {
        await this.registration.showNotification(payload.title, options);
      } else {
        new Notification(payload.title, options);
      }
    } catch (error) {
    console.error('Erro ao enviar notificação local:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      // Em produção, enviar para API real
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId: localStorage.getItem('saga-user-id'),
          preferences: this.getNotificationPreferences()
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar subscription');
      }

      console.log('Subscription enviada para servidor');
    } catch (error) {
    console.error('Erro ao enviar subscription:', error);
      // Salvar localmente como fallback
      localStorage.setItem('saga-push-subscription', JSON.stringify(subscription));
    }
  }

  private getNotificationPreferences() {
    return {
      workoutReminders: true,
      socialUpdates: true,
      achievements: true,
      weeklyProgress: true,
      friendActivities: false
    };
  }

  // Métodos para notificações específicas do SAGA
  async sendWorkoutReminder(time: string = '19:00'): Promise<void> {
    await this.sendLocalNotification({
      title: '🏋️ Hora do Treino!',
      body: `Não esqueça do seu treino hoje às ${time}. Vamos manter a consistência!`,
      icon: '/workout-icon.png',
      tag: 'workout-reminder',
      data: { type: 'workout_reminder', time },
      actions: [
        { action: 'start_workout', title: 'Iniciar Treino' },
        { action: 'snooze', title: 'Lembrar em 30min' }
      ]
    });
  }

  async sendAchievementNotification(achievement: string): Promise<void> {
    await this.sendLocalNotification({
      title: '🏆 Nova Conquista!',
      body: `Parabéns! Você desbloqueou: ${achievement}`,
      icon: '/achievement-icon.png',
      tag: 'achievement',
      data: { type: 'achievement', name: achievement },
      actions: [
        { action: 'view_achievement', title: 'Ver Conquista' },
        { action: 'share', title: 'Compartilhar' }
      ]
    });
  }

  async sendSocialNotification(type: 'like' | 'comment' | 'follow', user: string): Promise<void> {
    const messages = {
      like: `❤️ ${user} curtiu seu treino`,
      comment: `💬 ${user} comentou no seu post`,
      follow: `👥 ${user} começou a te seguir`
    };

    await this.sendLocalNotification({
      title: 'SAGA Social',
      body: messages[type],
      icon: '/social-icon.png',
      tag: 'social-update',
      data: { type: 'social', action: type, user },
      actions: [
        { action: 'view_post', title: 'Ver Post' },
        { action: 'reply', title: 'Responder' }
      ]
    });
  }

  async sendProgressReminder(): Promise<void> {
    await this.sendLocalNotification({
      title: '📊 Progresso Semanal',
      body: 'Veja como foi sua semana de treinos e defina metas para a próxima!',
      icon: '/progress-icon.png',
      tag: 'weekly-progress',
      data: { type: 'progress_reminder' },
      actions: [
        { action: 'view_progress', title: 'Ver Progresso' },
        { action: 'set_goals', title: 'Definir Metas' }
      ]
    });
  }

  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
    setTimeout(() => {
      this.sendLocalNotification(payload);
    }, delay);
  }

  // Configurar notificações automáticas
  setupAutomaticNotifications(): void {
    // Lembrete diário de treino (19h)
    const now = new Date();
    const workoutTime = new Date();
    workoutTime.setHours(19, 0, 0, 0);
    
    if (workoutTime < now) {
      workoutTime.setDate(workoutTime.getDate() + 1);
    }
    
    const timeUntilWorkout = workoutTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendWorkoutReminder();
      // Repetir diariamente
      setInterval(() => this.sendWorkoutReminder(), 24 * 60 * 60 * 1000);
    }, timeUntilWorkout);

    // Progresso semanal (domingo 20h)
    const sundayProgress = new Date();
    sundayProgress.setDate(sundayProgress.getDate() + (7 - sundayProgress.getDay()));
    sundayProgress.setHours(20, 0, 0, 0);
    
    const timeUntilSunday = sundayProgress.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendProgressReminder();
      // Repetir semanalmente
      setInterval(() => this.sendProgressReminder(), 7 * 24 * 60 * 60 * 1000);
    }, timeUntilSunday);
  }
}

// Hook para usar push notifications
import { useState, useEffect } from 'react';

export const usePushNotifications = () => {
  const [service] = useState(() => new PushNotificationService());
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const init = async () => {
      const supported = await service.initialize();
      setIsSupported(supported);
      setPermission(Notification.permission);
      
      // Verificar se já está inscrito
      if (supported && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    };

    init();
  }, [service]);

  const subscribe = async () => {
    const subscription = await service.subscribe();
    setIsSubscribed(!!subscription);
    setPermission(Notification.permission);
    return subscription;
  };

  const unsubscribe = async () => {
    const success = await service.unsubscribe();
    if (success) {
      setIsSubscribed(false);
    }
    return success;
  };

  const sendNotification = (payload: NotificationPayload) => {
    return service.sendLocalNotification(payload);
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendNotification,
    service
  };
};

export default PushNotificationService; 