import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiService, AIFormAnalysis, AIWorkoutPlan } from '../../services/aiService';
import { 
  CircleStackIcon as BrainIcon,
  CameraIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ChartBarIcon as TrendingUpIcon,
  EyeIcon,
  BoltIcon,
  TagIcon as TargetIcon,
  TrophyIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  SparklesIcon,
  ChartBarIcon,
  UserIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface AIFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'available' | 'premium' | 'coming-soon';
  accuracy?: number;
}

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  time: string;
  suggestions?: string[];
}

interface FormAnalysis {
  exercise: string;
  score: number;
  feedback: Array<{
    type: 'good' | 'warning' | 'error';
    message: string;
  }>;
  improvements: string[];
  repetition: number;
  totalReps: number;
}

interface WorkoutSuggestion {
  id: string;
  name: string;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  exercises: string[];
  aiReason: string;
}

const AIPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState('assistant');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [formAnalysis, setFormAnalysis] = useState<FormAnalysis>({
    exercise: 'Agachamento',
    score: 85,
    feedback: [
      { type: 'good', message: 'Boa profundidade no movimento' },
      { type: 'warning', message: 'Joelhos ligeiramente para dentro' },
      { type: 'good', message: 'Postura do tronco correta' },
      { type: 'error', message: 'Velocidade muito rápida na descida' }
    ],
    improvements: [
      'Mantenha os joelhos alinhados com os pés',
      'Foque na ativação do glúteo na subida',
      'Controle a velocidade na descida (2-3 segundos)',
      'Respire corretamente: inspire na descida, expire na subida'
    ],
    repetition: 8,
    totalReps: 12
  });

  const [workoutSuggestions] = useState<WorkoutSuggestion[]>([
    {
      id: '1',
      name: 'Treino Push Personalizado',
      duration: '45 min',
      difficulty: 'Intermediário',
      exercises: ['Supino Reto', 'Desenvolvimento', 'Tríceps Testa', 'Elevação Lateral'],
      aiReason: 'Baseado no seu histórico de treinos e progressão atual'
    },
    {
      id: '2',
      name: 'HIIT Cardio Inteligente',
      duration: '20 min',
      difficulty: 'Avançado',
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees'],
      aiReason: 'Otimizado para queima de gordura considerando sua frequência cardíaca'
    },
    {
      id: '3',
      name: 'Recuperação Ativa',
      duration: '30 min',
      difficulty: 'Iniciante',
      exercises: ['Alongamento', 'Yoga Flow', 'Caminhada', 'Respiração'],
      aiReason: 'Recomendado para recuperação após seus treinos intensos desta semana'
    }
  ]);

  const [aiFeatures] = useState<AIFeature[]>([
    {
      id: 'assistant',
      title: 'Assistente Virtual',
      description: 'Chat inteligente para dúvidas sobre treino e nutrição',
      icon: BrainIcon,
      status: 'available',
      accuracy: 95
    },
    {
      id: 'form-analysis',
      title: 'Análise de Forma',
      description: 'Análise automática da execução dos exercícios via câmera',
      icon: CameraIcon,
      status: 'available',
      accuracy: 88
    },
    {
      id: 'voice-control',
      title: 'Comando de Voz',
      description: 'Controle a aplicação usando comandos de voz',
      icon: MicrophoneIcon,
      status: 'available',
      accuracy: 92
    },
    {
      id: 'workout-generation',
      title: 'Geração de Treinos',
      description: 'Criação automática de treinos personalizados',
      icon: DocumentTextIcon,
      status: 'available',
      accuracy: 90
    },
    {
      id: 'nutrition-ai',
      title: 'Nutrição Inteligente',
      description: 'Recomendações nutricionais baseadas em IA',
      icon: TargetIcon,
      status: 'premium',
      accuracy: 87
    },
    {
      id: 'injury-prevention',
      title: 'Prevenção de Lesões',
      description: 'Análise preditiva para prevenir lesões',
      icon: EyeIcon,
      status: 'coming-soon',
      accuracy: 85
    }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'ai',
      message: 'Olá, Matheus! 👋 Sou sua IA pessoal do SAGA. Posso te ajudar com treinos, nutrição, análise de forma e muito mais. O que você gostaria de saber?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Criar um treino personalizado',
        'Analisar meu progresso',
        'Dicas de nutrição',
        'Corrigir minha forma'
      ]
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedWorkouts, setGeneratedWorkouts] = useState<AIWorkoutPlan[]>([]);
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  
  // Estados para geração de treino
  const [workoutObjective, setWorkoutObjective] = useState('Hipertrofia');
  const [workoutDuration, setWorkoutDuration] = useState('45 min');
  const [workoutLevel, setWorkoutLevel] = useState('Intermediário');
  const [workoutMuscleGroup, setWorkoutMuscleGroup] = useState('Corpo Inteiro');

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    
    // Debug: verificar se a API key está sendo carregada
    console.log('🔧 Debug API Key:', {
      exists: !!(import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY),
      isConfigured: aiService.isConfigured(),
      apiKey: (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY) ? 'Configurada' : 'Não configurada'
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async (message?: string) => {
    const messageText = message || newMessage;
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = {
      type: 'user',
      message: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    try {
      // Usar o serviço real de IA
      const response = await aiService.chatAssistant(messageText, chatHistory);
      
      const aiMessage: ChatMessage = {
        type: 'ai',
        message: response.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro na consulta à IA:', error);
      
      const errorMessage: ChatMessage = {
        type: 'ai',
        message: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Tentar novamente', 'Ver FAQ', 'Falar com suporte']
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
    setIsListening(true);
    setVoiceCommand('🎤 Ouvindo...');
    
    // Simular reconhecimento de voz (em produção, usar Web Speech API)
    setTimeout(async () => {
      const commands = [
        'Iniciar treino de peito hoje',
        'Mostrar meu progresso desta semana',
        'Quantos exercícios de perna tenho programados?',
        'Criar novo treino de hipertrofia',
        'Analisar minha forma no agachamento',
        'Sugerir refeição pós-treino',
        'Quanto tempo falta para meu objetivo?'
      ];
      
      const selectedCommand = commands[Math.floor(Math.random() * commands.length)];
      setVoiceCommand(`"${selectedCommand}"`);
      setIsRecording(false);
      setIsListening(false);
      
      try {
        // Processar comando com IA real
        const response = await aiService.processVoiceCommand(selectedCommand);
        
        // Adicionar resposta ao chat
        const aiMessage: ChatMessage = {
          type: 'ai',
          message: `🎤 ${response}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ['Continuar conversa', 'Novo comando', 'Ver detalhes']
        };
        
        setChatHistory(prev => [...prev, aiMessage]);
        setVoiceCommand('');
      } catch (error) {
        console.error('Erro no processamento de voz:', error);
        setVoiceCommand('Erro no processamento');
        setTimeout(() => setVoiceCommand(''), 2000);
      }
    }, 3000);
  };

  const startFormAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simular progresso da análise
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
    
    try {
      // Usar IA real para análise
      const aiAnalysis = await aiService.analyzeForm(formAnalysis.exercise);
      
      // Atualizar com dados reais da IA
      setFormAnalysis({
        ...aiAnalysis,
        repetition: formAnalysis.repetition,
        totalReps: formAnalysis.totalReps
      });
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Erro na análise de forma:', error);
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
      case 'coming-soon': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'premium': return 'Premium';
      case 'coming-soon': return 'Em Breve';
      default: return 'Indisponível';
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'good': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default: return <LightBulbIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const generateAIWorkout = async () => {
    setIsGeneratingWorkout(true);
    try {
      const workout = await aiService.generateWorkout(
        workoutObjective,
        workoutDuration,
        workoutLevel,
        workoutMuscleGroup
      );
      
      setGeneratedWorkouts(prev => [workout, ...prev.slice(0, 2)]); // Manter apenas 3 treinos
      
      // Adicionar ao chat como confirmação
      const aiMessage: ChatMessage = {
        type: 'ai',
        message: `🚀 Treino criado com sucesso! "${workout.name}" foi gerado especialmente para você com base em seus parâmetros: ${workoutObjective}, ${workoutDuration}, nível ${workoutLevel}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Ver detalhes do treino', 'Gerar outro treino', 'Iniciar treino agora']
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro na geração do treino:', error);
      
      const errorMessage: ChatMessage = {
        type: 'ai',
        message: 'Houve um problema na geração do treino. Tente novamente em alguns instantes.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Tentar novamente', 'Usar treino padrão']
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingWorkout(false);
    }
  };

  const renderAssistant = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <BrainIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Assistente IA SAGA</h3>
            <p className="text-[#8b8b8b]">Seu personal trainer virtual</p>
          </div>
        </div>
        
        <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-[#0a0a0b] rounded-lg p-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-[#2d2d30] text-white'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion)}
                        className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#2d2d30] text-white rounded-lg p-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua pergunta..."
            className="flex-1 bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => sendMessage()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  const renderFormAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Análise de Forma</h3>
              <p className="text-[#8b8b8b]">IA para correção de técnica</p>
            </div>
          </div>
          
          <button
            onClick={startFormAnalysis}
            disabled={isAnalyzing}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isAnalyzing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAnalyzing ? 'Analisando...' : 'Iniciar Análise'}
          </button>
        </div>
        
        {isAnalyzing && (
          <div className="mb-6 bg-[#2d2d30] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CameraIcon className="w-5 h-5 text-blue-400" />
              <span className="text-white">Analisando movimento...</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-[#8b8b8b] mt-1">{analysisProgress}% concluído</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2d2d30] rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">{formAnalysis.exercise}</h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-400">{formAnalysis.score}</span>
                <span className="text-[#8b8b8b]">/100</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {formAnalysis.feedback.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {getFeedbackIcon(item.type)}
                  <span className="text-sm text-white">{item.message}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-[#8b8b8b]">
              <span>Repetição: {formAnalysis.repetition}/{formAnalysis.totalReps}</span>
              <span className="text-blue-400">Em tempo real</span>
            </div>
          </div>
          
          <div className="bg-[#2d2d30] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-4">Melhorias Sugeridas</h4>
            <div className="space-y-3">
              {formAnalysis.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <LightBulbIcon className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-sm text-white">{improvement}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                // Salvar análise no histórico ou backend
                console.log('Análise salva:', formAnalysis);
                // Aqui seria integrado com o backend para salvar a análise
              }}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
            >
              Salvar Análise
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVoiceControl = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <MicrophoneIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Comando de Voz</h3>
            <p className="text-[#8b8b8b]">Controle por voz inteligente</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-110' 
              : 'bg-[#2d2d30] hover:bg-[#404040]'
          }`}>
            <button
              onClick={startVoiceRecording}
              disabled={isRecording}
              className="w-full h-full rounded-full"
            >
              <MicrophoneIcon className={`w-12 h-12 mx-auto ${isListening ? 'text-white animate-pulse' : 'text-gray-400'}`} />
            </button>
          </div>
          
          <p className="text-white mt-4 text-lg">
            {isRecording ? 'Ouvindo...' : 'Toque para falar'}
          </p>
          
          {voiceCommand && (
            <div className="mt-4 bg-[#2d2d30] rounded-lg p-4">
              <p className="text-[#8b8b8b] text-sm mb-1">Comando reconhecido:</p>
              <p className="text-white font-medium">{voiceCommand}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2d2d30] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Comandos Disponíveis</h4>
            <div className="space-y-1 text-sm text-[#8b8b8b]">
              <p>• "Iniciar treino de [grupo muscular]"</p>
              <p>• "Mostrar meu progresso"</p>
              <p>• "Quantos exercícios tenho hoje?"</p>
              <p>• "Criar novo treino"</p>
              <p>• "Analisar minha forma"</p>
            </div>
          </div>
          
          <div className="bg-[#2d2d30] rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Status do Sistema</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b8b8b]">Reconhecimento</span>
                <span className="text-green-400 text-sm">92% precisão</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b8b8b]">Processamento</span>
                <span className="text-green-400 text-sm">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b8b8b]">Latência</span>
                <span className="text-green-400 text-sm">&lt; 1s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkoutGeneration = () => (
    <div className="space-y-6">
      <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Geração de Treinos IA</h3>
            <p className="text-[#8b8b8b]">Treinos personalizados automaticamente</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {workoutSuggestions.map((workout) => (
            <div key={workout.id} className="bg-[#2d2d30] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{workout.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  workout.difficulty === 'Iniciante' ? 'bg-green-100 text-green-600' :
                  workout.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {workout.difficulty}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#8b8b8b]">
                  <ClockIcon className="w-4 h-4" />
                  <span>{workout.duration}</span>
                </div>
                <div className="text-sm text-[#8b8b8b]">
                  <p className="mb-1">Exercícios:</p>
                  <ul className="text-xs space-y-1">
                    {workout.exercises.map((exercise, idx) => (
                      <li key={idx}>• {exercise}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-[#1a1a1b] rounded p-2 mb-3">
                <p className="text-xs text-[#8b8b8b] mb-1">🤖 IA Recomenda:</p>
                <p className="text-xs text-white">{workout.aiReason}</p>
              </div>
              
              <button 
                onClick={() => {
                  console.log('Treino selecionado:', workout);
                  // Aqui seria direcionado para a página de treino ou adicionado à rotina
                  alert(`Treino "${workout.name}" adicionado aos seus treinos!`);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Usar Este Treino
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-[#2d2d30] rounded-lg p-4">
          <h4 className="font-semibold text-white mb-4">Criar Treino Personalizado</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select 
              value={workoutObjective}
              onChange={(e) => setWorkoutObjective(e.target.value)}
              className="bg-[#1a1a1b] border border-[#404040] rounded-lg px-3 py-2 text-white"
            >
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Força">Força</option>
              <option value="Resistência">Resistência</option>
              <option value="Queima de Gordura">Queima de Gordura</option>
            </select>
            
            <select 
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
              className="bg-[#1a1a1b] border border-[#404040] rounded-lg px-3 py-2 text-white"
            >
              <option value="30 min">30 min</option>
              <option value="45 min">45 min</option>
              <option value="60 min">60 min</option>
              <option value="90 min">90 min</option>
            </select>
            
            <select 
              value={workoutLevel}
              onChange={(e) => setWorkoutLevel(e.target.value)}
              className="bg-[#1a1a1b] border border-[#404040] rounded-lg px-3 py-2 text-white"
            >
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
            
            <select 
              value={workoutMuscleGroup}
              onChange={(e) => setWorkoutMuscleGroup(e.target.value)}
              className="bg-[#1a1a1b] border border-[#404040] rounded-lg px-3 py-2 text-white"
            >
              <option value="Corpo Inteiro">Corpo Inteiro</option>
              <option value="Superior">Superior</option>
              <option value="Inferior">Inferior</option>
              <option value="Push">Push</option>
              <option value="Pull">Pull</option>
            </select>
          </div>
          
          <button 
            onClick={generateAIWorkout}
            disabled={isGeneratingWorkout}
            className={`w-full py-3 rounded-lg transition-colors ${
              isGeneratingWorkout 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isGeneratingWorkout ? '🔄 Gerando...' : '🚀 Gerar Treino com IA'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'assistant':
        return renderAssistant();
      case 'form-analysis':
        return renderFormAnalysis();
      case 'voice-control':
        return renderVoiceControl();
      case 'workout-generation':
        return renderWorkoutGeneration();
      default:
        return renderAssistant();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BrainIcon className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Inicializando IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🤖 Inteligência Artificial</h1>
          <p className="text-[#8b8b8b] text-lg">Tecnologia avançada para otimizar seus treinos</p>
          
          {/* Aviso de configuração da API */}
          {!aiService.isConfigured() && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                <h3 className="font-semibold">Configuração Necessária</h3>
              </div>
              <p className="text-yellow-100 text-sm">
                Para usar as funcionalidades reais de IA, configure a variável de ambiente 
                <code className="bg-black/30 px-1 py-0.5 rounded mx-1">REACT_APP_OPENAI_API_KEY</code> 
                com sua chave da OpenAI.
              </p>
              <p className="text-yellow-200 text-xs mt-2">
                Sem a configuração, as funcionalidades funcionarão em modo demonstração.
              </p>
            </div>
          )}
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 cursor-pointer transition-all hover:border-purple-500 ${
                  activeFeature === feature.id ? 'border-purple-500 bg-purple-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(feature.status)}`}>
                    {getStatusText(feature.status)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#8b8b8b] text-sm mb-4">{feature.description}</p>
                
                {feature.accuracy && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8b8b8b]">Precisão</span>
                    <span className="text-green-400 font-medium">{feature.accuracy}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Feature Content */}
        {renderFeatureContent()}
      </div>
    </div>
  );
};

export default AIPage; 