// Serviço para estatísticas de exercícios
interface ExerciseStats {
  exerciseId: number;
  exerciseName: string;
  totalWorkouts: number;
  heaviestWeight: number;
  lastWeight: number;
  totalSets: number;
  totalReps: number;
  bestVolume: number; // sets × reps × weight
  averageReps: number;
  progressPercentage: number;
  lastWorkoutDate: string;
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
  };
  recentHistory: Array<{
    date: string;
    weight: number;
    reps: number;
    sets: number;
  }>;
  chartData: Array<{
    date: string;
    weight: number;
    volume: number;
  }>;
}

class ExerciseStatsService {
  private static instance: ExerciseStatsService;
  private statsCache = new Map<number, ExerciseStats>();

  static getInstance(): ExerciseStatsService {
    if (!ExerciseStatsService.instance) {
      ExerciseStatsService.instance = new ExerciseStatsService();
    }
    return ExerciseStatsService.instance;
  }

  /**
   * Obtém estatísticas para um exercício específico
   */
  async getExerciseStats(exerciseId: number, exerciseName: string): Promise<ExerciseStats> {
    // Verificar cache primeiro
    if (this.statsCache.has(exerciseId)) {
      return this.statsCache.get(exerciseId)!;
    }

    try {
      // Em produção, isso faria uma chamada para o backend
      // Por enquanto, vamos gerar dados simulados realistas
      const stats = this.generateMockStats(exerciseId, exerciseName);
      
      // Cachear resultado
      this.statsCache.set(exerciseId, stats);
      
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return this.generateEmptyStats(exerciseId, exerciseName);
    }
  }

  /**
   * Gera estatísticas simuladas realistas baseadas no tipo de exercício
   */
  private generateMockStats(exerciseId: number, exerciseName: string): ExerciseStats {
    const exerciseType = this.getExerciseType(exerciseName);
    const baseWeight = this.getBaseWeight(exerciseType);
    const workoutCount = Math.floor(Math.random() * 50) + 10; // 10-60 treinos
    
    // Gerar histórico dos últimos 12 treinos
    const recentHistory = this.generateRecentHistory(baseWeight, exerciseType);
    const chartData = this.generateChartData(recentHistory);
    
    const weights = recentHistory.map(h => h.weight);
    const volumes = chartData.map(d => d.volume);
    const allReps = recentHistory.flatMap(h => Array(h.sets).fill(h.reps));
    
    const heaviestWeight = Math.max(...weights);
    const lastWeight = weights[weights.length - 1] || baseWeight;
    const bestVolume = Math.max(...volumes);
    const totalSets = recentHistory.reduce((sum, h) => sum + h.sets, 0);
    const totalReps = allReps.reduce((sum, reps) => sum + reps, 0);
    const averageReps = totalReps / totalSets;
    
    // Calcular progresso (comparando últimos 4 treinos com primeiros 4)
    const recent4 = recentHistory.slice(-4);
    const first4 = recentHistory.slice(0, 4);
    const recentAvg = recent4.reduce((sum, h) => sum + h.weight, 0) / recent4.length;
    const firstAvg = first4.reduce((sum, h) => sum + h.weight, 0) / first4.length;
    const progressPercentage = ((recentAvg - firstAvg) / firstAvg) * 100;

    // Personal Record (maior peso × reps)
    const prIndex = weights.indexOf(heaviestWeight);
    const personalRecord = {
      weight: heaviestWeight,
      reps: recentHistory[prIndex]?.reps || 8,
      date: recentHistory[prIndex]?.date || this.formatDate(new Date())
    };

    return {
      exerciseId,
      exerciseName,
      totalWorkouts: workoutCount,
      heaviestWeight,
      lastWeight,
      totalSets,
      totalReps,
      bestVolume,
      averageReps: Math.round(averageReps * 10) / 10,
      progressPercentage: Math.round(progressPercentage * 10) / 10,
      lastWorkoutDate: recentHistory[recentHistory.length - 1]?.date || this.formatDate(new Date()),
      personalRecord,
      recentHistory,
      chartData
    };
  }

  /**
   * Gera estatísticas vazias quando não há dados
   */
  private generateEmptyStats(exerciseId: number, exerciseName: string): ExerciseStats {
    return {
      exerciseId,
      exerciseName,
      totalWorkouts: 0,
      heaviestWeight: 0,
      lastWeight: 0,
      totalSets: 0,
      totalReps: 0,
      bestVolume: 0,
      averageReps: 0,
      progressPercentage: 0,
      lastWorkoutDate: 'Nunca',
      personalRecord: {
        weight: 0,
        reps: 0,
        date: 'Nunca'
      },
      recentHistory: [],
      chartData: []
    };
  }

  /**
   * Determina o tipo de exercício para gerar dados realistas
   */
  private getExerciseType(exerciseName: string): 'strength' | 'bodyweight' | 'cardio' | 'isolation' {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('supino') || name.includes('agachamento') || name.includes('terra') || 
        name.includes('desenvolvimento') || name.includes('press') || name.includes('deadlift') ||
        name.includes('squat') || name.includes('bench')) {
      return 'strength';
    }
    
    if (name.includes('flexão') || name.includes('barra') || name.includes('push') || 
        name.includes('pull') || name.includes('dip') || name.includes('chin')) {
      return 'bodyweight';
    }
    
    if (name.includes('rosca') || name.includes('elevação') || name.includes('curl') || 
        name.includes('extensão') || name.includes('fly') || name.includes('lateral')) {
      return 'isolation';
    }
    
    return 'strength';
  }

  private getBaseWeight(exerciseType: string): number {
    switch (exerciseType) {
      case 'strength':
        return Math.floor(Math.random() * 40) + 60; // 60-100kg
      case 'isolation':
        return Math.floor(Math.random() * 20) + 10; // 10-30kg
      case 'bodyweight':
        return 0; // Peso corporal
      default:
        return Math.floor(Math.random() * 30) + 20; // 20-50kg
    }
  }

  private generateRecentHistory(baseWeight: number, exerciseType: string) {
    const history = [];
    const now = new Date();
    const workoutCount = Math.floor(Math.random() * 15) + 8; // 8-23 treinos
    
    for (let i = workoutCount - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * Math.floor(Math.random() * 5) + 2)); // Treinos espaçados
      
      // Simular progressão realista
      const progressionFactor = 1 + ((workoutCount - i) / workoutCount) * 0.3; // Até 30% de aumento
      const variation = (Math.random() - 0.5) * 0.1; // ±5% de variação
      
      let weight = Math.round(baseWeight * progressionFactor * (1 + variation));
      if (exerciseType === 'bodyweight') weight = 0;
      
      const reps = this.getRealisticReps(exerciseType);
      const sets = Math.floor(Math.random() * 3) + 3; // 3-5 sets
      
      history.push({
        date: this.formatDate(date),
        weight,
        reps,
        sets
      });
    }
    
    return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private getRealisticReps(exerciseType: string): number {
    switch (exerciseType) {
      case 'strength':
        return Math.floor(Math.random() * 6) + 3; // 3-8 reps
      case 'isolation':
        return Math.floor(Math.random() * 8) + 8; // 8-15 reps
      case 'bodyweight':
        return Math.floor(Math.random() * 10) + 5; // 5-14 reps
      default:
        return Math.floor(Math.random() * 8) + 6; // 6-13 reps
    }
  }

  private generateChartData(recentHistory: any[]) {
    return recentHistory.map(workout => ({
      date: workout.date,
      weight: workout.weight,
      volume: workout.weight * workout.reps * workout.sets
    }));
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  clearCache(): void {
    this.statsCache.clear();
  }
}

export const exerciseStatsService = ExerciseStatsService.getInstance();
export type { ExerciseStats }; 