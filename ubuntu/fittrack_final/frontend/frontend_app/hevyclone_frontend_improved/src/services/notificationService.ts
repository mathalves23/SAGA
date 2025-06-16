// src/services/notificationService.ts

type NotificationType = 'workout_reminder' | 'goal_deadline' | 'achievement' | 'weekly_summary';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
};

class NotificationService {
  private permission: NotificationPermission = 'default';
  
  constructor() {
    this.checkPermission();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
    console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }

  checkPermission(): boolean {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
    return this.permission === 'granted';
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: 'saga-fitness',
        requireInteraction: false,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options?.data?.url) {
          window.location.href = options.data.url;
        }
      };
    } catch (error) {
    console.error('Erro ao mostrar notificação:', error);
    }
  }

  scheduleWorkoutReminder(time: string = '18:00'): void {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Se já passou da hora hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification('🏋️‍♂️ Hora do treino!', {
        body: 'Não se esqueça do seu treino de hoje. Vamos manter a consistência!',
        icon: '/icon-192.png',
        tag: 'workout-reminder',
        data: { url: '/routines' }
      });

      // Agendar para o próximo dia
      this.scheduleWorkoutReminder(time);
    }, timeUntilNotification);
  }

  checkGoalDeadlines(): void {
    try {
      const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      const now = new Date();
      
      goals.forEach((goal: any) => {
        const deadline = new Date(goal.deadline);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDeadline === 7) {
          this.showNotification('⏰ Meta próxima do prazo', {
            body: `Sua meta "${goal.title}" vence em 1 semana!`,
            tag: 'goal-deadline-week',
            data: { url: '/goals' }
          });
        } else if (daysUntilDeadline === 1) {
          this.showNotification('🚨 Meta vence amanhã!', {
            body: `Última chance para "${goal.title}"!`,
            tag: 'goal-deadline-tomorrow',
            data: { url: '/goals' }
          });
        }
      });
    } catch (error) {
    console.error('Erro ao verificar prazos das metas:', error);
    }
  }

  notifyAchievement(title: string, description: string): void {
    this.showNotification('🏆 Nova conquista!', {
      body: `${title}: ${description}`,
      icon: '/icon-192.png',
      tag: 'achievement',
      requireInteraction: true,
      data: { url: '/progress' }
    });
  }

  sendWeeklySummary(): void {
    try {
      const workouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const weeklyWorkouts = workouts.filter((w: any) => 
        new Date(w.savedAt) >= lastWeek
      );

      if (weeklyWorkouts.length > 0) {
        const totalDuration = weeklyWorkouts.reduce((sum: number, w: any) => 
          sum + parseInt(w.duration?.replace(' min', '') || '0'), 0
        );

        this.showNotification('📊 Resumo semanal', {
          body: `Esta semana: ${weeklyWorkouts.length} treinos, ${totalDuration} minutos. Parabéns!`,
          tag: 'weekly-summary',
          data: { url: '/progress' }
        });
      } else {
        this.showNotification('🎯 Que tal treinar esta semana?', {
          body: 'Você não treinou esta semana. Que tal começar hoje?',
          tag: 'weekly-motivation',
          data: { url: '/routines' }
        });
      }
    } catch (error) {
    console.error('Erro ao enviar resumo semanal:', error);
    }
  }

  // Salvar notificação no histórico local
  saveNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): void {
    try {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false
      };
      
      notifications.unshift(newNotification);
      
      // Manter apenas as últimas 50 notificações
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
    console.error('Erro ao salvar notificação:', error);
    }
  }

  getNotifications(): Notification[] {
    try {
      return JSON.parse(localStorage.getItem('notifications') || '[]');
    } catch (error) {
    console.error('Erro ao carregar notificações:', error);
      return [];
    }
  }

  markAsRead(notificationId: string): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  markAllAsRead(): void {
    try {
      const notifications = this.getNotifications();
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  }

  getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  // Inicializar sistema de notificações
  async initialize(): Promise<void> {
    const granted = await this.requestPermission();
    
    if (granted) {
      // Agendar lembrete diário de treino
      this.scheduleWorkoutReminder();
      
      // Verificar prazos das metas a cada hora
      setInterval(() => this.checkGoalDeadlines(), 60 * 60 * 1000);
      
      // Enviar resumo semanal todo domingo às 20h
      const now = new Date();
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(20, 0, 0, 0);
      
      const timeUntilSunday = nextSunday.getTime() - now.getTime();
      setTimeout(() => {
        this.sendWeeklySummary();
        setInterval(() => this.sendWeeklySummary(), 7 * 24 * 60 * 60 * 1000);
      }, timeUntilSunday);
    }
  }

  // Notificações específicas do contexto fitness
  notifyWorkoutCompleted(workoutName: string, duration: string): void {
    this.showNotification('✅ Treino concluído!', {
      body: `Parabéns! Você completou "${workoutName}" em ${duration}`,
      tag: 'workout-completed',
      data: { url: '/progress' }
    });

    this.saveNotification({
      type: 'achievement',
      title: 'Treino concluído',
      body: `${workoutName} - ${duration}`,
      actionUrl: '/progress'
    });
  }

  notifyStreakMilestone(days: number): void {
    const messages = {
      3: 'Você está pegando o ritmo! 💪',
      7: 'Uma semana inteira! Incrível! 🔥',
      14: 'Duas semanas seguidas! Você é imparável! ⚡',
      30: 'Um mês de dedicação! Lendário! 🏆'
    };

    const message = messages[days as keyof typeof messages] || 'Sequência incrível!';

    this.showNotification(`🔥 ${days} dias seguidos!`, {
      body: message,
      tag: 'streak-milestone',
      requireInteraction: true,
      data: { url: '/progress' }
    });

    this.saveNotification({
      type: 'achievement',
      title: `${days} dias de sequência`,
      body: message,
      actionUrl: '/progress'
    });
  }

  notifyGoalCompleted(goalTitle: string): void {
    this.showNotification('🎯 Meta alcançada!', {
      body: `Parabéns! Você completou: ${goalTitle}`,
      tag: 'goal-completed',
      requireInteraction: true,
      data: { url: '/goals' }
    });

    this.saveNotification({
      type: 'achievement',
      title: 'Meta completada',
      body: goalTitle,
      actionUrl: '/goals'
    });
  }
}

export const notificationService = new NotificationService();
export type { Notification, NotificationType };
