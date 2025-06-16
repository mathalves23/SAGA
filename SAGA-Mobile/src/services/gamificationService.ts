import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from './notificationService';

// INTERFACES DO SISTEMA RPG
interface UserProfile {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  rank: PlayerRank;
  title: string;
  avatar: Avatar;
  stats: PlayerStats;
  achievements: Achievement[];
  activeBadges: Badge[];
  currency: Currency;
  streaks: Streaks;
  guild?: Guild;
}

interface Avatar {
  baseModel: 'warrior' | 'archer' | 'mage' | 'monk' | 'berserker';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: Equipment;
  accessories: Equipment[];
  evolutionStage: number; // 1-5 (evolui conforme level)
}

interface Equipment {
  id: string;
  name: string;
  type: 'helmet' | 'armor' | 'weapon' | 'boots' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  stats: { [key: string]: number };
  unlockedAt: number; // level necessário
  price: number;
}

interface PlayerStats {
  strength: number;      // Baseado em treinos de força
  endurance: number;     // Baseado em cardio
  flexibility: number;   // Baseado em alongamento/yoga
  consistency: number;   // Baseado em frequência
  motivation: number;    // Baseado em engajamento
  leadership: number;    // Baseado em atividades sociais
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'social' | 'consistency' | 'milestone' | 'special';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  experience: number;
  currency: number;
  unlockedAt?: string;
  progress: number;
  target: number;
  secret: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  effect: BadgeEffect;
  duration: number; // em dias, 0 = permanente
}

interface BadgeEffect {
  type: 'xp_boost' | 'currency_boost' | 'stat_boost' | 'special';
  value: number;
  description: string;
}

interface Currency {
  coins: number;        // Moeda principal
  gems: number;         // Moeda premium
  tokens: number;       // Tokens especiais para eventos
}

interface Streaks {
  workout: number;      // Dias consecutivos de treino
  login: number;        // Dias consecutivos de login
  goal: number;         // Dias consecutivos batendo metas
  social: number;       // Dias consecutivos de interação social
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'event' | 'story';
  category: 'workout' | 'social' | 'exploration' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeLimit?: number; // em horas
  prerequisites?: string[]; // IDs de quests que devem estar completas
  isActive: boolean;
  progress: number;
  completedAt?: string;
}

interface QuestObjective {
  id: string;
  description: string;
  type: 'workout_count' | 'exercise_reps' | 'social_interaction' | 'exploration' | 'custom';
  target: number;
  current: number;
  completed: boolean;
}

interface QuestReward {
  type: 'experience' | 'coins' | 'gems' | 'equipment' | 'badge' | 'title';
  amount?: number;
  itemId?: string;
}

interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  memberCount: number;
  maxMembers: number;
  totalExperience: number;
  rank: number;
  perks: GuildPerk[];
  activities: GuildActivity[];
}

interface GuildPerk {
  id: string;
  name: string;
  description: string;
  level: number;
  effect: string;
}

interface GuildActivity {
  id: string;
  name: string;
  description: string;
  type: 'challenge' | 'event' | 'competition';
  startDate: string;
  endDate: string;
  participants: string[];
  rewards: QuestReward[];
}

interface PlayerRank {
  name: string;
  level: number;
  icon: string;
  color: string;
  privileges: string[];
}

interface Leaderboard {
  id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  category: 'experience' | 'workouts' | 'consistency' | 'social' | 'guild';
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  value: number;
  change: number; // mudança de posição
  avatar: string;
  title: string;
}

class GamificationService {
  private userProfile: UserProfile | null = null;
  private activeQuests: Quest[] = [];
  private availableQuests: Quest[] = [];
  private leaderboards: { [key: string]: Leaderboard } = {};

  // RANKINGS DISPONÍVEIS
  private ranks: PlayerRank[] = [
    { name: 'Iniciante', level: 1, icon: '🌱', color: '#10b981', privileges: ['basic_features'] },
    { name: 'Aprendiz', level: 10, icon: '🏃', color: '#3b82f6', privileges: ['basic_features', 'social_features'] },
    { name: 'Atleta', level: 25, icon: '💪', color: '#8b5cf6', privileges: ['basic_features', 'social_features', 'advanced_stats'] },
    { name: 'Guerreiro', level: 50, icon: '⚔️', color: '#f59e0b', privileges: ['all_features', 'guild_creation'] },
    { name: 'Campeão', level: 75, icon: '🏆', color: '#ef4444', privileges: ['all_features', 'exclusive_content'] },
    { name: 'Lenda', level: 100, icon: '👑', color: '#facc15', privileges: ['all_features', 'mentor_program'] },
    { name: 'Imortal', level: 150, icon: '🌟', color: '#ec4899', privileges: ['all_features', 'exclusive_events'] },
  ];

  async initialize(): Promise<void> {
    try {
      await this.loadUserProfile();
      await this.loadActiveQuests();
      await this.loadLeaderboards();
      await this.generateDailyQuests();
      
      console.log('🎮 Sistema de gamificação inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar gamificação:', error);
    }
  }

  // GESTÃO DE PERFIL
  private async loadUserProfile(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem('user_profile_rpg');
      if (saved) {
        this.userProfile = JSON.parse(saved);
      } else {
        await this.createNewProfile();
      }
    } catch (error) {
      console.error('Erro ao carregar perfil RPG:', error);
      await this.createNewProfile();
    }
  }

  private async createNewProfile(): Promise<void> {
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      username: 'Novo Guerreiro',
      level: 1,
      experience: 0,
      experienceToNext: 100,
      totalExperience: 0,
      rank: this.ranks[0],
      title: 'Iniciante',
      avatar: {
        baseModel: 'warrior',
        skinTone: '#fdbcb4',
        hairStyle: 'short',
        hairColor: '#8b4513',
        outfit: this.getStarterEquipment(),
        accessories: [],
        evolutionStage: 1,
      },
      stats: {
        strength: 1,
        endurance: 1,
        flexibility: 1,
        consistency: 1,
        motivation: 1,
        leadership: 1,
      },
      achievements: [],
      activeBadges: [],
      currency: { coins: 100, gems: 10, tokens: 0 },
      streaks: { workout: 0, login: 1, goal: 0, social: 0 },
    };

    this.userProfile = newProfile;
    await this.saveUserProfile();
  }

  private getStarterEquipment(): Equipment {
    return {
      id: 'starter_outfit',
      name: 'Roupa de Iniciante',
      type: 'armor',
      rarity: 'common',
      stats: { defense: 1 },
      unlockedAt: 1,
      price: 0,
    };
  }

  private async saveUserProfile(): Promise<void> {
    if (this.userProfile) {
      await AsyncStorage.setItem('user_profile_rpg', JSON.stringify(this.userProfile));
    }
  }

  // SISTEMA DE EXPERIÊNCIA
  async gainExperience(amount: number, source: string): Promise<{
    leveledUp: boolean;
    newLevel?: number;
    rewards?: any[];
  }> {
    if (!this.userProfile) return { leveledUp: false };

    const oldLevel = this.userProfile.level;
    this.userProfile.experience += amount;
    this.userProfile.totalExperience += amount;

    // Verificar level up
    while (this.userProfile.experience >= this.userProfile.experienceToNext) {
      this.userProfile.experience -= this.userProfile.experienceToNext;
      this.userProfile.level++;
      this.userProfile.experienceToNext = this.calculateExperienceForLevel(this.userProfile.level + 1);
    }

    const leveledUp = this.userProfile.level > oldLevel;
    let rewards: any[] = [];

    if (leveledUp) {
      // Recompensas por level up
      rewards = await this.processLevelUp(oldLevel, this.userProfile.level);
      
      // Notificação de level up
      await notificationService.sendLocalNotification({
        title: '🎉 LEVEL UP!',
        body: `Parabéns! Você alcançou o nível ${this.userProfile.level}!`,
        data: { type: 'level_up', newLevel: this.userProfile.level },
      });
    }

    await this.saveUserProfile();

    return {
      leveledUp,
      newLevel: leveledUp ? this.userProfile.level : undefined,
      rewards: leveledUp ? rewards : undefined,
    };
  }

  private calculateExperienceForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  }

  private async processLevelUp(oldLevel: number, newLevel: number): Promise<any[]> {
    const rewards: any[] = [];

    // Recompensas básicas por nível
    const coinReward = newLevel * 50;
    const gemReward = Math.floor(newLevel / 5);

    this.userProfile!.currency.coins += coinReward;
    this.userProfile!.currency.gems += gemReward;

    rewards.push(
      { type: 'coins', amount: coinReward },
      { type: 'gems', amount: gemReward }
    );

    // Verificar se desbloqueou novo rank
    const newRank = this.ranks.find(rank => rank.level === newLevel);
    if (newRank) {
      this.userProfile!.rank = newRank;
      rewards.push({ type: 'rank', rank: newRank });
      
      await notificationService.sendLocalNotification({
        title: '👑 NOVO RANK!',
        body: `Você alcançou o rank ${newRank.name}!`,
        data: { type: 'rank_up', rank: newRank },
      });
    }

    // Atualizar avatar evolution
    if (newLevel % 20 === 0 && this.userProfile!.avatar.evolutionStage < 5) {
      this.userProfile!.avatar.evolutionStage++;
      rewards.push({ type: 'avatar_evolution', stage: this.userProfile!.avatar.evolutionStage });
    }

    return rewards;
  }

  // SISTEMA DE CONQUISTAS
  async checkAchievements(action: string, data: any): Promise<Achievement[]> {
    if (!this.userProfile) return [];

    const newAchievements: Achievement[] = [];
    const allAchievements = this.getAllAchievements();

    for (const achievement of allAchievements) {
      if (this.userProfile.achievements.some(a => a.id === achievement.id)) {
        continue; // Já desbloqueada
      }

      let progress = 0;
      let shouldUpdate = false;

      switch (achievement.id) {
        case 'first_workout':
          if (action === 'workout_completed') {
            progress = 1;
            shouldUpdate = true;
          }
          break;

        case 'workout_streak_7':
          if (action === 'workout_completed') {
            progress = this.userProfile.streaks.workout;
            shouldUpdate = true;
          }
          break;

        case 'level_10':
          progress = this.userProfile.level >= 10 ? 1 : 0;
          shouldUpdate = true;
          break;

        // Adicionar mais lógicas de conquistas...
      }

      if (shouldUpdate) {
        achievement.progress = Math.min(progress, achievement.target);
        
        if (achievement.progress >= achievement.target) {
          // Conquista desbloqueada!
          achievement.unlockedAt = new Date().toISOString();
          this.userProfile.achievements.push(achievement);
          newAchievements.push(achievement);

          // Recompensas da conquista
          await this.gainExperience(achievement.experience, `achievement_${achievement.id}`);
          this.userProfile.currency.coins += achievement.currency;

          // Notificação
          await notificationService.sendLocalNotification({
            title: '🏆 CONQUISTA DESBLOQUEADA!',
            body: `${achievement.title}: ${achievement.description}`,
            data: { type: 'achievement', achievement },
          });
        }
      }
    }

    if (newAchievements.length > 0) {
      await this.saveUserProfile();
    }

    return newAchievements;
  }

  private getAllAchievements(): Achievement[] {
    return [
      {
        id: 'first_workout',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro treino',
        category: 'workout',
        rarity: 'bronze',
        icon: '🏃‍♂️',
        experience: 50,
        currency: 25,
        progress: 0,
        target: 1,
        secret: false,
      },
      {
        id: 'workout_streak_7',
        title: 'Guerreiro Consistente',
        description: 'Mantenha um streak de 7 dias de treino',
        category: 'consistency',
        rarity: 'silver',
        icon: '🔥',
        experience: 200,
        currency: 100,
        progress: 0,
        target: 7,
        secret: false,
      },
      {
        id: 'level_10',
        title: 'Atleta Dedicado',
        description: 'Alcance o nível 10',
        category: 'milestone',
        rarity: 'gold',
        icon: '⭐',
        experience: 500,
        currency: 250,
        progress: 0,
        target: 1,
        secret: false,
      },
      // Mais conquistas...
    ];
  }

  // SISTEMA DE MISSÕES
  private async generateDailyQuests(): Promise<void> {
    const today = new Date().toDateString();
    const lastGenerated = await AsyncStorage.getItem('daily_quests_date');

    if (lastGenerated === today) {
      return; // Já gerado hoje
    }

    const dailyQuests: Quest[] = [
      {
        id: `daily_workout_${Date.now()}`,
        title: 'Treino Diário',
        description: 'Complete 1 treino hoje',
        type: 'daily',
        category: 'workout',
        difficulty: 'easy',
        objectives: [{
          id: 'obj1',
          description: 'Complete 1 treino',
          type: 'workout_count',
          target: 1,
          current: 0,
          completed: false,
        }],
        rewards: [
          { type: 'experience', amount: 100 },
          { type: 'coins', amount: 50 },
        ],
        timeLimit: 24,
        isActive: true,
        progress: 0,
      },
      {
        id: `daily_social_${Date.now()}`,
        title: 'Conexão Social',
        description: 'Interaja com outros usuários',
        type: 'daily',
        category: 'social',
        difficulty: 'easy',
        objectives: [{
          id: 'obj1',
          description: 'Dê like em 3 posts',
          type: 'social_interaction',
          target: 3,
          current: 0,
          completed: false,
        }],
        rewards: [
          { type: 'experience', amount: 75 },
          { type: 'coins', amount: 30 },
        ],
        timeLimit: 24,
        isActive: true,
        progress: 0,
      },
    ];

    this.activeQuests = dailyQuests;
    await AsyncStorage.setItem('active_quests', JSON.stringify(this.activeQuests));
    await AsyncStorage.setItem('daily_quests_date', today);
  }

  async updateQuestProgress(action: string, data: any): Promise<Quest[]> {
    const completedQuests: Quest[] = [];

    for (const quest of this.activeQuests) {
      if (!quest.isActive) continue;

      let shouldUpdate = false;

      for (const objective of quest.objectives) {
        if (objective.completed) continue;

        switch (objective.type) {
          case 'workout_count':
            if (action === 'workout_completed') {
              objective.current = Math.min(objective.current + 1, objective.target);
              shouldUpdate = true;
            }
            break;

          case 'social_interaction':
            if (action === 'social_like' || action === 'social_comment') {
              objective.current = Math.min(objective.current + 1, objective.target);
              shouldUpdate = true;
            }
            break;
        }

        objective.completed = objective.current >= objective.target;
      }

      if (shouldUpdate) {
        quest.progress = quest.objectives.reduce((acc, obj) => 
          acc + (obj.current / obj.target), 0) / quest.objectives.length * 100;

        // Verificar se quest foi completada
        if (quest.objectives.every(obj => obj.completed)) {
          quest.completedAt = new Date().toISOString();
          quest.isActive = false;
          completedQuests.push(quest);

          // Dar recompensas
          for (const reward of quest.rewards) {
            switch (reward.type) {
              case 'experience':
                await this.gainExperience(reward.amount!, `quest_${quest.id}`);
                break;
              case 'coins':
                this.userProfile!.currency.coins += reward.amount!;
                break;
              case 'gems':
                this.userProfile!.currency.gems += reward.amount!;
                break;
            }
          }

          // Notificação
          await notificationService.sendLocalNotification({
            title: '✅ MISSÃO COMPLETA!',
            body: `${quest.title} - Recompensas coletadas!`,
            data: { type: 'quest_completed', quest },
          });
        }
      }
    }

    if (completedQuests.length > 0) {
      await this.saveUserProfile();
      await this.saveActiveQuests();
    }

    return completedQuests;
  }

  private async saveActiveQuests(): Promise<void> {
    await AsyncStorage.setItem('active_quests', JSON.stringify(this.activeQuests));
  }

  private async loadActiveQuests(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem('active_quests');
      this.activeQuests = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar quests:', error);
      this.activeQuests = [];
    }
  }

  // LEADERBOARDS
  private async loadLeaderboards(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem('leaderboards');
      this.leaderboards = saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Erro ao carregar leaderboards:', error);
      this.leaderboards = {};
    }
  }

  async updateLeaderboard(category: string, value: number): Promise<void> {
    if (!this.userProfile) return;

    // Aqui seria enviado para o servidor
    // Por enquanto, mock local
    const leaderboardId = `${category}_weekly`;
    
    if (!this.leaderboards[leaderboardId]) {
      this.leaderboards[leaderboardId] = {
        id: leaderboardId,
        name: `${category} Semanal`,
        period: 'weekly',
        category: category as any,
        entries: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    // Atualizar entrada do usuário
    const existingEntry = this.leaderboards[leaderboardId].entries.find(
      entry => entry.userId === this.userProfile!.id
    );

    if (existingEntry) {
      existingEntry.value = value;
    } else {
      this.leaderboards[leaderboardId].entries.push({
        rank: 0,
        userId: this.userProfile.id,
        username: this.userProfile.username,
        value,
        change: 0,
        avatar: this.userProfile.avatar.baseModel,
        title: this.userProfile.title,
      });
    }

    // Reordenar e atualizar ranks
    this.leaderboards[leaderboardId].entries.sort((a, b) => b.value - a.value);
    this.leaderboards[leaderboardId].entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await AsyncStorage.setItem('leaderboards', JSON.stringify(this.leaderboards));
  }

  // GETTERS PÚBLICOS
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  getActiveQuests(): Quest[] {
    return this.activeQuests.filter(q => q.isActive);
  }

  getLeaderboard(id: string): Leaderboard | null {
    return this.leaderboards[id] || null;
  }

  getAllLeaderboards(): Leaderboard[] {
    return Object.values(this.leaderboards);
  }

  // AÇÕES ESPECÍFICAS
  async completeWorkout(workoutData: any): Promise<void> {
    // Ganhar XP baseado no treino
    const baseXP = 100;
    const bonusXP = Math.floor(workoutData.duration / 10); // 10 XP por 10 min
    
    await this.gainExperience(baseXP + bonusXP, 'workout_completed');
    
    // Atualizar streak
    this.userProfile!.streaks.workout++;
    
    // Atualizar stats
    this.updatePlayerStats('workout', workoutData);
    
    // Verificar conquistas
    await this.checkAchievements('workout_completed', workoutData);
    
    // Atualizar quests
    await this.updateQuestProgress('workout_completed', workoutData);
    
    // Atualizar leaderboard
    await this.updateLeaderboard('workouts', this.userProfile!.totalExperience);
    
    await this.saveUserProfile();
  }

  private updatePlayerStats(action: string, data: any): void {
    if (!this.userProfile) return;

    switch (action) {
      case 'workout':
        if (data.type === 'strength') {
          this.userProfile.stats.strength += 1;
        } else if (data.type === 'cardio') {
          this.userProfile.stats.endurance += 1;
        }
        this.userProfile.stats.consistency += 1;
        break;
    }
  }

  // SISTEMA DE MOEDA
  async spendCurrency(type: 'coins' | 'gems' | 'tokens', amount: number): Promise<boolean> {
    if (!this.userProfile) return false;

    if (this.userProfile.currency[type] >= amount) {
      this.userProfile.currency[type] -= amount;
      await this.saveUserProfile();
      return true;
    }

    return false;
  }

  async earnCurrency(type: 'coins' | 'gems' | 'tokens', amount: number, source: string): Promise<void> {
    if (!this.userProfile) return;

    this.userProfile.currency[type] += amount;
    await this.saveUserProfile();

    // Log da transação
    console.log(`💰 +${amount} ${type} from ${source}`);
  }

  // EVENTOS ESPECIAIS
  async triggerSpecialEvent(eventType: string): Promise<void> {
    switch (eventType) {
      case 'double_xp_weekend':
        // Implementar evento de XP duplo
        break;
      case 'rare_equipment_sale':
        // Implementar evento de equipamentos raros
        break;
    }
  }
}

export const gamificationService = new GamificationService(); 