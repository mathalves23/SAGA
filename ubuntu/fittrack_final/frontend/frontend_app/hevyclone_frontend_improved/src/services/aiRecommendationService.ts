// Serviço de IA para Recomendações Personalizadas - SAGA Fitness
export interface WorkoutData {
  id: string;
  date: string;
  duration: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      reps: string;
      weight: string;
      restTime?: string;
    }>;
  }>;
  notes?: string;
  savedAt: string;
}

export interface ExerciseRecommendation {
  name: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  suggestedSets: number;
  suggestedReps: string;
  suggestedWeight: string;
  muscleGroups: string[];
}

export interface RestRecommendation {
  exercise: string;
  currentRest: number;
  recommendedRest: number;
  reason: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface LoadPrediction {
  exercise: string;
  currentWeight: number;
  predictedWeight: number;
  progressionType: 'linear' | 'conservative' | 'aggressive';
  confidence: number;
  reason: string;
}

export interface OvertrainingAlert {
  severity: 'warning' | 'danger' | 'critical';
  type: 'volume' | 'frequency' | 'intensity' | 'recovery';
  message: string;
  recommendation: string;
  metrics: {
    current: number;
    threshold: number;
    unit: string;
  };
}

export interface AIInsights {
  exerciseRecommendations: ExerciseRecommendation[];
  restRecommendations: RestRecommendation[];
  loadPredictions: LoadPrediction[];
  overtrainingAlerts: OvertrainingAlert[];
  weeklyAnalysis: {
    totalVolume: number;
    averageIntensity: number;
    recoveryScore: number;
    progressTrend: 'improving' | 'plateau' | 'declining';
  };
  personalizedTips: string[];
}

class AIRecommendationService {
  
  // Banco de dados de exercícios com informações de músculos
  private readonly EXERCISE_DATABASE = {
    'Supino Reto': { muscleGroups: ['peitoral', 'tríceps', 'ombros'], category: 'Peito', restTime: 180 },
    'Agachamento': { muscleGroups: ['quadríceps', 'glúteos', 'posteriores'], category: 'Pernas', restTime: 240 },
    'Levantamento Terra': { muscleGroups: ['posteriores', 'glúteos', 'lombar', 'trapézio'], category: 'Costas', restTime: 300 },
    'Remada Curvada': { muscleGroups: ['latíssimo', 'romboides', 'bíceps'], category: 'Costas', restTime: 180 },
    'Desenvolvimento': { muscleGroups: ['ombros', 'tríceps'], category: 'Ombros', restTime: 180 },
    'Rosca Direta': { muscleGroups: ['bíceps'], category: 'Braços', restTime: 120 },
    'Tríceps Testa': { muscleGroups: ['tríceps'], category: 'Braços', restTime: 120 },
    'Leg Press': { muscleGroups: ['quadríceps', 'glúteos'], category: 'Pernas', restTime: 180 },
    'Puxada': { muscleGroups: ['latíssimo', 'bíceps'], category: 'Costas', restTime: 180 },
    'Flexão': { muscleGroups: ['peitoral', 'tríceps', 'ombros'], category: 'Peito', restTime: 120 }
  };

  // Exercícios complementares por grupo muscular
  private readonly COMPLEMENTARY_EXERCISES = {
    'peitoral': ['Supino Inclinado', 'Crucifixo', 'Paralelas', 'Flexão Diamante'],
    'costas': ['Puxada Frontal', 'Remada Cavalinho', 'Pullover', 'Face Pull'],
    'pernas': ['Afundo', 'Stiff', 'Panturrilha', 'Cadeira Extensora'],
    'ombros': ['Elevação Lateral', 'Elevação Frontal', 'Encolhimento', 'Desenvolvimento Arnold'],
    'braços': ['Rosca Martelo', 'Tríceps Francês', 'Rosca Concentrada', 'Mergulho']
  };

  // Analisar histórico e gerar recomendações de IA
  generateAIInsights(): AIInsights {
    try {
      const workouts = this.getWorkoutHistory();
      
      if (workouts.length === 0) {
        return this.getDefaultInsights();
      }

      const exerciseRecommendations = this.generateExerciseRecommendations(workouts);
      const restRecommendations = this.generateRestRecommendations(workouts);
      const loadPredictions = this.generateLoadPredictions(workouts);
      const overtrainingAlerts = this.detectOvertraining(workouts);
      const weeklyAnalysis = this.analyzeWeeklyPatterns(workouts);
      const personalizedTips = this.generatePersonalizedTips(workouts);

      return {
        exerciseRecommendations,
        restRecommendations,
        loadPredictions,
        overtrainingAlerts,
        weeklyAnalysis,
        personalizedTips
      };
      
    } catch (error) {
    console.error('Erro ao gerar insights de IA:', error);
      return this.getDefaultInsights();
    }
  }

  // Sugerir exercícios baseado no histórico
  private generateExerciseRecommendations(workouts: WorkoutData[]): ExerciseRecommendation[] {
    const recommendations: ExerciseRecommendation[] = [];
    
    // Analisar frequência de grupos musculares
    const muscleGroupFrequency = this.analyzeMuscleGroupFrequency(workouts);
    const recentExercises = this.getRecentExercises(workouts, 7); // Últimos 7 dias
    
    // Identificar grupos musculares negligenciados
    const underworkedMuscles = this.findUnderworkedMuscles(muscleGroupFrequency);
    
    underworkedMuscles.forEach(muscle => {
      const suggestions = this.COMPLEMENTARY_EXERCISES[muscle] || [];
      suggestions.slice(0, 2).forEach(exercise => {
        if (!recentExercises.includes(exercise)) {
          recommendations.push({
            name: exercise,
            reason: `Grupo muscular "${muscle}" está sendo pouco trabalhado`,
            priority: 'high',
            category: this.getCategoryForMuscle(muscle),
            suggestedSets: 3,
            suggestedReps: '8-12',
            suggestedWeight: 'Moderado',
            muscleGroups: [muscle]
          });
        }
      });
    });

    // Sugerir progressão para exercícios frequentes
    const frequentExercises = this.getMostFrequentExercises(workouts);
    frequentExercises.slice(0, 3).forEach(exercise => {
      const progression = this.suggestProgression(exercise, workouts);
      if (progression) {
        recommendations.push(progression);
      }
    });

    // Sugerir exercícios de aquecimento
    if (this.needsWarmupExercises(workouts)) {
      recommendations.push({
        name: 'Exercícios de Aquecimento',
        reason: 'Detectamos pouco aquecimento nos seus treinos',
        priority: 'medium',
        category: 'Aquecimento',
        suggestedSets: 2,
        suggestedReps: '10-15',
        suggestedWeight: 'Leve',
        muscleGroups: ['mobilidade']
      });
    }

    return recommendations.slice(0, 5); // Limitar a 5 recomendações
  }

  // Recomendar intervalos de descanso
  private generateRestRecommendations(workouts: WorkoutData[]): RestRecommendation[] {
    const recommendations: RestRecommendation[] = [];
    const exerciseRestAnalysis = this.analyzeRestPatterns(workouts);
    
    Object.entries(exerciseRestAnalysis).forEach(([exercise, data]: [string, any]) => {
      const optimal = this.EXERCISE_DATABASE[exercise]?.restTime || 120;
      const current = data.averageRest;
      
      if (Math.abs(current - optimal) > 30) {
        recommendations.push({
          exercise,
          currentRest: current,
          recommendedRest: optimal,
          reason: this.getRestReasoningIssue(current, optimal, data.intensity),
          intensity: data.intensity
        });
      }
    });

    return recommendations.slice(0, 4);
  }

  // Prever cargas para próximos treinos
  private generateLoadPredictions(workouts: WorkoutData[]): LoadPrediction[] {
    const predictions: LoadPrediction[] = [];
    const exerciseProgressions = this.analyzeProgressions(workouts);
    
    Object.entries(exerciseProgressions).forEach(([exercise, data]: [string, any]) => {
      if (data.sessions >= 3) {
        const prediction = this.predictNextLoad(exercise, data);
        if (prediction) {
          predictions.push(prediction);
        }
      }
    });

    return predictions.slice(0, 4);
  }

  // Detectar sinais de overtraining
  private detectOvertraining(workouts: WorkoutData[]): OvertrainingAlert[] {
    const alerts: OvertrainingAlert[] = [];
    const weeklyData = this.getWeeklyMetrics(workouts);
    
    if (weeklyData.totalSets > 150) {
      alerts.push({
        severity: 'warning',
        type: 'volume',
        message: 'Volume de treino muito alto detectado',
        recommendation: 'Considere reduzir o número de séries ou exercícios',
        metrics: {
          current: weeklyData.totalSets,
          threshold: 150,
          unit: 'séries por semana'
        }
      });
    }

    if (weeklyData.workoutDays > 6) {
      alerts.push({
        severity: 'danger',
        type: 'frequency',
        message: 'Treinando com muita frequência',
        recommendation: 'Inclua pelo menos 1 dia de descanso completo por semana',
        metrics: {
          current: weeklyData.workoutDays,
          threshold: 6,
          unit: 'dias por semana'
        }
      });
    }

    if (weeklyData.averageRestBetweenWorkouts < 24) {
      alerts.push({
        severity: 'warning',
        type: 'recovery',
        message: 'Tempo de recuperação insuficiente',
        recommendation: 'Aumente o intervalo entre treinos intensos',
        metrics: {
          current: weeklyData.averageRestBetweenWorkouts,
          threshold: 24,
          unit: 'horas'
        }
      });
    }

    return alerts;
  }

  // Analisar padrões semanais
  private analyzeWeeklyPatterns(workouts: WorkoutData[]): any {
    const recentWorkouts = this.getRecentWorkouts(workouts, 7);
    
    const totalVolume = this.calculateTotalVolume(recentWorkouts);
    const averageIntensity = this.calculateAverageIntensity(recentWorkouts);
    const recoveryScore = this.calculateRecoveryScore(recentWorkouts);
    const progressTrend = this.analyzeProgressTrend(workouts);

    return {
      totalVolume,
      averageIntensity,
      recoveryScore,
      progressTrend
    };
  }

  // Gerar dicas personalizadas
  private generatePersonalizedTips(workouts: WorkoutData[]): string[] {
    const tips: string[] = [];
    const analysis = this.analyzeUserPatterns(workouts);

    if (analysis.consistencyScore < 70) {
      tips.push('🎯 Tente manter uma rotina mais consistente. A regularidade é chave para o progresso!');
    }

    if (analysis.averageWorkoutDuration < 30) {
      tips.push('⏱️ Seus treinos estão curtos. Considere aumentar o tempo para 45-60 minutos.');
    }

    if (analysis.varietyScore < 50) {
      tips.push('🔄 Adicione mais variedade aos seus exercícios para estimular diferentes músculos.');
    }

    if (analysis.progressionRate > 0.1) {
      tips.push('🚀 Ótimo progresso! Continue aumentando as cargas gradualmente.');
    } else {
      tips.push('📈 Tente aumentar as cargas ou repetições a cada 2-3 semanas.');
    }

    return tips.slice(0, 4);
  }

  // Métodos auxiliares
  private getWorkoutHistory(): WorkoutData[] {
    try {
      return JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    } catch {
      return [];
    }
  }

  private analyzeMuscleGroupFrequency(workouts: WorkoutData[]): { [muscle: string]: number } {
    const frequency: { [muscle: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const muscleGroups = this.EXERCISE_DATABASE[exercise.name]?.muscleGroups || [];
        muscleGroups.forEach(muscle => {
          frequency[muscle] = (frequency[muscle] || 0) + 1;
        });
      });
    });

    return frequency;
  }

  private findUnderworkedMuscles(frequency: { [muscle: string]: number }): string[] {
    const allMuscles = ['peitoral', 'costas', 'pernas', 'ombros', 'braços'];
    const totalWorkouts = Object.values(frequency).reduce((sum, count) => sum + count, 0);
    const averageFrequency = totalWorkouts / allMuscles.length;
    
    return allMuscles.filter(muscle => (frequency[muscle] || 0) < averageFrequency * 0.7);
  }

  private getRecentExercises(workouts: WorkoutData[], days: number): string[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentExercises: string[] = [];
    workouts
      .filter(w => new Date(w.date) >= cutoffDate)
      .forEach(workout => {
        workout.exercises?.forEach(exercise => {
          if (!recentExercises.includes(exercise.name)) {
            recentExercises.push(exercise.name);
          }
        });
      });
    
    return recentExercises;
  }

  private getMostFrequentExercises(workouts: WorkoutData[]): string[] {
    const exerciseCount: { [name: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
      });
    });

    return Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);
  }

  private analyzeRestPatterns(workouts: WorkoutData[]): { [exercise: string]: any } {
    const patterns: { [exercise: string]: any } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        if (!patterns[exercise.name]) {
          patterns[exercise.name] = { totalRest: 0, count: 0, intensity: 'medium' };
        }
        
        const estimatedRest = this.estimateRestTime(exercise);
        patterns[exercise.name].totalRest += estimatedRest;
        patterns[exercise.name].count += 1;
      });
    });

    Object.keys(patterns).forEach(exercise => {
      patterns[exercise].averageRest = patterns[exercise].totalRest / patterns[exercise].count;
    });

    return patterns;
  }

  private analyzeProgressions(workouts: WorkoutData[]): { [exercise: string]: any } {
    const progressions: { [exercise: string]: any } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        if (!progressions[exercise.name]) {
          progressions[exercise.name] = { weights: [], sessions: 0 };
        }
        
        exercise.sets?.forEach(set => {
          const weight = parseFloat(set.weight || '0');
          if (weight > 0) {
            progressions[exercise.name].weights.push({
              weight,
              date: workout.date,
              reps: parseInt(set.reps || '0')
            });
          }
        });
        
        progressions[exercise.name].sessions++;
      });
    });

    return progressions;
  }

  private predictNextLoad(exercise: string, data: any): LoadPrediction | null {
    if (data.weights.length < 3) return null;
    
    const sortedWeights = data.weights.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentWeights = sortedWeights.slice(-5);
    
    const currentWeight = recentWeights[recentWeights.length - 1].weight;
    const previousWeight = recentWeights[recentWeights.length - 2]?.weight || currentWeight;
    
    const progressionRate = (currentWeight - previousWeight) / previousWeight;
    
    let predictedWeight = currentWeight;
    let progressionType: 'linear' | 'conservative' | 'aggressive' = 'conservative';
    
    if (progressionRate > 0.1) {
      predictedWeight = currentWeight * 1.05;
      progressionType = 'aggressive';
    } else if (progressionRate > 0.05) {
      predictedWeight = currentWeight * 1.025;
      progressionType = 'linear';
    } else {
      predictedWeight = currentWeight * 1.01;
    }

    const confidence = Math.min(95, 60 + (data.sessions * 5));

    return {
      exercise,
      currentWeight,
      predictedWeight: Math.round(predictedWeight * 100) / 100,
      progressionType,
      confidence,
      reason: this.getProgressionReason(progressionRate, data.sessions)
    };
  }

  private getWeeklyMetrics(workouts: WorkoutData[]): any {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
    
    const totalSets = weeklyWorkouts.reduce((sum, workout) => {
      return sum + (workout.exercises?.reduce((exerciseSum, exercise) => {
        return exerciseSum + (exercise.sets?.length || 0);
      }, 0) || 0);
    }, 0);

    const workoutDays = new Set(weeklyWorkouts.map(w => w.date.split('T')[0])).size;
    
    // Calcular tempo médio entre treinos
    const workoutDates = weeklyWorkouts.map(w => new Date(w.date)).sort((a, b) => a.getTime() - b.getTime());
    let averageRestBetweenWorkouts = 48; // Default
    
    if (workoutDates.length > 1) {
      const intervals = [];
      for (let i = 1; i < workoutDates.length; i++) {
        const hours = (workoutDates[i].getTime() - workoutDates[i-1].getTime()) / (1000 * 60 * 60);
        intervals.push(hours);
      }
      averageRestBetweenWorkouts = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    }

    return {
      totalSets,
      workoutDays,
      averageRestBetweenWorkouts
    };
  }

  private analyzeUserPatterns(workouts: WorkoutData[]): any {
    const totalWorkouts = workouts.length;
    if (totalWorkouts === 0) {
      return {
        consistencyScore: 0,
        averageWorkoutDuration: 0,
        varietyScore: 0,
        progressionRate: 0
      };
    }

    const durations = workouts.map(w => parseInt(w.duration?.replace(' min', '') || '0'));
    const averageWorkoutDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    const exerciseVariety = new Set();
    workouts.forEach(w => {
      w.exercises?.forEach(e => exerciseVariety.add(e.name));
    });
    const varietyScore = Math.min(100, (exerciseVariety.size / totalWorkouts) * 100);

    return {
      consistencyScore: Math.min(100, (totalWorkouts / 4) * 25),
      averageWorkoutDuration,
      varietyScore,
      progressionRate: 0.05
    };
  }

  private calculateTotalVolume(workouts: WorkoutData[]): number {
    return workouts.reduce((sum, workout) => {
      return sum + (workout.exercises?.reduce((exerciseSum, exercise) => {
        return exerciseSum + (exercise.sets?.reduce((setSum, set) => {
          const weight = parseFloat(set.weight || '0');
          const reps = parseInt(set.reps || '0');
          return setSum + (weight * reps);
        }, 0) || 0);
      }, 0) || 0);
    }, 0);
  }

  private calculateAverageIntensity(workouts: WorkoutData[]): number {
    if (workouts.length === 0) return 0;
    
    const intensityScores = workouts.map(workout => {
      const duration = parseInt(workout.duration?.replace(' min', '') || '0');
      const exerciseCount = workout.exercises?.length || 0;
      return (duration / 60) * exerciseCount;
    });

    return intensityScores.reduce((sum, score) => sum + score, 0) / intensityScores.length;
  }

  private calculateRecoveryScore(workouts: WorkoutData[]): number {
    if (workouts.length < 2) return 80;
    
    const dates = workouts.map(w => new Date(w.date)).sort((a, b) => a.getTime() - b.getTime());
    const intervals = [];
    
    for (let i = 1; i < dates.length; i++) {
      const hours = (dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60);
      intervals.push(hours);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    
    if (avgInterval >= 24 && avgInterval <= 48) return 90;
    if (avgInterval >= 12 && avgInterval <= 72) return 70;
    return 50;
  }

  private analyzeProgressTrend(workouts: WorkoutData[]): 'improving' | 'plateau' | 'declining' {
    const progressScore = this.calculateProgressScore(workouts);
    
    if (progressScore > 70) return 'improving';
    if (progressScore > 40) return 'plateau';
    return 'declining';
  }

  private calculateProgressScore(workouts: WorkoutData[]): number {
    if (workouts.length < 5) return 50;
    
    const recentVolume = this.calculateTotalVolume(workouts.slice(-5));
    const oldVolume = this.calculateTotalVolume(workouts.slice(-10, -5));
    
    if (oldVolume === 0) return 70;
    
    const improvement = ((recentVolume - oldVolume) / oldVolume) * 100;
    return Math.max(0, Math.min(100, 50 + improvement));
  }

  private getRecentWorkouts(workouts: WorkoutData[], days: number): WorkoutData[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return workouts.filter(w => new Date(w.date) >= cutoffDate);
  }

  // Métodos utilitários
  private getCategoryForMuscle(muscle: string): string {
    const categories: { [key: string]: string } = {
      'peitoral': 'Peito', 'costas': 'Costas', 'pernas': 'Pernas',
      'ombros': 'Ombros', 'braços': 'Braços'
    };
    return categories[muscle] || 'Geral';
  }

  private estimateRestTime(exercise: any): number {
    const sets = exercise.sets?.length || 3;
    const avgWeight = exercise.sets?.reduce((sum: number, set: any) => sum + (parseFloat(set.weight) || 0), 0) / sets;
    
    if (avgWeight > 100) return 180;
    if (avgWeight > 50) return 150;
    return 120;
  }

  private getRestReasoningIssue(current: number, optimal: number, intensity: string): string {
    if (current < optimal - 30) {
      return `Descanso muito curto para ${intensity} intensidade.`;
    } else {
      return `Descanso muito longo. Pode reduzir eficiência.`;
    }
  }

  private getProgressionReason(rate: number, sessions: number): string {
    if (rate > 0.1) return `Progresso excelente! Baseado em ${sessions} sessões.`;
    if (rate > 0.05) return `Progresso constante. Continue assim!`;
    return `Progresso conservador recomendado.`;
  }

  private needsWarmupExercises(workouts: WorkoutData[]): boolean {
    const warmupExercises = ['Aquecimento', 'Esteira', 'Bicicleta', 'Alongamento'];
    
    return workouts.slice(-5).every(workout => {
      return !workout.exercises?.some(exercise => 
        warmupExercises.some(warmup => 
          exercise.name.toLowerCase().includes(warmup.toLowerCase())
        )
      );
    });
  }

  private suggestProgression(exercise: string, workouts: WorkoutData[]): ExerciseRecommendation | null {
    const exerciseData = workouts.flatMap(w => 
      w.exercises?.filter(e => e.name === exercise) || []
    ).slice(-3);

    if (exerciseData.length === 0) return null;

    const lastSession = exerciseData[exerciseData.length - 1];
    const avgWeight = lastSession.sets?.reduce((sum, set) => sum + (parseFloat(set.weight || '0')), 0) / (lastSession.sets?.length || 1);
    
    if (avgWeight > 0) {
      return {
        name: exercise,
        reason: 'Progresso detectado. Hora de aumentar a carga!',
        priority: 'high',
        category: this.EXERCISE_DATABASE[exercise]?.category || 'Geral',
        suggestedSets: lastSession.sets?.length || 3,
        suggestedReps: '8-10',
        suggestedWeight: `${(avgWeight * 1.05).toFixed(1)}kg`,
        muscleGroups: this.EXERCISE_DATABASE[exercise]?.muscleGroups || []
      };
    }

    return null;
  }

  private getDefaultInsights(): AIInsights {
    return {
      exerciseRecommendations: [
        {
          name: 'Agachamento',
          reason: 'Exercício fundamental para construir força nas pernas',
          priority: 'high',
          category: 'Pernas',
          suggestedSets: 3,
          suggestedReps: '8-12',
          suggestedWeight: 'Moderado',
          muscleGroups: ['quadríceps', 'glúteos']
        }
      ],
      restRecommendations: [],
      loadPredictions: [],
      overtrainingAlerts: [],
      weeklyAnalysis: {
        totalVolume: 0,
        averageIntensity: 0,
        recoveryScore: 80,
        progressTrend: 'plateau'
      },
      personalizedTips: [
        '🎯 Comece com exercícios básicos para construir uma base sólida',
        '📈 Registre seus treinos para que a IA possa gerar recomendações personalizadas'
      ]
    };
  }
}

export const aiRecommendationService = new AIRecommendationService(); 