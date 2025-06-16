import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExerciseForm {
  exercise: string;
  score: number; // 0-100
  feedback: string[];
  errors: FormError[];
  keyPoints: BodyKeyPoint[];
  timestamp: string;
}

interface FormError {
  type: 'posture' | 'range_of_motion' | 'speed' | 'alignment';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

interface BodyKeyPoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

interface WorkoutAnalysis {
  id: string;
  exercise: string;
  duration: number;
  reps: number;
  sets: number;
  formScores: number[];
  averageForm: number;
  improvements: string[];
  videoPath?: string;
  timestamp: string;
}

interface ExerciseTemplate {
  name: string;
  keyAngles: { joint: string; minAngle: number; maxAngle: number }[];
  criticalPoints: string[];
  commonErrors: string[];
}

class VideoAnalysisService {
  private camera: Camera | null = null;
  private isAnalyzing: boolean = false;
  private currentExercise: string | null = null;
  private analysisData: ExerciseForm[] = [];

  // TEMPLATES DE EXERCÍCIOS
  private exerciseTemplates: ExerciseTemplate[] = [
    {
      name: 'squat',
      keyAngles: [
        { joint: 'knee', minAngle: 90, maxAngle: 180 },
        { joint: 'hip', minAngle: 90, maxAngle: 160 },
        { joint: 'ankle', minAngle: 70, maxAngle: 110 },
      ],
      criticalPoints: ['knee', 'hip', 'shoulder', 'ankle'],
      commonErrors: [
        'Joelhos ultrapassam os pés',
        'Coluna não mantém curvatura natural',
        'Profundidade insuficiente',
        'Peso nos calcanhares',
      ],
    },
    {
      name: 'pushup',
      keyAngles: [
        { joint: 'elbow', minAngle: 90, maxAngle: 180 },
        { joint: 'shoulder', minAngle: 0, maxAngle: 45 },
      ],
      criticalPoints: ['elbow', 'shoulder', 'hip', 'knee'],
      commonErrors: [
        'Cotovelos muito abertos',
        'Quadril muito alto ou baixo',
        'Amplitude incompleta',
        'Cabeça para frente',
      ],
    },
    {
      name: 'deadlift',
      keyAngles: [
        { joint: 'knee', minAngle: 120, maxAngle: 180 },
        { joint: 'hip', minAngle: 90, maxAngle: 180 },
        { joint: 'back', minAngle: 160, maxAngle: 180 },
      ],
      criticalPoints: ['knee', 'hip', 'shoulder', 'back'],
      commonErrors: [
        'Coluna arredondada',
        'Barra longe do corpo',
        'Joelhos para dentro',
        'Cabeça muito para cima',
      ],
    },
  ];

  async initialize(): Promise<void> {
    try {
      // Solicitar permissões de câmera e áudio
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();

      if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
        throw new Error('Permissões de câmera/áudio são necessárias para análise de vídeo');
      }

      console.log('✅ Serviço de análise de vídeo inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar análise de vídeo:', error);
      throw error;
    }
  }

  // ANÁLISE EM TEMPO REAL
  async startRealtimeAnalysis(exercise: string): Promise<void> {
    try {
      if (this.isAnalyzing) {
        throw new Error('Análise já está em andamento');
      }

      this.currentExercise = exercise;
      this.isAnalyzing = true;
      this.analysisData = [];

      console.log(`🎥 Iniciando análise em tempo real para: ${exercise}`);

      // Aqui seria integrada uma biblioteca de pose estimation como TensorFlow Lite
      // Para este exemplo, vamos simular a análise
      this.simulateRealtimeAnalysis();

    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      throw error;
    }
  }

  private simulateRealtimeAnalysis(): void {
    // Simular análise contínua
    const analysisInterval = setInterval(() => {
      if (!this.isAnalyzing) {
        clearInterval(analysisInterval);
        return;
      }

      // Gerar dados simulados de análise
      const mockAnalysis = this.generateMockAnalysis();
      this.analysisData.push(mockAnalysis);

      // Emitir feedback em tempo real (seria conectado a um listener na UI)
      this.emitRealtimeFeedback(mockAnalysis);

    }, 500); // Análise a cada 500ms
  }

  private generateMockAnalysis(): ExerciseForm {
    const template = this.exerciseTemplates.find(t => t.name === this.currentExercise);
    const score = 70 + Math.random() * 30; // Score entre 70-100
    
    const feedback: string[] = [];
    const errors: FormError[] = [];

    // Gerar feedback baseado no score
    if (score > 90) {
      feedback.push('Excelente forma!');
      feedback.push('Movimento muito controlado');
    } else if (score > 80) {
      feedback.push('Boa execução');
      feedback.push('Continue assim');
    } else {
      feedback.push('Pode melhorar');
      
      // Adicionar erros comuns
      if (template && Math.random() > 0.7) {
        const randomError = template.commonErrors[Math.floor(Math.random() * template.commonErrors.length)];
        errors.push({
          type: 'posture',
          severity: score < 75 ? 'high' : 'medium',
          description: randomError,
          suggestion: 'Mantenha a postura correta durante todo o movimento',
        });
      }
    }

    // Gerar pontos-chave do corpo (simulado)
    const keyPoints: BodyKeyPoint[] = [
      { name: 'shoulder_left', x: 0.3, y: 0.2, confidence: 0.9 },
      { name: 'shoulder_right', x: 0.7, y: 0.2, confidence: 0.9 },
      { name: 'elbow_left', x: 0.25, y: 0.4, confidence: 0.85 },
      { name: 'elbow_right', x: 0.75, y: 0.4, confidence: 0.85 },
      { name: 'hip_left', x: 0.35, y: 0.6, confidence: 0.9 },
      { name: 'hip_right', x: 0.65, y: 0.6, confidence: 0.9 },
      { name: 'knee_left', x: 0.35, y: 0.8, confidence: 0.8 },
      { name: 'knee_right', x: 0.65, y: 0.8, confidence: 0.8 },
    ];

    return {
      exercise: this.currentExercise || 'unknown',
      score: Math.round(score),
      feedback,
      errors,
      keyPoints,
      timestamp: new Date().toISOString(),
    };
  }

  private emitRealtimeFeedback(analysis: ExerciseForm): void {
    // Em uma implementação real, isso seria conectado a um EventEmitter ou callback
    console.log(`📊 Score: ${analysis.score}% | ${analysis.feedback.join(', ')}`);
    
    if (analysis.errors.length > 0) {
      console.log(`⚠️ Erro detectado: ${analysis.errors[0].description}`);
    }
  }

  async stopRealtimeAnalysis(): Promise<WorkoutAnalysis> {
    try {
      if (!this.isAnalyzing) {
        throw new Error('Nenhuma análise em andamento');
      }

      this.isAnalyzing = false;
      
      // Processar dados coletados
      const analysis = this.processAnalysisData();
      
      // Salvar análise
      await this.saveWorkoutAnalysis(analysis);
      
      console.log('🏁 Análise finalizada:', analysis);
      return analysis;

    } catch (error) {
      console.error('Erro ao parar análise:', error);
      throw error;
    }
  }

  private processAnalysisData(): WorkoutAnalysis {
    if (this.analysisData.length === 0) {
      throw new Error('Nenhum dado de análise disponível');
    }

    const formScores = this.analysisData.map(d => d.score);
    const averageForm = Math.round(formScores.reduce((a, b) => a + b, 0) / formScores.length);
    
    // Detectar repetições baseado em padrões nos scores
    const reps = this.detectRepetitions(formScores);
    
    // Gerar melhorias baseadas nos erros mais comuns
    const improvements = this.generateImprovements();

    return {
      id: `analysis_${Date.now()}`,
      exercise: this.currentExercise || 'unknown',
      duration: this.analysisData.length * 0.5, // 500ms por análise
      reps,
      sets: 1, // Por enquanto, apenas 1 set por análise
      formScores,
      averageForm,
      improvements,
      timestamp: new Date().toISOString(),
    };
  }

  private detectRepetitions(scores: number[]): number {
    // Algoritmo simples para detectar repetições baseado em picos nos scores
    let reps = 0;
    let inRep = false;
    const threshold = 80; // Score mínimo para considerar uma rep válida

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > threshold && !inRep) {
        reps++;
        inRep = true;
      } else if (scores[i] < threshold - 10) {
        inRep = false;
      }
    }

    return Math.max(1, reps); // Pelo menos 1 rep
  }

  private generateImprovements(): string[] {
    const allErrors = this.analysisData.flatMap(d => d.errors);
    const errorCounts: { [key: string]: number } = {};

    // Contar erros mais comuns
    allErrors.forEach(error => {
      errorCounts[error.description] = (errorCounts[error.description] || 0) + 1;
    });

    // Gerar sugestões baseadas nos erros mais frequentes
    const improvements: string[] = [];
    Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([error, count]) => {
        const suggestion = this.getImprovementSuggestion(error);
        if (suggestion) {
          improvements.push(suggestion);
        }
      });

    // Adicionar sugestões gerais se não há melhorias específicas
    if (improvements.length === 0) {
      improvements.push('Continue praticando para manter a consistência');
      improvements.push('Mantenha o foco na qualidade do movimento');
    }

    return improvements;
  }

  private getImprovementSuggestion(error: string): string {
    const suggestions: { [key: string]: string } = {
      'Joelhos ultrapassam os pés': 'Concentre-se em empurrar o quadril para trás ao descer no agachamento',
      'Coluna não mantém curvatura natural': 'Mantenha o peito aberto e os ombros para trás durante todo o movimento',
      'Cotovelos muito abertos': 'Mantenha os cotovelos mais próximos ao corpo durante a flexão',
      'Quadril muito alto ou baixo': 'Mantenha uma linha reta do calcanhar à cabeça',
      'Coluna arredondada': 'Ative o core e mantenha o peito aberto durante o levantamento',
    };

    return suggestions[error] || 'Pratique o movimento com menos peso para melhorar a técnica';
  }

  // ANÁLISE DE VÍDEO GRAVADO
  async analyzeRecordedVideo(videoPath: string, exercise: string): Promise<WorkoutAnalysis> {
    try {
      console.log(`🎬 Analisando vídeo gravado: ${exercise}`);

      // Aqui seria processado o vídeo frame por frame
      // Para este exemplo, vamos simular a análise
      const analysis = await this.simulateVideoAnalysis(videoPath, exercise);
      
      await this.saveWorkoutAnalysis(analysis);
      
      return analysis;
    } catch (error) {
      console.error('Erro na análise de vídeo:', error);
      throw error;
    }
  }

  private async simulateVideoAnalysis(videoPath: string, exercise: string): Promise<WorkoutAnalysis> {
    // Simular processamento de vídeo
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2s de processamento

    const reps = 8 + Math.floor(Math.random() * 5); // 8-12 reps
    const formScores = Array.from({ length: reps }, () => 75 + Math.random() * 25);
    const averageForm = Math.round(formScores.reduce((a, b) => a + b, 0) / formScores.length);

    return {
      id: `video_analysis_${Date.now()}`,
      exercise,
      duration: 60 + Math.random() * 120, // 1-3 minutos
      reps,
      sets: 1,
      formScores,
      averageForm,
      improvements: [
        'Mantenha velocidade constante durante as repetições',
        'Foque na amplitude completa do movimento',
      ],
      videoPath,
      timestamp: new Date().toISOString(),
    };
  }

  // COMPARAÇÃO E PROGRESSO
  async compareWithPreviousSession(exercise: string): Promise<{
    currentSession: WorkoutAnalysis;
    previousSession: WorkoutAnalysis | null;
    improvement: number;
    insights: string[];
  } | null> {
    try {
      const sessions = await this.getWorkoutHistory(exercise);
      if (sessions.length < 2) {
        return null;
      }

      const currentSession = sessions[0]; // Mais recente
      const previousSession = sessions[1]; // Anterior

      const improvement = currentSession.averageForm - previousSession.averageForm;
      
      const insights: string[] = [];
      
      if (improvement > 5) {
        insights.push('🎉 Excelente melhoria na forma!');
      } else if (improvement > 0) {
        insights.push('📈 Pequena melhoria detectada');
      } else if (improvement < -5) {
        insights.push('⚠️ Forma piorou - considere reduzir a carga');
      } else {
        insights.push('📊 Forma mantida consistente');
      }

      if (currentSession.reps > previousSession.reps) {
        insights.push('💪 Mais repetições que a sessão anterior');
      }

      return {
        currentSession,
        previousSession,
        improvement,
        insights,
      };
    } catch (error) {
      console.error('Erro na comparação:', error);
      return null;
    }
  }

  // ARMAZENAMENTO E HISTÓRICO
  private async saveWorkoutAnalysis(analysis: WorkoutAnalysis): Promise<void> {
    try {
      const key = `workout_analysis_${analysis.exercise}`;
      const existing = await AsyncStorage.getItem(key);
      const history = existing ? JSON.parse(existing) : [];
      
      history.unshift(analysis); // Adicionar no início
      
      // Manter apenas os últimos 50 registros
      const trimmedHistory = history.slice(0, 50);
      
      await AsyncStorage.setItem(key, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Erro ao salvar análise:', error);
    }
  }

  async getWorkoutHistory(exercise: string): Promise<WorkoutAnalysis[]> {
    try {
      const key = `workout_analysis_${exercise}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  }

  async getAllExerciseAnalyses(): Promise<{ [exercise: string]: WorkoutAnalysis[] }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analysisKeys = keys.filter(key => key.startsWith('workout_analysis_'));
      
      const analyses: { [exercise: string]: WorkoutAnalysis[] } = {};
      
      for (const key of analysisKeys) {
        const exercise = key.replace('workout_analysis_', '');
        const data = await AsyncStorage.getItem(key);
        analyses[exercise] = data ? JSON.parse(data) : [];
      }
      
      return analyses;
    } catch (error) {
      console.error('Erro ao carregar todas as análises:', error);
      return {};
    }
  }

  // CONFIGURAÇÕES
  async updateExerciseTemplate(exercise: string, template: Partial<ExerciseTemplate>): Promise<void> {
    const existingIndex = this.exerciseTemplates.findIndex(t => t.name === exercise);
    
    if (existingIndex >= 0) {
      this.exerciseTemplates[existingIndex] = {
        ...this.exerciseTemplates[existingIndex],
        ...template,
      };
    } else {
      this.exerciseTemplates.push({
        name: exercise,
        keyAngles: [],
        criticalPoints: [],
        commonErrors: [],
        ...template,
      });
    }
    
    // Salvar templates personalizados
    await AsyncStorage.setItem('custom_exercise_templates', JSON.stringify(this.exerciseTemplates));
  }

  getSupportedExercises(): string[] {
    return this.exerciseTemplates.map(t => t.name);
  }

  // CALIBRAÇÃO
  async calibrateCamera(): Promise<boolean> {
    try {
      console.log('📐 Calibrando câmera...');
      
      // Aqui seria implementada a calibração real da câmera
      // Por enquanto, apenas simular
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Câmera calibrada');
      return true;
    } catch (error) {
      console.error('Erro na calibração:', error);
      return false;
    }
  }
}

export const videoAnalysisService = new VideoAnalysisService(); 