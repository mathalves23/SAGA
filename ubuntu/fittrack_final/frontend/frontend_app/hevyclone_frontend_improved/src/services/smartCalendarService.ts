// Serviço de Calendário Inteligente - SAGA Fitness
export interface SmartScheduleItem {
  id: string;
  date: string;
  time: string;
  type: 'treino' | 'descanso' | 'avaliacao' | 'cardio' | 'flexibilidade';
  title: string;
  description: string;
  duration: number; // minutos
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  workoutPlan?: string;
  exercises?: string[];
  adaptable: boolean;
  completed: boolean;
  skipped: boolean;
  rescheduled: boolean;
  originalDate?: string;
}

export interface CalendarOptimization {
  type: 'timing' | 'distribution' | 'recovery' | 'intensity';
  title: string;
  description: string;
  suggestion: string;
  impact: 'baixo' | 'medio' | 'alto';
  confidence: number; // 0-100
}

export interface UserPreferences {
  preferredTimes: string[];
  availableDays: string[];
  sessionDuration: number;
  restDayPreference: string[];
  workoutFrequency: number;
  intensityPreference: 'baixa' | 'media' | 'alta';
  goals: string[];
}

export interface PerformancePattern {
  timeOfDay: string;
  dayOfWeek: string;
  averagePerformance: number;
  consistency: number;
  energyLevel: number;
  completionRate: number;
}

export interface CalendarInsights {
  weeklySchedule: SmartScheduleItem[];
  optimizations: CalendarOptimization[];
  performancePatterns: PerformancePattern[];
  adherenceScore: number;
  nextRecommendations: string[];
  conflictAlerts: ConflictAlert[];
}

export interface ConflictAlert {
  type: 'overtraining' | 'undertraining' | 'poor_timing' | 'insufficient_rest';
  severity: 'baixa' | 'media' | 'alta';
  message: string;
  affectedDates: string[];
  suggestion: string;
}

class SmartCalendarService {
  
  // Gerar cronograma inteligente
  generateSmartSchedule(userPreferences: UserPreferences, weeks: number = 4): SmartScheduleItem[] {
    const schedule: SmartScheduleItem[] = [];
    const startDate = new Date();
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        const dayName = this.getDayName(currentDate.getDay());
        
        if (userPreferences.availableDays.includes(dayName.toLowerCase())) {
          const workoutItem = this.createWorkoutItem(currentDate, userPreferences, week, day);
          if (workoutItem) {
            schedule.push(workoutItem);
          }
        } else {
          const restItem = this.createRestItem(currentDate, userPreferences);
          schedule.push(restItem);
        }
      }
    }
    
    return this.optimizeSchedule(schedule, userPreferences);
  }

  // Analisar padrões de performance
  analyzePerformancePatterns(workoutHistory: any[]): PerformancePattern[] {
    const patterns: { [key: string]: any } = {};
    
    workoutHistory.forEach(workout => {
      const date = new Date(workout.date);
      const timeOfDay = this.getTimeOfDay(workout.time);
      const dayOfWeek = this.getDayName(date.getDay());
      const key = `${timeOfDay}_${dayOfWeek}`;
      
      if (!patterns[key]) {
        patterns[key] = {
          timeOfDay,
          dayOfWeek,
          performances: [],
          completions: 0,
          total: 0
        };
      }
      
      patterns[key].performances.push(workout.performanceScore || 75);
      patterns[key].total++;
      if (workout.completed) patterns[key].completions++;
    });
    
    return Object.values(patterns).map((pattern: any) => ({
      timeOfDay: pattern.timeOfDay,
      dayOfWeek: pattern.dayOfWeek,
      averagePerformance: this.calculateAverage(pattern.performances),
      consistency: this.calculateConsistency(pattern.performances),
      energyLevel: this.estimateEnergyLevel(pattern.timeOfDay),
      completionRate: (pattern.completions / pattern.total) * 100
    }));
  }

  // Gerar otimizações do calendário
  generateOptimizations(schedule: SmartScheduleItem[], patterns: PerformancePattern[]): CalendarOptimization[] {
    const optimizations: CalendarOptimization[] = [];
    
    // Análise de timing
    const bestPerformanceTimes = patterns
      .filter(p => p.averagePerformance > 80)
      .map(p => p.timeOfDay);
    
    if (bestPerformanceTimes.length > 0) {
      optimizations.push({
        type: 'timing',
        title: 'Otimização de Horário',
        description: `Seus melhores treinos acontecem ${bestPerformanceTimes.join(', ')}`,
        suggestion: `Agende mais treinos nos horários de melhor performance`,
        impact: 'alto',
        confidence: 85
      });
    }
    
    // Análise de distribuição
    const workoutDays = schedule.filter(item => item.type === 'treino').length;
    const totalDays = schedule.length;
    const workoutRatio = workoutDays / totalDays;
    
    if (workoutRatio > 0.6) {
      optimizations.push({
        type: 'distribution',
        title: 'Excesso de Treinos',
        description: 'Muitos dias de treino podem levar ao overtraining',
        suggestion: 'Adicione mais dias de descanso ativo',
        impact: 'medio',
        confidence: 75
      });
    }
    
    // Análise de recuperação
    const consecutiveWorkouts = this.findConsecutiveWorkouts(schedule);
    if (consecutiveWorkouts > 3) {
      optimizations.push({
        type: 'recovery',
        title: 'Recuperação Insuficiente',
        description: `${consecutiveWorkouts} dias consecutivos de treino detectados`,
        suggestion: 'Intercale com dias de descanso ou atividade leve',
        impact: 'alto',
        confidence: 90
      });
    }
    
    return optimizations;
  }

  // Detectar conflitos no calendário
  detectConflicts(schedule: SmartScheduleItem[]): ConflictAlert[] {
    const conflicts: ConflictAlert[] = [];
    
    // Verificar overtraining
    const highIntensityDays = schedule.filter(item => 
      item.type === 'treino' && item.priority === 'alta'
    );
    
    if (highIntensityDays.length > schedule.length * 0.4) {
      conflicts.push({
        type: 'overtraining',
        severity: 'alta',
        message: 'Muitos treinos de alta intensidade programados',
        affectedDates: highIntensityDays.map(item => item.date),
        suggestion: 'Reduza a intensidade de alguns treinos'
      });
    }
    
    // Verificar undertraining
    const workoutCount = schedule.filter(item => item.type === 'treino').length;
    if (workoutCount < 3) {
      conflicts.push({
        type: 'undertraining',
        severity: 'media',
        message: 'Poucos treinos programados para a semana',
        affectedDates: [],
        suggestion: 'Adicione pelo menos 3 treinos por semana'
      });
    }
    
    return conflicts;
  }

  // Adaptar cronograma baseado no feedback
  adaptSchedule(schedule: SmartScheduleItem[], feedback: any): SmartScheduleItem[] {
    const adaptedSchedule = [...schedule];
    
    // Adaptar baseado na performance
    if (feedback.performanceScore < 70) {
      // Reduzir intensidade
      adaptedSchedule.forEach(item => {
        if (item.type === 'treino' && item.priority === 'alta') {
          item.priority = 'media';
          item.duration = Math.max(item.duration - 15, 30);
        }
      });
    }
    
    // Adaptar baseado na aderência
    if (feedback.adherenceScore < 60) {
      // Simplificar cronograma
      const workoutItems = adaptedSchedule.filter(item => item.type === 'treino');
      workoutItems.forEach((item, index) => {
        if (index % 2 === 0) {
          item.duration = Math.max(item.duration - 10, 20);
          item.description = 'Treino simplificado para melhor aderência';
        }
      });
    }
    
    return adaptedSchedule;
  }

  // Sugerir reagendamentos
  suggestReschedule(item: SmartScheduleItem, reason: string): SmartScheduleItem[] {
    const suggestions: SmartScheduleItem[] = [];
    const originalDate = new Date(item.date);
    
    // Sugerir próximos 3 dias
    for (let i = 1; i <= 3; i++) {
      const newDate = new Date(originalDate);
      newDate.setDate(originalDate.getDate() + i);
      
      const newItem: SmartScheduleItem = {
        ...item,
        id: this.generateId(),
        date: newDate.toISOString().split('T')[0],
        rescheduled: true,
        originalDate: item.date,
        description: `${item.description} (Reagendado: ${reason})`
      };
      
      suggestions.push(newItem);
    }
    
    return suggestions;
  }

  // Gerar insights completos do calendário
  generateCalendarInsights(userPreferences: UserPreferences): CalendarInsights {
    const weeklySchedule = this.generateSmartSchedule(userPreferences, 1);
    const mockHistory = this.generateMockHistory();
    const performancePatterns = this.analyzePerformancePatterns(mockHistory);
    const optimizations = this.generateOptimizations(weeklySchedule, performancePatterns);
    const conflictAlerts = this.detectConflicts(weeklySchedule);
    
    return {
      weeklySchedule,
      optimizations,
      performancePatterns,
      adherenceScore: this.calculateAdherenceScore(mockHistory),
      nextRecommendations: this.generateNextRecommendations(performancePatterns),
      conflictAlerts
    };
  }

  // Métodos auxiliares privados
  private createWorkoutItem(date: Date, preferences: UserPreferences, week: number, day: number): SmartScheduleItem {
    const workoutTypes = ['treino', 'cardio', 'flexibilidade'];
    const type = week % 3 === 2 && day % 2 === 0 ? 'cardio' : 'treino';
    
    return {
      id: this.generateId(),
      date: date.toISOString().split('T')[0],
      time: this.getOptimalTime(preferences.preferredTimes),
      type: type as any,
      title: type === 'treino' ? 'Treino de Força' : 'Cardio',
      description: this.getWorkoutDescription(type, preferences.goals),
      duration: preferences.sessionDuration,
      priority: this.calculatePriority(week, day),
      workoutPlan: 'Plano Principal',
      exercises: this.getExercisesForType(type),
      adaptable: true,
      completed: false,
      skipped: false,
      rescheduled: false
    };
  }

  private createRestItem(date: Date, preferences: UserPreferences): SmartScheduleItem {
    return {
      id: this.generateId(),
      date: date.toISOString().split('T')[0],
      time: '09:00',
      type: 'descanso',
      title: 'Dia de Descanso',
      description: 'Recuperação ativa ou descanso completo',
      duration: 0,
      priority: 'baixa',
      adaptable: false,
      completed: false,
      skipped: false,
      rescheduled: false
    };
  }

  private optimizeSchedule(schedule: SmartScheduleItem[], preferences: UserPreferences): SmartScheduleItem[] {
    // Aplicar otimizações baseadas nas preferências
    return schedule.map(item => {
      if (item.type === 'treino') {
        // Ajustar horário baseado na preferência
        if (preferences.preferredTimes.length > 0) {
          item.time = preferences.preferredTimes[0];
        }
        
        // Ajustar duração baseada na preferência
        if (preferences.sessionDuration !== item.duration) {
          item.duration = preferences.sessionDuration;
        }
      }
      
      return item;
    });
  }

  private getDayName(dayIndex: number): string {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
  }

  private getTimeOfDay(time: string): string {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'manhã';
    if (hour < 18) return 'tarde';
    return 'noite';
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  private calculateConsistency(numbers: number[]): number {
    const avg = this.calculateAverage(numbers);
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - avg, 2), 0) / numbers.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  private estimateEnergyLevel(timeOfDay: string): number {
    const energyLevels = {
      'manhã': 85,
      'tarde': 90,
      'noite': 70
    };
    return energyLevels[timeOfDay as keyof typeof energyLevels] || 75;
  }

  private findConsecutiveWorkouts(schedule: SmartScheduleItem[]): number {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    schedule.forEach(item => {
      if (item.type === 'treino') {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    });
    
    return maxConsecutive;
  }

  private getOptimalTime(preferredTimes: string[]): string {
    return preferredTimes.length > 0 ? preferredTimes[0] : '15:00';
  }

  private calculatePriority(week: number, day: number): 'baixa' | 'media' | 'alta' | 'critica' {
    if (week === 0 && day < 2) return 'alta'; // Primeira semana, primeiros dias
    if (day % 3 === 0) return 'media';
    return 'baixa';
  }

  private getWorkoutDescription(type: string, goals: string[]): string {
    const descriptions = {
      'treino': `Treino focado em ${goals[0] || 'força'}`,
      'cardio': 'Exercício cardiovascular para resistência',
      'flexibilidade': 'Alongamento e mobilidade'
    };
    return descriptions[type as keyof typeof descriptions] || 'Atividade física';
  }

  private getExercisesForType(type: string): string[] {
    const exercises = {
      'treino': ['Agachamento', 'Supino', 'Remada', 'Desenvolvimento'],
      'cardio': ['Esteira', 'Bicicleta', 'Elíptico'],
      'flexibilidade': ['Alongamento', 'Yoga', 'Pilates']
    };
    return exercises[type as keyof typeof exercises] || [];
  }

  private generateMockHistory(): any[] {
    const history = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      history.push({
        date: date.toISOString(),
        time: '15:00',
        performanceScore: Math.floor(Math.random() * 30) + 70,
        completed: Math.random() > 0.2
      });
    }
    
    return history;
  }

  private calculateAdherenceScore(history: any[]): number {
    const completed = history.filter(h => h.completed).length;
    return Math.round((completed / history.length) * 100);
  }

  private generateNextRecommendations(patterns: PerformancePattern[]): string[] {
    const recommendations = [];
    
    const bestTime = patterns.reduce((best, current) => 
      current.averagePerformance > best.averagePerformance ? current : best
    );
    
    recommendations.push(`Agende treinos ${bestTime.timeOfDay} para melhor performance`);
    
    const lowConsistency = patterns.filter(p => p.consistency < 70);
    if (lowConsistency.length > 0) {
      recommendations.push('Foque na consistência nos horários de menor performance');
    }
    
    recommendations.push('Mantenha pelo menos 1 dia de descanso entre treinos intensos');
    
    return recommendations;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos públicos para uso na interface
  getUserPreferences(): UserPreferences {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      preferredTimes: ['15:00'],
      availableDays: ['segunda', 'quarta', 'sexta'],
      sessionDuration: 60,
      restDayPreference: ['domingo'],
      workoutFrequency: 3,
      intensityPreference: 'media',
      goals: ['hipertrofia']
    };
  }

  saveUserPreferences(preferences: UserPreferences): void {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  getScheduleForDate(date: string): SmartScheduleItem | null {
    const preferences = this.getUserPreferences();
    const schedule = this.generateSmartSchedule(preferences, 4);
    return schedule.find(item => item.date === date) || null;
  }

  markItemCompleted(itemId: string): void {
    // Implementar lógica para marcar item como completo
    console.log(`Item ${itemId} marcado como completo`);
  }

  rescheduleItem(itemId: string, newDate: string, newTime: string): void {
    // Implementar lógica para reagendar item
    console.log(`Item ${itemId} reagendado para ${newDate} às ${newTime}`);
  }
}

export const smartCalendarService = new SmartCalendarService(); 