import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CameraIcon,
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface AIAnalysis {
  formScore: number;
  improvements: string[];
  strengths: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  exerciseCorrections: {
    bodyPart: string;
    issue: string;
    correction: string;
    severity: 'info' | 'warning' | 'error';
  }[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: number;
    tips: string[];
  }[];
  aiNotes: string[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: 'exercise' | 'nutrition' | 'recovery' | 'motivation';
}

const AICoachPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [analysisData, setAnalysisData] = useState<AIAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('supino-reto');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simular análise de IA
  const generateAIAnalysis = (): AIAnalysis => {
    const formScores = [85, 92, 78, 88, 95, 73, 89];
    const formScore = formScores[Math.floor(Math.random() * formScores.length)];
    
    const improvements = [
      'Manter os cotovelos mais próximos ao corpo durante a descida',
      'Aumentar a amplitude de movimento na fase excêntrica',
      'Estabilizar melhor o core durante toda a execução',
      'Controlar mais a velocidade na fase negativa',
      'Manter a postura ereta durante todo o movimento'
    ];
    
    const strengths = [
      'Excelente controle da respiração',
      'Boa estabilização da escápula',
      'Amplitude de movimento adequada',
      'Ritmo consistente entre as repetições',
      'Posicionamento correto dos pés'
    ];

    const recommendations = [
      'Aumentar em 2.5kg na próxima sessão',
      'Incluir exercícios de mobilidade no aquecimento',
      'Focar em exercícios unilaterais para correção de assimetrias',
      'Adicionar pause reps para melhorar controle',
      'Implementar treino de força explosiva'
    ];

    return {
      formScore,
      improvements: improvements.slice(0, Math.floor(Math.random() * 3) + 2),
      strengths: strengths.slice(0, Math.floor(Math.random() * 3) + 2),
      recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 2),
      riskLevel: formScore > 85 ? 'low' : formScore > 70 ? 'medium' : 'high',
      exerciseCorrections: [
        {
          bodyPart: 'Braços',
          issue: 'Cotovelos muito abertos',
          correction: 'Manter cotovelos em 45°',
          severity: 'warning'
        },
        {
          bodyPart: 'Core',
          issue: 'Falta de estabilização',
          correction: 'Contrair abdômen durante todo movimento',
          severity: 'info'
        }
      ]
    };
  };

  // Inicializar chat com mensagem de boas-vindas
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: '👋 Olá! Sou seu AI Coach. Estou aqui para ajudar com análise de movimentos, criação de treinos personalizados e responder suas dúvidas sobre fitness. Como posso ajudar você hoje?',
      timestamp: new Date(),
      context: 'motivation'
    };
    setChatMessages([welcomeMessage]);
  }, []);

  // Iniciar gravação de vídeo
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsRecording(true);
      
      // Simular análise após 3 segundos
      setTimeout(() => {
        setIsAnalyzing(true);
        setTimeout(() => {
          setAnalysisData(generateAIAnalysis());
          setIsAnalyzing(false);
          stopVideoRecording();
        }, 2000);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
  };

  const stopVideoRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
  };

  // Enviar mensagem no chat
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponses = [
        '💪 Baseado na sua descrição, recomendo focar em exercícios compostos como agachamento e levantamento terra. Eles trabalham múltiplos grupos musculares e são excelentes para ganho de força.',
        '🎯 Para melhorar sua técnica no supino, sugiro diminuir a carga em 10% e focar na execução perfeita. A progressão virá naturalmente com a técnica correta.',
        '📊 Seus resultados mostram boa evolução! Para continuar progredindo, que tal adicionar exercícios unilaterais e variar os ângulos de trabalho?',
        '🔥 Excelente pergunta! A recuperação é fundamental. Recomendo 48-72h de descanso entre treinos do mesmo grupo muscular e pelo menos 7-8h de sono por noite.',
        '💡 Para sua dor nas costas, sugiro exercícios de mobilidade da coluna e fortalecimento do core. Procure também manter boa postura durante os exercícios.'
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
        context: 'exercise'
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  // Gerar plano de treino personalizado
  const generateWorkoutPlan = () => {
    const plans: WorkoutPlan[] = [
      {
        id: '1',
        name: 'Treino de Peito - Intermediário',
        duration: 45,
        difficulty: 'intermediate',
        exercises: [
          {
            name: 'Supino Reto',
            sets: 4,
            reps: '8-10',
            rest: 90,
            tips: ['Manter escápulas retraídas', 'Controlar descida por 2-3 segundos']
          },
          {
            name: 'Supino Inclinado',
            sets: 3,
            reps: '10-12',
            rest: 75,
            tips: ['Ângulo de 30-45°', 'Focar na contração no topo']
          },
          {
            name: 'Fly Peck Deck',
            sets: 3,
            reps: '12-15',
            rest: 60,
            tips: ['Amplitude completa', 'Pause de 1 segundo na contração']
          },
          {
            name: 'Flexão Diamante',
            sets: 2,
            reps: 'até falha',
            rest: 45,
            tips: ['Manter corpo alinhado', 'Descida controlada']
          }
        ],
        aiNotes: [
          'Baseado na sua força atual, este treino está otimizado para hipertrofia',
          'Aumente a carga quando conseguir fazer todas as repetições com boa forma',
          'Foque na conexão mente-músculo durante cada repetição'
        ]
      }
    ];

    setWorkoutPlan(plans[0]);
  };

  const FormScoreCircle = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke={score > 85 ? '#10b981' : score > 70 ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Coach</h1>
                <p className="text-gray-600">Seu treinador pessoal inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateWorkoutPlan}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
              >
                Gerar Treino IA
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Analysis Section */}
          <div className="space-y-6">
            {/* Camera Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Análise de Movimento</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                  >
                    <option value="supino-reto">Supino Reto</option>
                    <option value="agachamento">Agachamento</option>
                    <option value="levantamento-terra">Levantamento Terra</option>
                    <option value="desenvolvimento">Desenvolvimento</option>
                  </select>
                </div>
              </div>

              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: isAnalyzing ? 'block' : 'none' }}
                />
                
                {!isRecording && !isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CameraIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Clique para iniciar análise</p>
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"
                      />
                      <p className="text-sm">Analisando movimento...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center space-x-4">
                {!isRecording && !isAnalyzing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startVideoRecording}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium"
                  >
                    <PlayIcon className="h-5 w-5" />
                    <span>Iniciar Análise</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopVideoRecording}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-medium"
                    disabled={isAnalyzing}
                  >
                    <StopIcon className="h-5 w-5" />
                    <span>Parar</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Analysis Results */}
            <AnimatePresence>
              {analysisData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Resultado da Análise</h3>
                    <FormScoreCircle score={analysisData.formScore} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold text-gray-900">Pontos Fortes</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysisData.strengths.map((strength, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg"
                          >
                            {strength}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-semibold text-gray-900">Melhorias</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysisData.improvements.map((improvement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg"
                          >
                            {improvement}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <LightBulbIcon className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold text-gray-900">Recomendações IA</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {analysisData.recommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                          className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border-l-2 border-blue-400"
                        >
                          {recommendation}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Section */}
          <div className="space-y-6">
            {/* AI Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg flex flex-col h-96"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Chat com AI</h3>
                    <p className="text-sm text-gray-600">Tire suas dúvidas em tempo real</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua pergunta..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Workout Plan */}
            <AnimatePresence>
              {workoutPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workoutPlan.name}</h3>
                      <p className="text-sm text-gray-600">
                        {workoutPlan.duration} min • {workoutPlan.difficulty}
                      </p>
                    </div>
                    <TrophyIcon className="h-6 w-6 text-yellow-500" />
                  </div>

                  <div className="space-y-4 mb-6">
                    {workoutPlan.exercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                          <div className="text-sm text-gray-600">
                            {exercise.sets} x {exercise.reps} | {exercise.rest}s
                          </div>
                        </div>
                        <div className="space-y-1">
                          {exercise.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              💡 {tip}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Notas da IA</h4>
                    <div className="space-y-2">
                      {workoutPlan.aiNotes.map((note, index) => (
                        <div key={index} className="text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
                          🤖 {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachPage; 