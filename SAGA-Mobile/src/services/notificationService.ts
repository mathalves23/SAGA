import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Date;
  type: 'workout' | 'goal' | 'achievement' | 'reminder';
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Verificar se é um dispositivo físico
      if (!Device.isDevice) {
        console.warn('As notificações push funcionam apenas em dispositivos físicos');
        return;
      }

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permissão de notificação negada');
      }

      // Obter token de push
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;

      // Salvar token localmente
      await AsyncStorage.setItem('expo_push_token', token);

      // Configurar canal de notificação (Android)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('workout-reminders', {
          name: 'Lembretes de Treino',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('achievements', {
          name: 'Conquistas',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10b981',
          sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('goals', {
          name: 'Metas',
          importance: Notifications.AndroidImportance.DEFAULT,
          lightColor: '#f59e0b',
          sound: 'default',
        });
      }

      console.log('✅ Notificações inicializadas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
      throw error;
    }
  }

  async sendLocalNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: 'default',
        },
        trigger: null, // Imediata
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao enviar notificação local:', error);
      throw error;
    }
  }

  async scheduleNotification(
    notification: NotificationData,
    trigger: Date,
    type: 'workout' | 'goal' | 'achievement' | 'reminder' = 'reminder'
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { ...notification.data, type },
          sound: 'default',
        },
        trigger: {
          date: trigger,
        },
      });

      // Salvar notificação agendada
      await this.saveScheduledNotification({
        id: notificationId,
        title: notification.title,
        body: notification.body,
        trigger,
        type,
      });

      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  async scheduleWorkoutReminder(workoutName: string, scheduledTime: Date): Promise<string> {
    const reminderTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000); // 30 min antes

    return this.scheduleNotification(
      {
        title: '🏋️ Hora do Treino!',
        body: `Seu treino "${workoutName}" está agendado para daqui 30 minutos`,
        data: { workoutName, type: 'workout_reminder' },
      },
      reminderTime,
      'workout'
    );
  }

  async scheduleGoalReminder(goalTitle: string, deadline: Date): Promise<string> {
    const reminderTime = new Date(deadline.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes

    return this.scheduleNotification(
      {
        title: '🎯 Meta se aproximando!',
        body: `Sua meta "${goalTitle}" vence amanhã. Que tal dar uma olhada no seu progresso?`,
        data: { goalTitle, type: 'goal_reminder' },
      },
      reminderTime,
      'goal'
    );
  }

  async notifyAchievement(achievementTitle: string, description: string): Promise<string> {
    return this.sendLocalNotification({
      title: '🏆 Nova Conquista Desbloqueada!',
      body: `Parabéns! Você conquistou: "${achievementTitle}"`,
      data: { achievementTitle, description, type: 'achievement' },
    });
  }

  async scheduleDailyMotivation(): Promise<string[]> {
    const motivationalMessages = [
      'Bom dia! Que tal começar o dia com um treino? 💪',
      'Lembre-se: pequenos passos levam a grandes conquistas! 🚀',
      'Sua consistência de hoje é o resultado de amanhã! ⭐',
      'O único treino ruim é aquele que não acontece! 🏋️',
      'Você está mais perto dos seus objetivos do que ontem! 🎯',
    ];

    const notifications: string[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const triggerDate = new Date(now);
      triggerDate.setDate(now.getDate() + i);
      triggerDate.setHours(8, 0, 0, 0); // 8h da manhã

      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      const notificationId = await this.scheduleNotification(
        {
          title: '🌟 SAGA Motivation',
          body: randomMessage,
          data: { type: 'daily_motivation' },
        },
        triggerDate,
        'reminder'
      );

      notifications.push(notificationId);
    }

    return notifications;
  }

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const saved = await AsyncStorage.getItem('scheduled_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações agendadas:', error);
      return [];
    }
  }

  private async saveScheduledNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const existing = await this.getScheduledNotifications();
      existing.push(notification);
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(existing));
    } catch (error) {
      console.error('Erro ao salvar notificação agendada:', error);
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      // Remover da lista salva
      const existing = await this.getScheduledNotifications();
      const filtered = existing.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('scheduled_notifications');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Erro ao obter badge count:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Erro ao definir badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Listener para notificações recebidas
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Listener para quando o usuário toca na notificação
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Configurações padrão para tipos específicos
  async setupWorkoutNotifications(workoutSchedule: Array<{name: string, time: Date}>): Promise<void> {
    // Cancelar notificações existentes de treino
    const existing = await this.getScheduledNotifications();
    const workoutNotifications = existing.filter(n => n.type === 'workout');
    
    for (const notification of workoutNotifications) {
      await this.cancelNotification(notification.id);
    }

    // Agendar novas notificações
    for (const workout of workoutSchedule) {
      await this.scheduleWorkoutReminder(workout.name, workout.time);
    }
  }

  async testNotification(): Promise<void> {
    await this.sendLocalNotification({
      title: '🧪 Teste de Notificação',
      body: 'Se você está vendo isso, as notificações estão funcionando perfeitamente!',
      data: { test: true },
    });
  }
}

export const notificationService = new NotificationService(); 