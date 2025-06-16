// Serviço de Coach Virtual - SAGA Fitness
export interface AdaptiveWorkoutPlan {
  id: string;
  name: string;
  goal: 'força' | 'hipertrofia' | 'resistencia' | 'perda_peso';
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  workoutsPerWeek: number;
  currentWeek: number;
  exercises: AdaptiveExercise[];
  progressScore: number;
}

export interface AdaptiveExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: number;
  adaptationHistory: ExerciseAdaptation[];
}

export interface ExerciseAdaptation {
  date: string;
  reason: string;
  changes: string[];
  performanceScore: number;
}

export interface FormAnalysis {
  exerciseName: string;
  overallScore: number;
  analysis: {
    posture: { score: number; feedback: string };
    range: { score: number; feedback: string };
    tempo: { score: number; feedback: string };
    stability: { score: number; feedback: string };
  };
  recommendations: string[];
  correctionTips: string[];
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: { protein: number; carbs: number; fats: number };
  meals: Meal[];
  supplements: Supplement[];
}

export interface Meal {
  name: string;
  time: string;
  calories: number;
  foods: string[];
}

export interface Supplement {
  name: string;
  dosage: string;
  timing: string;
  benefits: string[];
}

export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  type: 'treino' | 'descanso' | 'avaliacao';
  workoutPlan?: string;
  exercises?: string[];
  duration: number;
  priority: 'baixa' | 'media' | 'alta';
}

export interface CoachRecommendation {
  type: 'exercise' | 'rest' | 'nutrition' | 'schedule' | 'form';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  title: string;
  message: string;
  action: string;
  category: string;
}

class VirtualCoachService {
  
  // Gerar plano adaptativo
  generateAdaptivePlan(userProfile: any): AdaptiveWorkoutPlan {
    const exercises = this.createAdaptiveExercises(userProfile);
    
    return {
      id: this.generateId(),
      name: `Plano ${userProfile.goal} - ${userProfile.fitnessLevel}`,
      goal: userProfile.goal,
      difficulty: userProfile.fitnessLevel,
      workoutsPerWeek: this.getWorkoutsPerWeek(userProfile),
      currentWeek: 1,
      exercises,
      progressScore: 0
    };
  }

  // Análise de forma via vídeo (simulada)
  analyzeVideoForm(exerciseName: string): FormAnalysis {
    return {
      exerciseName,
      overallScore: Math.floor(Math.random() * 20) + 80,
      analysis: {
        posture: {
          score: Math.floor(Math.random() * 15) + 85,
          feedback: 'Mantenha o peito aberto e ombros para trás'
        },
        range: {
          score: Math.floor(Math.random() * 20) + 80,
          feedback: 'Amplitude de movimento adequada'
        },
        tempo: {
          score: Math.floor(Math.random() * 25) + 75,
          feedback: 'Controle melhor a fase excêntrica'
        },
        stability: {
          score: Math.floor(Math.random() * 15) + 85,
          feedback: 'Core ativado durante o movimento'
        }
      },
      recommendations: [
        'Foque na respiração durante o movimento',
        'Mantenha o core contraído',
        'Controle a velocidade de execução'
      ],
      correctionTips: [
        'Pratique o movimento sem peso primeiro',
        'Use espelho para verificar a forma',
        'Diminua a carga se necessário'
      ]
    };
  }

  // Gerar plano nutricional integrado
  generateNutritionPlan(userProfile: any): NutritionPlan {
    const calories = this.calculateCalories(userProfile);
    
    return {
      dailyCalories: calories,
      macros: {
        protein: 30,
        carbs: 40,
        fats: 30
      },
      meals: [
        {
          name: 'Café da Manhã',
          time: '07:00',
          calories: Math.round(calories * 0.25),
          foods: ['Aveia', 'Banana', 'Whey Protein']
        },
        {
          name: 'Pré-treino',
          time: '14:30',
          calories: Math.round(calories * 0.15),
          foods: ['Banana', 'Café']
        },
        {
          name: 'Pós-treino',
          time: '16:30',
          calories: Math.round(calories * 0.20),
          foods: ['Whey Protein', 'Batata Doce']
        },
        {
          name: 'Jantar',
          time: '19:00',
          calories: Math.round(calories * 0.30),
          foods: ['Frango', 'Arroz', 'Brócolis']
        }
      ],
      supplements: [
        {
          name: 'Whey Protein',
          dosage: '30g',
          timing: 'Pós-treino',
          benefits: ['Síntese proteica', 'Recuperação muscular']
        },
        {
          name: 'Creatina',
          dosage: '5g',
          timing: 'Qualquer horário',
          benefits: ['Força', 'Potência', 'Volume muscular']
        },
        {
          name: 'Multivitamínico',
          dosage: '1 comprimido',
          timing: 'Manhã com alimento',
          benefits: ['Saúde geral', 'Imunidade']
        }
      ]
    };
  }

  // Gerar calendário inteligente
  generateSmartSchedule(userProfile: any): ScheduleItem[] {
    const schedule: ScheduleItem[] = [];
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    days.forEach((day, index) => {
      if (userProfile.availableDays?.includes(day.toLowerCase())) {
        schedule.push({
          id: this.generateId(),
          date: this.getDateForDay(index),
          time: this.getOptimalTime(userProfile.preferredTime),
          type: 'treino',
          workoutPlan: 'Plano Principal',
          exercises: this.getWorkoutExercises(userProfile.goal),
          duration: userProfile.sessionDuration || 60,
          priority: 'alta'
        });
      } else {
        schedule.push({
          id: this.generateId(),
          date: this.getDateForDay(index),
          time: '09:00',
          type: 'descanso',
          duration: 0,
          priority: 'baixa'
        });
      }
    });
    
    return schedule;
  }

  // Gerar recomendações do coach
  generateCoachRecommendations(userData: any): CoachRecommendation[] {
    const recommendations: CoachRecommendation[] = [];
    
    // Análise de consistência
    if (userData.consistencyScore < 70) {
      recommendations.push({
        type: 'schedule',
        priority: 'alta',
        title: 'Melhore sua Consistência',
        message: 'Você tem faltado alguns treinos. Vamos ajustar seu cronograma?',
        action: 'Revisar horários de treino',
        category: 'Disciplina'
      });
    }

    // Análise de forma
    if (userData.formScore < 75) {
      recommendations.push({
        type: 'form',
        priority: 'critica',
        title: 'Correção de Forma Necessária',
        message: 'Detectamos problemas na execução dos exercícios',
        action: 'Revisar técnica com vídeos',
        category: 'Técnica'
      });
    }

    // Análise de recuperação
    if (userData.recoveryScore < 60) {
      recommendations.push({
        type: 'rest',
        priority: 'media',
        title: 'Foco na Recuperação',
        message: 'Seu corpo precisa de mais descanso para crescer.',
        action: 'Adicionar dia de descanso ativo',
        category: 'Recuperação'
      });
    }

    // Análise nutricional
    if (userData.nutritionScore < 70) {
      recommendations.push({
        type: 'nutrition',
        priority: 'alta',
        title: 'Otimize sua Nutrição',
        message: 'Sua alimentação pode estar limitando seus resultados.',
        action: 'Seguir plano nutricional personalizado',
        category: 'Nutrição'
      });
    }

    return recommendations;
  }

  // Adaptar plano baseado no progresso
  adaptPlan(plan: AdaptiveWorkoutPlan, performanceData: any): AdaptiveWorkoutPlan {
    const updatedPlan = { ...plan };
    const performanceScore = this.calculatePerformanceScore(performanceData);
    
    // Aplicar adaptações baseadas na performance
    if (performanceScore >= 85) {
      // Aumentar intensidade
      updatedPlan.exercises = updatedPlan.exercises.map(exercise => ({
        ...exercise,
        sets: Math.min(exercise.sets + 1, 6),
        weight: this.increaseWeight(exercise.weight)
      }));
    } else if (performanceScore < 60) {
      // Reduzir intensidade
      updatedPlan.exercises = updatedPlan.exercises.map(exercise => ({
        ...exercise,
        sets: Math.max(exercise.sets - 1, 2),
        weight: this.decreaseWeight(exercise.weight)
      }));
    }

    updatedPlan.progressScore = performanceScore;
    return updatedPlan;
  }

  // Métodos auxiliares privados
  private createAdaptiveExercises(userProfile: any): AdaptiveExercise[] {
    const exerciseTemplates = this.getExerciseTemplates(userProfile.goal, userProfile.fitnessLevel);
    
    return exerciseTemplates.map(template => ({
      id: this.generateId(),
      name: template.name,
      sets: template.sets,
      reps: template.reps,
      weight: template.weight,
      restTime: template.restTime,
      adaptationHistory: []
    }));
  }

  private getExerciseTemplates(goal: string, level: string): any[] {
    const templates = {
      hipertrofia: {
        iniciante: [
          { name: 'Agachamento', sets: 3, reps: '8-12', weight: '40kg', restTime: 120 },
          { name: 'Supino Reto', sets: 3, reps: '8-12', weight: '30kg', restTime: 120 },
          { name: 'Remada Curvada', sets: 3, reps: '8-12', weight: '25kg', restTime: 120 },
          { name: 'Desenvolvimento', sets: 3, reps: '8-12', weight: '20kg', restTime: 120 }
        ],
        intermediario: [
          { name: 'Agachamento', sets: 4, reps: '8-12', weight: '60kg', restTime: 120 },
          { name: 'Supino Reto', sets: 4, reps: '8-12', weight: '50kg', restTime: 120 },
          { name: 'Levantamento Terra', sets: 4, reps: '6-10', weight: '70kg', restTime: 180 },
          { name: 'Remada Curvada', sets: 4, reps: '8-12', weight: '40kg', restTime: 120 },
          { name: 'Desenvolvimento', sets: 4, reps: '8-12', weight: '35kg', restTime: 120 }
        ]
      },
      força: {
        iniciante: [
          { name: 'Agachamento', sets: 3, reps: '5-8', weight: '50kg', restTime: 180 },
          { name: 'Supino Reto', sets: 3, reps: '5-8', weight: '40kg', restTime: 180 },
          { name: 'Levantamento Terra', sets: 3, reps: '5-8', weight: '60kg', restTime: 240 }
        ]
      }
    };
    
    return templates[goal as keyof typeof templates]?.[level as keyof any] || templates.hipertrofia.iniciante;
  }

  private getWorkoutsPerWeek(userProfile: any): number {
    const levels = {
      'iniciante': 3,
      'intermediario': 4,
      'avancado': 5
    };
    return levels[userProfile.fitnessLevel as keyof typeof levels] || 3;
  }

  private calculateCalories(userProfile: any): number {
    const baseCalories = {
      'perda_peso': 1800,
      'hipertrofia': 2500,
      'definicao': 2000,
      'força': 2300
    };
    return baseCalories[userProfile.goal as keyof typeof baseCalories] || 2200;
  }

  private getOptimalTime(preferredTime: string): string {
    const times = {
      'manha': '07:00',
      'tarde': '15:00',
      'noite': '19:00'
    };
    return times[preferredTime as keyof typeof times] || '15:00';
  }

  private getDateForDay(dayIndex: number): string {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayIndex);
    return targetDate.toISOString().split('T')[0];
  }

  private getWorkoutExercises(goal: string): string[] {
    const exercises = {
      'hipertrofia': ['Agachamento', 'Supino', 'Remada', 'Desenvolvimento'],
      'força': ['Agachamento', 'Supino', 'Terra'],
      'resistencia': ['Burpees', 'Mountain Climbers', 'Jump Squats'],
      'perda_peso': ['HIIT', 'Circuito', 'Cardio']
    };
    return exercises[goal as keyof typeof exercises] || exercises.hipertrofia;
  }

  private calculatePerformanceScore(data: any): number {
    const factors = {
      completion: (data.completedExercises / data.totalExercises) * 40,
      consistency: (data.attendanceRate) * 30,
      progression: (data.weightProgression) * 20,
      form: (data.formScore) * 10
    };
    
    return Object.values(factors).reduce((sum, score) => sum + score, 0);
  }

  private increaseWeight(currentWeight: string): string {
    const weight = parseFloat(currentWeight.replace('kg', ''));
    const newWeight = weight + (weight * 0.05); // 5% de aumento
    return `${Math.round(newWeight)}kg`;
  }

  private decreaseWeight(currentWeight: string): string {
    const weight = parseFloat(currentWeight.replace('kg', ''));
    const newWeight = weight - (weight * 0.1); // 10% de redução
    return `${Math.round(newWeight)}kg`;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos públicos para uso na interface
  getUserProfile(): any {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      fitnessLevel: 'intermediario',
      goal: 'hipertrofia',
      availableDays: ['segunda', 'quarta', 'sexta'],
      preferredTime: 'tarde',
      sessionDuration: 60,
      experience: 12
    };
  }

  getUserData(): any {
    return {
      consistencyScore: 75,
      recoveryScore: 80,
      nutritionScore: 65,
      formScore: 82,
      completedExercises: 8,
      totalExercises: 10,
      attendanceRate: 0.85,
      weightProgression: 0.15
    };
  }

  generateCoachInsights(): any {
    const userProfile = this.getUserProfile();
    const userData = this.getUserData();
    
    return {
      adaptivePlans: [this.generateAdaptivePlan(userProfile)],
      recommendations: this.generateCoachRecommendations(userData),
      formAnalyses: [
        this.analyzeVideoForm('Agachamento'),
        this.analyzeVideoForm('Supino Reto')
      ],
      weeklySchedule: this.generateSmartSchedule(userProfile),
      nutritionPlan: this.generateNutritionPlan(userProfile),
      progressSummary: {
        overallProgress: 78,
        strengthGains: 85,
        enduranceGains: 72,
        consistencyScore: userData.consistencyScore,
        formImprovement: 88
      }
    };
  }
}

export const virtualCoachService = new VirtualCoachService(); 