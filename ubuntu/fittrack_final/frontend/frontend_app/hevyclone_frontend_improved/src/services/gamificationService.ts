// Serviço de Gamificação - SAGA Fitness
export interface UserLevel {
  id: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  benefits: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'comum' | 'raro' | 'épico' | 'lendário';
  xpReward: number;
  condition: (userStats: UserStats) => boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number; // em minutos
  totalExercises: number;
  longestStreak: number;
  currentStreak: number;
  totalXP: number;
  level: number;
  badges: string[]; // IDs dos badges desbloqueados
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  favoriteExercise: string;
  totalWeight: number; // volume total levantado
}

export interface RankingUser {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  weeklyXP: number;
  monthlyXP: number;
  badges: string[];
  position: number;
}

class GamificationService {
  
  // Sistema de Níveis
  private readonly LEVELS: UserLevel[] = [
          { id: 1, name: 'Iniciante', minXP: 0, maxXP: 499, color: '#ec4899', icon: '🌱', benefits: ['Acesso básico', 'Primeiros treinos'] },
    { id: 2, name: 'Aprendiz', minXP: 500, maxXP: 1499, color: '#a855f7', icon: '🔸', benefits: ['Rotinas personalizadas', 'Estatísticas básicas'] },
    { id: 3, name: 'Dedicado', minXP: 1500, maxXP: 3499, color: '#C0C0C0', icon: '⚡', benefits: ['Metas avançadas', 'Análises detalhadas'] },
    { id: 4, name: 'Atleta', minXP: 3500, maxXP: 6999, color: '#FFD700', icon: '🏆', benefits: ['Rankings', 'Badges especiais'] },
    { id: 5, name: 'Veterano', minXP: 7000, maxXP: 12499, color: '#E6E6FA', icon: '💎', benefits: ['Coach virtual', 'Planos premium'] },
    { id: 6, name: 'Elite', minXP: 12500, maxXP: 24999, color: '#40E0D0', icon: '👑', benefits: ['Recursos exclusivos', 'Mentoria'] },
    { id: 7, name: 'Lenda', minXP: 25000, maxXP: 49999, color: '#FF1493', icon: '🌟', benefits: ['Status lendário', 'Benefícios únicos'] },
    { id: 8, name: 'Imortal', minXP: 50000, maxXP: Infinity, color: '#FF4500', icon: '🔥', benefits: ['Máximo prestígio', 'Acesso completo'] }
  ];

  // Sistema de Badges
  private readonly BADGES: Badge[] = [
    // Badges de Iniciação
    {
      id: 'first_workout',
      name: 'Primeiro Passo',
      description: 'Complete seu primeiro treino',
      icon: '👶',
      rarity: 'comum',
      xpReward: 50,
      condition: (stats) => stats.totalWorkouts >= 1
    },
    {
      id: 'week_warrior',
      name: 'Guerreiro da Semana',
      description: 'Complete 7 treinos em uma semana',
      icon: '📅',
      rarity: 'raro',
      xpReward: 200,
      condition: (stats) => stats.weeklyWorkouts >= 7
    },
    
    // Badges de Consistência
    {
      id: 'streak_7',
      name: 'Sequência de 7',
      description: 'Mantenha uma sequência de 7 dias',
      icon: '🔥',
      rarity: 'raro',
      xpReward: 150,
      condition: (stats) => stats.longestStreak >= 7
    },
    {
      id: 'streak_30',
      name: 'Mês Imparável',
      description: 'Mantenha uma sequência de 30 dias',
      icon: '🚀',
      rarity: 'épico',
      xpReward: 500,
      condition: (stats) => stats.longestStreak >= 30
    },
    {
      id: 'streak_100',
      name: 'Centenário',
      description: 'Mantenha uma sequência de 100 dias',
      icon: '💯',
      rarity: 'lendário',
      xpReward: 1000,
      condition: (stats) => stats.longestStreak >= 100
    },
    
    // Badges de Volume
    {
      id: 'workouts_10',
      name: 'Dez e Contando',
      description: 'Complete 10 treinos',
      icon: '🔟',
      rarity: 'comum',
      xpReward: 100,
      condition: (stats) => stats.totalWorkouts >= 10
    },
    {
      id: 'workouts_50',
      name: 'Meio Centurião',
      description: 'Complete 50 treinos',
      icon: '⚔️',
      rarity: 'raro',
      xpReward: 300,
      condition: (stats) => stats.totalWorkouts >= 50
    },
    {
      id: 'workouts_100',
      name: 'Centurião',
      description: 'Complete 100 treinos',
      icon: '🛡️',
      rarity: 'épico',
      xpReward: 600,
      condition: (stats) => stats.totalWorkouts >= 100
    },
    {
      id: 'workouts_500',
      name: 'Gladiador',
      description: 'Complete 500 treinos',
      icon: '⚡',
      rarity: 'lendário',
      xpReward: 1500,
      condition: (stats) => stats.totalWorkouts >= 500
    },
    
    // Badges de Tempo
    {
      id: 'time_10h',
      name: 'Primeiras 10 Horas',
      description: 'Acumule 10 horas de treino',
      icon: '⏰',
      rarity: 'comum',
      xpReward: 100,
      condition: (stats) => stats.totalDuration >= 600
    },
    {
      id: 'time_100h',
      name: 'Cem Horas',
      description: 'Acumule 100 horas de treino',
      icon: '⏳',
      rarity: 'épico',
      xpReward: 400,
      condition: (stats) => stats.totalDuration >= 6000
    },
    {
      id: 'time_1000h',
      name: 'Mil Horas',
      description: 'Acumule 1000 horas de treino',
      icon: '🕐',
      rarity: 'lendário',
      xpReward: 1000,
      condition: (stats) => stats.totalDuration >= 60000
    },
    
    // Badges Especiais
    {
      id: 'early_bird',
      name: 'Madrugador',
      description: 'Complete um treino antes das 6h',
      icon: '🌅',
      rarity: 'raro',
      xpReward: 150,
      condition: () => false // Implementar lógica específica
    },
    {
      id: 'night_owl',
      name: 'Coruja Noturna',
      description: 'Complete um treino depois das 22h',
      icon: '🦉',
      rarity: 'raro',
      xpReward: 150,
      condition: () => false // Implementar lógica específica
    },
    {
      id: 'weekend_warrior',
      name: 'Guerreiro de Fim de Semana',
      description: 'Complete treinos em todos os fins de semana do mês',
      icon: '🏖️',
      rarity: 'épico',
      xpReward: 300,
      condition: () => false // Implementar lógica específica
    },
    {
      id: 'goal_crusher',
      name: 'Destruidor de Metas',
      description: 'Complete 5 metas pessoais',
      icon: '🎯',
      rarity: 'épico',
      xpReward: 400,
      condition: () => false // Implementar com sistema de metas
    }
  ];

  // Calcular XP baseado em ações
  calculateWorkoutXP(workout: any): number {
    let baseXP = 50; // XP base por treino
    
    // Bonus por duração
    const duration = parseInt(workout.duration?.replace(' min', '') || '0');
    baseXP += Math.floor(duration / 10) * 5; // 5 XP a cada 10 minutos
    
    // Bonus por exercícios
    const exercises = workout.exercises?.length || 0;
    baseXP += exercises * 10; // 10 XP por exercício
    
    // Bonus por consistência (se for dia consecutivo)
    // baseXP += streak bonus logic
    
    return baseXP;
  }

  // Obter estatísticas do usuário
  getUserStats(): UserStats {
    try {
      // Carregar dados existentes
      const workouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      const savedStats = JSON.parse(localStorage.getItem('userGamificationStats') || '{}');
      
      // Calcular estatísticas
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce((sum: number, w: any) => 
        sum + parseInt(w.duration?.replace(' min', '') || '0'), 0
      );
      const totalExercises = workouts.reduce((sum: number, w: any) => 
        sum + (w.exercises?.length || 0), 0
      );
      
      // Calcular sequências
      const { longestStreak, currentStreak } = this.calculateStreaks(workouts);
      
      // Workouts semanais e mensais
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const weeklyWorkouts = workouts.filter((w: any) => 
        new Date(w.savedAt) >= weekStart
      ).length;
      
      const monthlyWorkouts = workouts.filter((w: any) => 
        new Date(w.savedAt) >= monthStart
      ).length;
      
      // XP total
      let totalXP = savedStats.totalXP || 0;
      
      // Se não há XP salvo, calcular baseado nos treinos existentes
      if (totalXP === 0 && workouts.length > 0) {
        totalXP = workouts.reduce((sum: number, workout: any) => 
          sum + this.calculateWorkoutXP(workout), 0
        );
      }
      
      const stats: UserStats = {
        totalWorkouts,
        totalDuration,
        totalExercises,
        longestStreak,
        currentStreak,
        totalXP,
        level: this.calculateLevel(totalXP),
        badges: savedStats.badges || [],
        weeklyWorkouts,
        monthlyWorkouts,
        favoriteExercise: this.getFavoriteExercise(workouts),
        totalWeight: this.calculateTotalWeight(workouts)
      };
      
      return stats;
    } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
      return this.getDefaultStats();
    }
  }

  // Calcular nível baseado no XP
  calculateLevel(xp: number): number {
    for (let i = this.LEVELS.length - 1; i >= 0; i--) {
      if (xp >= this.LEVELS[i].minXP) {
        return this.LEVELS[i].id;
      }
    }
    return 1;
  }

  // Obter informações do nível
  getLevelInfo(level: number): UserLevel {
    return this.LEVELS.find(l => l.id === level) || this.LEVELS[0];
  }

  // Obter próximo nível
  getNextLevelInfo(currentLevel: number): UserLevel | null {
    return this.LEVELS.find(l => l.id === currentLevel + 1) || null;
  }

  // Verificar e desbloquear badges
  checkAndUnlockBadges(stats: UserStats): Badge[] {
    const newBadges: Badge[] = [];
    
    for (const badge of this.BADGES) {
      if (!stats.badges.includes(badge.id) && badge.condition(stats)) {
        stats.badges.push(badge.id);
        newBadges.push({
          ...badge,
          unlockedAt: new Date().toISOString()
        });
        
        // Adicionar XP do badge
        stats.totalXP += badge.xpReward;
      }
    }
    
    // Salvar estatísticas atualizadas
    this.saveUserStats(stats);
    
    return newBadges;
  }

  // Adicionar XP por treino
  addWorkoutXP(workout: any): { xpGained: number; newBadges: Badge[]; levelUp: boolean } {
    const stats = this.getUserStats();
    const oldLevel = stats.level;
    
    const xpGained = this.calculateWorkoutXP(workout);
    stats.totalXP += xpGained;
    stats.level = this.calculateLevel(stats.totalXP);
    
    // Verificar novos badges
    const newBadges = this.checkAndUnlockBadges(stats);
    
    // Verificar level up
    const levelUp = stats.level > oldLevel;
    
    this.saveUserStats(stats);
    
    return { xpGained, newBadges, levelUp };
  }

  // Obter ranking de usuários (simulado)
  getRanking(): RankingUser[] {
    const currentUser = this.getUserStats();
    
    // Dados simulados de outros usuários
    const mockUsers: RankingUser[] = [
      {
        id: 'user1',
        username: 'FitMaster_2024',
        avatar: '💪',
        level: 6,
        xp: 15420,
        weeklyXP: 450,
        monthlyXP: 1800,
        badges: ['streak_30', 'workouts_100', 'time_100h'],
        position: 1
      },
      {
        id: 'user2',
        username: 'HealthyLife_Ana',
        avatar: '🏃‍♀️',
        level: 5,
        xp: 12150,
        weeklyXP: 380,
        monthlyXP: 1520,
        badges: ['streak_7', 'workouts_50', 'weekend_warrior'],
        position: 2
      },
      {
        id: 'current',
        username: 'Você',
        avatar: '👤',
        level: currentUser.level,
        xp: currentUser.totalXP,
        weeklyXP: 0, // Calcular XP semanal
        monthlyXP: 0, // Calcular XP mensal
        badges: currentUser.badges,
        position: 3
      },
      {
        id: 'user3',
        username: 'PowerLifter_Carlos',
        avatar: '🏋️‍♂️',
        level: 4,
        xp: 8900,
        weeklyXP: 320,
        monthlyXP: 1280,
        badges: ['workouts_50', 'time_10h'],
        position: 4
      },
      {
        id: 'user4',
        username: 'YogaMaster_Maria',
        avatar: '🧘‍♀️',
        level: 4,
        xp: 7650,
        weeklyXP: 290,
        monthlyXP: 1160,
        badges: ['streak_7', 'early_bird'],
        position: 5
      }
    ];
    
    // Ordenar por XP e atualizar posições
    return mockUsers
      .sort((a, b) => b.xp - a.xp)
      .map((user, index) => ({ ...user, position: index + 1 }));
  }

  // Obter badges desbloqueados
  getUnlockedBadges(badgeIds: string[]): Badge[] {
    return this.BADGES.filter(badge => badgeIds.includes(badge.id));
  }

  // Obter todos os badges disponíveis
  getAllBadges(): Badge[] {
    return this.BADGES;
  }

  // Funções auxiliares privadas
  private calculateStreaks(workouts: any[]): { longestStreak: number; currentStreak: number } {
    if (workouts.length === 0) return { longestStreak: 0, currentStreak: 0 };
    
    const dates = workouts
      .map(w => new Date(w.savedAt).toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let longestStreak = 1;
    let currentStreak = 1;
    let tempStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calcular sequência atual
    const today = new Date().toDateString();
    const lastWorkout = dates[dates.length - 1];
    const daysSinceLastWorkout = (new Date(today).getTime() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastWorkout <= 1) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }
    
    return { longestStreak, currentStreak };
  }

  private getFavoriteExercise(workouts: any[]): string {
    const exerciseCount: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach((exercise: any) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });
    
    const favorite = Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    return favorite ? favorite[0] : 'Nenhum ainda';
  }

  private calculateTotalWeight(workouts: any[]): number {
    let totalWeight = 0;
    
    workouts.forEach(workout => {
      workout.exercises?.forEach((exercise: any) => {
        exercise.sets?.forEach((set: any) => {
          const weight = parseFloat(set.weight || '0');
          const reps = parseInt(set.reps || '0');
          totalWeight += weight * reps;
        });
      });
    });
    
    return Math.round(totalWeight);
  }

  private saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem('userGamificationStats', JSON.stringify({
        totalXP: stats.totalXP,
        level: stats.level,
        badges: stats.badges
      }));
    } catch (error) {
    console.error('Erro ao salvar estatísticas:', error);
    }
  }

  private getDefaultStats(): UserStats {
    return {
      totalWorkouts: 15,
      totalDuration: 720, // 12 horas em minutos
      totalExercises: 45,
      longestStreak: 7,
      currentStreak: 3,
      totalXP: 1250,
      level: 3,
      badges: ['first_workout', 'workouts_10', 'time_10h'],
      weeklyWorkouts: 3,
      monthlyWorkouts: 12,
      favoriteExercise: 'Supino Reto',
      totalWeight: 2500
    };
  }
}

export const gamificationService = new GamificationService(); 