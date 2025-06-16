// Serviço de Análise de Vídeo para Correção de Forma - SAGA Fitness
export interface VideoAnalysis {
  id: string;
  videoUrl: string;
  exerciseName: string;
  duration: number;
  timestamp: string;
  userId: string;
  analysisResults: AnalysisResult;
  status: 'processing' | 'completed' | 'failed';
  processingTime: number;
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  formQuality: FormQuality;
  bodyTracking: BodyTracking;
  movementAnalysis: MovementAnalysis;
  recommendations: FormRecommendation[];
  errors: FormError[];
  improvements: Improvement[];
  comparisonData?: ComparisonData;
}

export interface FormQuality {
  posture: { score: number; feedback: string; keyPoints: string[] };
  alignment: { score: number; feedback: string; keyPoints: string[] };
  rangeOfMotion: { score: number; feedback: string; keyPoints: string[] };
  tempo: { score: number; feedback: string; keyPoints: string[] };
  stability: { score: number; feedback: string; keyPoints: string[] };
  breathing: { score: number; feedback: string; keyPoints: string[] };
}

export interface BodyTracking {
  keypointDetection: KeypointData[];
  angleAnalysis: AngleData[];
  symmetry: SymmetryData;
  balance: BalanceData;
  consistency: ConsistencyData;
}

export interface KeypointData {
  joint: string;
  confidence: number;
  coordinates: { x: number; y: number; z?: number };
  movement: { velocity: number; acceleration: number };
  trajectory: TrajectoryPoint[];
}

export interface TrajectoryPoint {
  timestamp: number;
  x: number;
  y: number;
  z?: number;
}

export interface AngleData {
  jointName: string;
  angles: AnglePoint[];
  optimalRange: { min: number; max: number };
  currentRange: { min: number; max: number };
  adherence: number; // %
}

export interface AnglePoint {
  timestamp: number;
  angle: number;
  phase: 'concentric' | 'eccentric' | 'isometric';
}

export interface SymmetryData {
  leftRightBalance: number; // %
  anteriorPosterior: number; // %
  issues: string[];
  recommendations: string[];
}

export interface BalanceData {
  centerOfMass: CoMData[];
  stability: number; // 0-100
  sway: { lateral: number; sagittal: number };
}

export interface CoMData {
  timestamp: number;
  x: number;
  y: number;
  displacement: number;
}

export interface ConsistencyData {
  repetitionVariability: number; // %
  timingConsistency: number; // %
  amplitudeConsistency: number; // %
  formDegradation: FormDegradation[];
}

export interface FormDegradation {
  repetition: number;
  score: number;
  mainIssues: string[];
}

export interface MovementAnalysis {
  phases: MovementPhase[];
  timing: MovementTiming;
  force: ForceAnalysis;
  velocity: VelocityAnalysis;
  acceleration: AccelerationData;
}

export interface MovementPhase {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  optimalDuration: number;
  score: number;
  keyEvents: string[];
}

export interface MovementTiming {
  concentricPhase: number;
  eccentricPhase: number;
  pausePhase: number;
  ratio: { concentric: number; eccentric: number };
  recommendation: string;
}

export interface ForceAnalysis {
  peakForce: number;
  averageForce: number;
  forceProfile: ForcePoint[];
  forceBalance: { left: number; right: number };
}

export interface ForcePoint {
  timestamp: number;
  force: number;
  direction: { x: number; y: number; z: number };
}

export interface VelocityAnalysis {
  peakVelocity: number;
  averageVelocity: number;
  velocityProfile: VelocityPoint[];
  powerOutput: number;
}

export interface VelocityPoint {
  timestamp: number;
  velocity: number;
  acceleration: number;
}

export interface AccelerationData {
  patterns: AccelerationPattern[];
  smoothness: number;
  jerkiness: number;
}

export interface AccelerationPattern {
  phase: string;
  acceleration: number;
  quality: 'smooth' | 'jerky' | 'inconsistent';
}

export interface FormRecommendation {
  category: 'posture' | 'timing' | 'range' | 'stability' | 'breathing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  specificTips: string[];
  videoTimestamp?: number;
  correctiveExercises: string[];
  practiceRoutine: PracticeRoutine;
}

export interface PracticeRoutine {
  exercises: PracticeExercise[];
  frequency: string;
  duration: number;
  progressionSteps: string[];
}

export interface PracticeExercise {
  name: string;
  description: string;
  duration: number;
  sets?: number;
  reps?: number;
  focus: string[];
}

export interface FormError {
  type: 'critical' | 'major' | 'minor';
  timestamp: number;
  description: string;
  bodyPart: string;
  severity: number; // 1-10
  correction: string;
  preventionTips: string[];
}

export interface Improvement {
  area: string;
  currentScore: number;
  potentialScore: number;
  timeframe: string;
  actionPlan: string[];
  milestones: Milestone[];
}

export interface Milestone {
  description: string;
  targetDate: string;
  measurable: boolean;
  metric?: string;
}

export interface ComparisonData {
  previousAnalyses: string[];
  progressTrend: 'improving' | 'maintaining' | 'declining';
  improvementAreas: string[];
  regressionAreas: string[];
  overallImprovement: number; // %
}

export interface ExerciseProfile {
  name: string;
  category: string;
  difficulty: number;
  keyPoints: KeyPoint[];
  commonErrors: CommonError[];
  optimalForm: OptimalForm;
  variations: ExerciseVariation[];
}

export interface KeyPoint {
  bodyPart: string;
  description: string;
  importance: 'critical' | 'high' | 'medium';
  checkpoints: string[];
}

export interface CommonError {
  name: string;
  description: string;
  frequency: number; // %
  consequences: string[];
  corrections: string[];
  prevention: string[];
}

export interface OptimalForm {
  setup: string[];
  execution: string[];
  breathing: string[];
  completion: string[];
  safetyNotes: string[];
}

export interface ExerciseVariation {
  name: string;
  difficulty: 'easier' | 'harder';
  modifications: string[];
  purpose: string;
}

export interface AnalysisSession {
  sessionId: string;
  userId: string;
  date: string;
  exercises: VideoAnalysis[];
  summary: SessionSummary;
  coachNotes: string[];
  nextSteps: string[];
}

export interface SessionSummary {
  totalVideos: number;
  averageScore: number;
  strengths: string[];
  improvements: string[];
  focusAreas: string[];
  progressFromLastSession?: number;
}

class VideoAnalysisService {
  
  // Base de conhecimento dos exercícios
  private readonly EXERCISE_PROFILES: { [key: string]: ExerciseProfile } = {
    'agachamento': {
      name: 'Agachamento',
      category: 'Pernas',
      difficulty: 6,
      keyPoints: [
        {
          bodyPart: 'joelhos',
          description: 'Alinhamento com os pés',
          importance: 'critical',
          checkpoints: ['Joelhos não ultrapassam os pés', 'Direção dos joelhos acompanha os pés']
        },
        {
          bodyPart: 'quadril',
          description: 'Movimento iniciado pelo quadril',
          importance: 'critical',
          checkpoints: ['Quadril vai para trás primeiro', 'Mantém lordose lombar']
        },
        {
          bodyPart: 'tronco',
          description: 'Postura ereta',
          importance: 'high',
          checkpoints: ['Peito aberto', 'Olhar para frente', 'Core ativado']
        }
      ],
      commonErrors: [
        {
          name: 'Joelho valgo',
          description: 'Joelhos colapsam para dentro',
          frequency: 45,
          consequences: ['Lesão de LCA', 'Dor patelofemoral'],
          corrections: ['Fortalecer abdutores', 'Controle neuromuscular'],
          prevention: ['Aquecimento específico', 'Progressão gradual']
        },
        {
          name: 'Inclinação excessiva',
          description: 'Tronco muito inclinado à frente',
          frequency: 35,
          consequences: ['Sobrecarga lombar', 'Perda de eficiência'],
          corrections: ['Melhorar mobilidade de tornozelo', 'Fortalecer core'],
          prevention: ['Mobilidade pré-treino', 'Progressão de carga']
        }
      ],
      optimalForm: {
        setup: ['Pés na largura dos ombros', 'Pontas ligeiramente para fora', 'Core ativado'],
        execution: ['Inicia pelo quadril', 'Descida controlada', 'Joelhos alinhados'],
        breathing: ['Inspira na descida', 'Expira na subida'],
        completion: ['Extensão completa do quadril', 'Postura neutra'],
        safetyNotes: ['Não força além da amplitude', 'Para se sentir dor']
      },
      variations: [
        {
          name: 'Agachamento Box',
          difficulty: 'easier',
          modifications: ['Use caixa como referência', 'Controle da descida'],
          purpose: 'Aprender o padrão de movimento'
        },
        {
          name: 'Agachamento Búlgaro',
          difficulty: 'harder',
          modifications: ['Pé elevado atrás', 'Foco unilateral'],
          purpose: 'Desafio de estabilidade'
        }
      ]
    },
    'supino': {
      name: 'Supino Reto',
      category: 'Peito',
      difficulty: 7,
      keyPoints: [
        {
          bodyPart: 'escápulas',
          description: 'Retração e depressão',
          importance: 'critical',
          checkpoints: ['Omoplatas juntas', 'Ombros baixos', 'Peito aberto']
        },
        {
          bodyPart: 'braços',
          description: 'Trajetória da barra',
          importance: 'critical',
          checkpoints: ['Linha dos mamilos', 'Cotovelos 45°', 'Pulsos retos']
        },
        {
          bodyPart: 'core',
          description: 'Estabilidade do tronco',
          importance: 'high',
          checkpoints: ['Lombar neutra', 'Glúteos contraídos', 'Core ativo']
        }
      ],
      commonErrors: [
        {
          name: 'Ombros protraídos',
          description: 'Ombros não retraídos adequadamente',
          frequency: 40,
          consequences: ['Impacto do ombro', 'Perda de força'],
          corrections: ['Mobilização escapular', 'Fortalecimento do trapézio médio'],
          prevention: ['Setup adequado', 'Aquecimento escapular']
        }
      ],
      optimalForm: {
        setup: ['Retrair escápulas', 'Pés no chão', 'Pegada firme'],
        execution: ['Descida controlada', 'Pausa no peito', 'Explosão na subida'],
        breathing: ['Inspira na descida', 'Expira no esforço'],
        completion: ['Extensão completa', 'Controle no final'],
        safetyNotes: ['Use safety bars', 'Spotters quando necessário']
      },
      variations: [
        {
          name: 'Supino com halteres',
          difficulty: 'easier',
          modifications: ['Maior amplitude', 'Trabalho unilateral'],
          purpose: 'Menor impacto articular'
        }
      ]
    }
  };

  // Analisar vídeo (simulado com IA)
  async analyzeVideo(videoFile: File, exerciseName: string, userId: string): Promise<VideoAnalysis> {
    const videoUrl = URL.createObjectURL(videoFile);
    const analysisId = this.generateId();
    
    // Simular processamento
    const processingStart = Date.now();
    
    // Simulação de análise com IA
    await this.simulateProcessing(2000); // 2 segundos
    
    const analysisResults = this.generateAnalysisResults(exerciseName);
    const processingTime = Date.now() - processingStart;
    
    const analysis: VideoAnalysis = {
      id: analysisId,
      videoUrl,
      exerciseName,
      duration: this.estimateVideoDuration(videoFile),
      timestamp: new Date().toISOString(),
      userId,
      analysisResults,
      status: 'completed',
      processingTime
    };

    // Salvar análise
    this.saveAnalysis(analysis);
    
    return analysis;
  }

  // Gerar resultados da análise (simulado)
  private generateAnalysisResults(exerciseName: string): AnalysisResult {
    const exerciseKey = exerciseName.toLowerCase();
    const profile = this.EXERCISE_PROFILES[exerciseKey];
    
    if (!profile) {
      throw new Error(`Exercício não suportado: ${exerciseName}`);
    }

    // Scores simulados mas realistas
    const formQuality = this.generateFormQuality(profile);
    const bodyTracking = this.generateBodyTracking();
    const movementAnalysis = this.generateMovementAnalysis();
    const recommendations = this.generateRecommendations(formQuality, profile);
    const errors = this.generateFormErrors(profile);
    const improvements = this.generateImprovements(formQuality);
    
    const overallScore = this.calculateOverallScore(formQuality);

    return {
      overallScore,
      formQuality,
      bodyTracking,
      movementAnalysis,
      recommendations,
      errors,
      improvements,
      comparisonData: this.getComparisonData()
    };
  }

  // Gerar qualidade da forma
  private generateFormQuality(profile: ExerciseProfile): FormQuality {
    return {
      posture: {
        score: this.randomScore(75, 95),
        feedback: 'Postura geral adequada com pequenos ajustes necessários',
        keyPoints: ['Mantenha o peito aberto', 'Ombros para trás']
      },
      alignment: {
        score: this.randomScore(70, 90),
        feedback: 'Alinhamento corporal bom, observe os joelhos',
        keyPoints: ['Joelhos alinhados com os pés', 'Quadril neutro']
      },
      rangeOfMotion: {
        score: this.randomScore(80, 95),
        feedback: 'Amplitude de movimento adequada',
        keyPoints: ['Descida completa', 'Extensão total']
      },
      tempo: {
        score: this.randomScore(65, 85),
        feedback: 'Velocidade pode ser mais controlada na fase excêntrica',
        keyPoints: ['2 segundos na descida', '1 segundo na subida']
      },
      stability: {
        score: this.randomScore(75, 90),
        feedback: 'Boa estabilidade com ligeiros balanços',
        keyPoints: ['Core mais ativo', 'Base de apoio firme']
      },
      breathing: {
        score: this.randomScore(60, 80),
        feedback: 'Padrão respiratório pode melhorar',
        keyPoints: ['Respiração coordenada', 'Não prender o ar']
      }
    };
  }

  // Gerar dados de rastreamento corporal
  private generateBodyTracking(): BodyTracking {
    const keypoints = this.generateKeypointData();
    const angles = this.generateAngleData();
    
    return {
      keypointDetection: keypoints,
      angleAnalysis: angles,
      symmetry: {
        leftRightBalance: this.randomScore(85, 98),
        anteriorPosterior: this.randomScore(80, 95),
        issues: ['Ligeiro desequilíbrio lateral'],
        recommendations: ['Exercícios unilaterais', 'Fortalecimento específico']
      },
      balance: {
        centerOfMass: this.generateCoMData(),
        stability: this.randomScore(75, 90),
        sway: { lateral: 2.5, sagittal: 1.8 }
      },
      consistency: {
        repetitionVariability: 15, // %
        timingConsistency: 85, // %
        amplitudeConsistency: 90, // %
        formDegradation: this.generateFormDegradation()
      }
    };
  }

  // Gerar análise de movimento
  private generateMovementAnalysis(): MovementAnalysis {
    return {
      phases: [
        {
          name: 'Fase Excêntrica',
          startTime: 0,
          endTime: 2000,
          duration: 2000,
          optimalDuration: 2000,
          score: 85,
          keyEvents: ['Início da descida', 'Profundidade máxima']
        },
        {
          name: 'Fase Concêntrica',
          startTime: 2000,
          endTime: 3500,
          duration: 1500,
          optimalDuration: 1500,
          score: 90,
          keyEvents: ['Início da subida', 'Extensão completa']
        }
      ],
      timing: {
        concentricPhase: 1.5,
        eccentricPhase: 2.0,
        pausePhase: 0.2,
        ratio: { concentric: 1.5, eccentric: 2.0 },
        recommendation: 'Tempo ideal para hipertrofia'
      },
      force: {
        peakForce: 850,
        averageForce: 650,
        forceProfile: this.generateForceProfile(),
        forceBalance: { left: 52, right: 48 }
      },
      velocity: {
        peakVelocity: 0.8,
        averageVelocity: 0.5,
        velocityProfile: this.generateVelocityProfile(),
        powerOutput: 425
      },
      acceleration: {
        patterns: [
          {
            phase: 'concêntrica',
            acceleration: 0.6,
            quality: 'smooth'
          }
        ],
        smoothness: 85,
        jerkiness: 15
      }
    };
  }

  // Gerar recomendações
  private generateRecommendations(formQuality: FormQuality, profile: ExerciseProfile): FormRecommendation[] {
    const recommendations: FormRecommendation[] = [];

    // Baseado nos scores mais baixos
    if (formQuality.breathing.score < 75) {
      recommendations.push({
        category: 'breathing',
        priority: 'high',
        title: 'Melhore o Padrão Respiratório',
        description: 'Sua respiração não está coordenada com o movimento',
        specificTips: [
          'Inspire na fase excêntrica (descida)',
          'Expire na fase concêntrica (esforço)',
          'Não prenda a respiração'
        ],
        videoTimestamp: 15,
        correctiveExercises: ['Respiração diafragmática', 'Movimentos com foco respiratório'],
        practiceRoutine: {
          exercises: [
            {
              name: 'Respiração Diafragmática',
              description: 'Deitado, respiração profunda',
              duration: 300,
              sets: 3,
              reps: 10,
              focus: ['Controle respiratório']
            }
          ],
          frequency: 'Diário',
          duration: 10,
          progressionSteps: ['Dominar padrão', 'Aplicar no exercício', 'Automatizar']
        }
      });
    }

    if (formQuality.tempo.score < 75) {
      recommendations.push({
        category: 'timing',
        priority: 'medium',
        title: 'Controle o Tempo de Execução',
        description: 'Movimento muito rápido, especialmente na descida',
        specificTips: [
          'Conte 2 segundos na descida',
          'Pausa de 1 segundo embaixo',
          'Explosão controlada na subida'
        ],
        correctiveExercises: ['Exercício com tempo', 'Uso de metrônomo'],
        practiceRoutine: {
          exercises: [
            {
              name: 'Exercício com Pausa',
              description: 'Mesma execução com pausa de 2s',
              duration: 180,
              sets: 3,
              reps: 8,
              focus: ['Controle temporal', 'Consciência corporal']
            }
          ],
          frequency: '3x por semana',
          duration: 15,
          progressionSteps: ['Com carga reduzida', 'Carga normal', 'Carga aumentada']
        }
      });
    }

    return recommendations;
  }

  // Gerar erros de forma
  private generateFormErrors(profile: ExerciseProfile): FormError[] {
    const errors: FormError[] = [];
    
    // Simular erros baseados no perfil do exercício
    profile.commonErrors.forEach((commonError, index) => {
      if (Math.random() < 0.3) { // 30% chance de cada erro comum aparecer
        errors.push({
          type: 'major',
          timestamp: (index + 1) * 1000,
          description: commonError.description,
          bodyPart: this.getBodyPartFromError(commonError.name),
          severity: Math.floor(Math.random() * 4) + 5, // 5-8
          correction: commonError.corrections[0],
          preventionTips: commonError.prevention
        });
      }
    });

    return errors;
  }

  // Gerar melhorias sugeridas
  private generateImprovements(formQuality: FormQuality): Improvement[] {
    const improvements: Improvement[] = [];

    Object.entries(formQuality).forEach(([area, data]) => {
      if (data.score < 85) {
        improvements.push({
          area: area.charAt(0).toUpperCase() + area.slice(1),
          currentScore: data.score,
          potentialScore: Math.min(data.score + 15, 95),
          timeframe: '2-4 semanas',
          actionPlan: [
            'Prática focada 3x por semana',
            'Correções específicas',
            'Feedback visual constante'
          ],
          milestones: [
            {
              description: `Melhora de 5 pontos em ${area}`,
              targetDate: this.addDays(new Date(), 14),
              measurable: true,
              metric: 'Score de análise'
            }
          ]
        });
      }
    });

    return improvements;
  }

  // Obter comparação com análises anteriores
  private getComparisonData(): ComparisonData | undefined {
    // Simular dados de comparação
    const hasHistory = Math.random() > 0.5;
    
    if (!hasHistory) return undefined;

    return {
      previousAnalyses: ['analysis_1', 'analysis_2'],
      progressTrend: 'improving',
      improvementAreas: ['Postura', 'Tempo'],
      regressionAreas: [],
      overallImprovement: 12 // %
    };
  }

  // Gerar dados simulados específicos
  private generateKeypointData(): KeypointData[] {
    const joints = ['shoulder', 'elbow', 'wrist', 'hip', 'knee', 'ankle'];
    
    return joints.map(joint => ({
      joint,
      confidence: this.randomScore(85, 98) / 100,
      coordinates: { x: Math.random() * 1920, y: Math.random() * 1080 },
      movement: {
        velocity: Math.random() * 2,
        acceleration: Math.random() * 1
      },
      trajectory: this.generateTrajectory()
    }));
  }

  private generateTrajectory(): TrajectoryPoint[] {
    const points: TrajectoryPoint[] = [];
    for (let i = 0; i < 60; i++) { // 2 segundos a 30fps
      points.push({
        timestamp: i * 33,
        x: 500 + Math.sin(i * 0.1) * 100,
        y: 400 + Math.cos(i * 0.1) * 50
      });
    }
    return points;
  }

  private generateAngleData(): AngleData[] {
    return [
      {
        jointName: 'knee',
        angles: this.generateAnglePoints(),
        optimalRange: { min: 90, max: 170 },
        currentRange: { min: 95, max: 165 },
        adherence: 88
      },
      {
        jointName: 'hip',
        angles: this.generateAnglePoints(),
        optimalRange: { min: 45, max: 90 },
        currentRange: { min: 50, max: 85 },
        adherence: 92
      }
    ];
  }

  private generateAnglePoints(): AnglePoint[] {
    const points: AnglePoint[] = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        timestamp: i * 35,
        angle: 90 + Math.sin(i * 0.1) * 45,
        phase: i < 50 ? 'eccentric' : 'concentric'
      });
    }
    return points;
  }

  private generateCoMData(): CoMData[] {
    const points: CoMData[] = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        timestamp: i * 35,
        x: 500 + Math.random() * 10 - 5,
        y: 400 + Math.random() * 10 - 5,
        displacement: Math.random() * 5
      });
    }
    return points;
  }

  private generateFormDegradation(): FormDegradation[] {
    return [
      { repetition: 1, score: 90, mainIssues: [] },
      { repetition: 2, score: 88, mainIssues: ['Ligeira inclinação'] },
      { repetition: 3, score: 85, mainIssues: ['Tempo acelerado'] },
      { repetition: 4, score: 82, mainIssues: ['Amplitude reduzida'] },
      { repetition: 5, score: 80, mainIssues: ['Fadiga aparente'] }
    ];
  }

  private generateForceProfile(): ForcePoint[] {
    const points: ForcePoint[] = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        timestamp: i * 35,
        force: 500 + Math.sin(i * 0.1) * 200,
        direction: { x: 0, y: -1, z: 0 }
      });
    }
    return points;
  }

  private generateVelocityProfile(): VelocityPoint[] {
    const points: VelocityPoint[] = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        timestamp: i * 35,
        velocity: Math.abs(Math.cos(i * 0.1)) * 0.8,
        acceleration: Math.sin(i * 0.1) * 0.5
      });
    }
    return points;
  }

  // Utilitários
  private calculateOverallScore(formQuality: FormQuality): number {
    const scores = Object.values(formQuality).map(item => item.score);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  private randomScore(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private estimateVideoDuration(file: File): number {
    // Estimativa baseada no tamanho do arquivo (simplificado)
    return Math.round((file.size / 1000000) * 5); // ~5 segundos por MB
  }

  private simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getBodyPartFromError(errorName: string): string {
    const mapping: { [key: string]: string } = {
      'Joelho valgo': 'joelhos',
      'Inclinação excessiva': 'tronco',
      'Ombros protraídos': 'ombros'
    };
    return mapping[errorName] || 'geral';
  }

  private addDays(date: Date, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveAnalysis(analysis: VideoAnalysis): void {
    const saved = JSON.parse(localStorage.getItem('videoAnalyses') || '[]');
    saved.push(analysis);
    localStorage.setItem('videoAnalyses', JSON.stringify(saved));
  }

  // Métodos públicos
  getExerciseProfiles(): { [key: string]: ExerciseProfile } {
    return this.EXERCISE_PROFILES;
  }

  getSupportedExercises(): string[] {
    return Object.keys(this.EXERCISE_PROFILES);
  }

  getUserAnalyses(userId: string): VideoAnalysis[] {
    const saved = JSON.parse(localStorage.getItem('videoAnalyses') || '[]');
    return saved.filter((analysis: VideoAnalysis) => analysis.userId === userId);
  }

  getAnalysisById(id: string): VideoAnalysis | null {
    const saved = JSON.parse(localStorage.getItem('videoAnalyses') || '[]');
    return saved.find((analysis: VideoAnalysis) => analysis.id === id) || null;
  }

  deleteAnalysis(id: string): void {
    const saved = JSON.parse(localStorage.getItem('videoAnalyses') || '[]');
    const filtered = saved.filter((analysis: VideoAnalysis) => analysis.id !== id);
    localStorage.setItem('videoAnalyses', JSON.stringify(filtered));
  }

  // Gerar sessão de análise
  createAnalysisSession(userId: string, analyses: VideoAnalysis[]): AnalysisSession {
    const sessionId = this.generateId();
    const averageScore = analyses.reduce((sum, a) => sum + a.analysisResults.overallScore, 0) / analyses.length;
    
    const allStrengths = analyses.flatMap(a => 
      Object.entries(a.analysisResults.formQuality)
        .filter(([_, data]) => data.score >= 85)
        .map(([key, _]) => key)
    );
    
    const allImprovements = analyses.flatMap(a => 
      Object.entries(a.analysisResults.formQuality)
        .filter(([_, data]) => data.score < 75)
        .map(([key, _]) => key)
    );

    return {
      sessionId,
      userId,
      date: new Date().toISOString().split('T')[0],
      exercises: analyses,
      summary: {
        totalVideos: analyses.length,
        averageScore: Math.round(averageScore),
        strengths: [...new Set(allStrengths)],
        improvements: [...new Set(allImprovements)],
        focusAreas: this.identifyFocusAreas(analyses),
        progressFromLastSession: Math.floor(Math.random() * 20) - 5 // -5 a +15
      },
      coachNotes: this.generateCoachNotes(analyses),
      nextSteps: this.generateNextSteps(analyses)
    };
  }

  private identifyFocusAreas(analyses: VideoAnalysis[]): string[] {
    const errorCounts: { [key: string]: number } = {};
    
    analyses.forEach(analysis => {
      analysis.analysisResults.errors.forEach(error => {
        errorCounts[error.bodyPart] = (errorCounts[error.bodyPart] || 0) + 1;
      });
    });

    return Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  }

  private generateCoachNotes(analyses: VideoAnalysis[]): string[] {
    const notes = [
      'Padrão de movimento está melhorando consistentemente',
      'Foque mais na fase excêntrica dos movimentos',
      'Considere reduzir a carga para aperfeiçoar a técnica'
    ];
    
    return notes.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateNextSteps(analyses: VideoAnalysis[]): string[] {
    return [
      'Praticar exercícios corretivos 3x por semana',
      'Gravar novos vídeos em 1 semana',
      'Focar nos pontos de melhoria identificados',
      'Implementar as recomendações de respiração'
    ];
  }
}

export const videoAnalysisService = new VideoAnalysisService(); 