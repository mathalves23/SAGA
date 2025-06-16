import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  Target,
  Award,
  Clock,
  Dumbbell,
  TrendingUp,
  Zap,
  BookOpen,
  Play,
  CheckCircle,
  Star
} from 'lucide-react';

interface CoachData {
  currentPlan: {
    name: string;
    duration: string;
    progress: number;
    nextWorkout: string;
  };
  aiRecommendations: Array<{
    type: 'workout' | 'nutrition' | 'recovery';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  personalTrainers: Array<{
    id: string;
    name: string;
    speciality: string;
    rating: number;
    price: string;
    image: string;
    online: boolean;
  }>;
  workoutPlans: Array<{
    id: string;
    name: string;
    level: string;
    duration: string;
    focus: string;
    rating: number;
  }>;
}

const CoachPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ai-coach');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Olá! Sou seu coach pessoal AI. Como posso te ajudar hoje?',
      time: '09:00'
    }
  ]);

  const [coachData, setCoachData] = useState<CoachData>({
    currentPlan: {
      name: 'Hipertrofia Intermediário',
      duration: '12 semanas',
      progress: 65,
      nextWorkout: 'Peito e Tríceps - Amanhã às 18:00'
    },
    aiRecommendations: [
      {
        type: 'workout',
        title: 'Aumente a intensidade',
        description: 'Baseado no seu progresso, você pode aumentar o peso em 5-10% nos exercícios principais.',
        priority: 'high'
      },
      {
        type: 'recovery',
        title: 'Melhore o descanso',
        description: 'Seus dados mostram que você precisa de mais 1h de sono para otimizar a recuperação.',
        priority: 'medium'
      },
      {
        type: 'nutrition',
        title: 'Hidratação',
        description: 'Lembre-se de beber pelo menos 3L de água hoje para manter a performance.',
        priority: 'low'
      }
    ],
    personalTrainers: [
      {
        id: '1',
        name: 'Carlos Silva',
        speciality: 'Hipertrofia e Força',
        rating: 4.9,
        price: 'R$ 120/sessão',
        image: '🏋️‍♂️',
        online: true
      },
      {
        id: '2',
        name: 'Ana Martins',
        speciality: 'Funcional e Cardio',
        rating: 4.8,
        price: 'R$ 100/sessão',
        image: '🤸‍♀️',
        online: false
      },
      {
        id: '3',
        name: 'Pedro Costa',
        speciality: 'Powerlifting',
        rating: 4.7,
        price: 'R$ 150/sessão',
        image: '💪',
        online: true
      }
    ],
    workoutPlans: [
      {
        id: '1',
        name: 'Hipertrofia Total',
        level: 'Intermediário',
        duration: '16 semanas',
        focus: 'Ganho de massa',
        rating: 4.8
      },
      {
        id: '2',
        name: 'Força Máxima',
        level: 'Avançado',
        duration: '12 semanas',
        focus: 'Força',
        rating: 4.9
      },
      {
        id: '3',
        name: 'Iniciante Completo',
        level: 'Iniciante',
        duration: '8 semanas',
        focus: 'Condicionamento',
        rating: 4.6
      }
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      type: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');
    
    // Simular resposta da AI
    setTimeout(() => {
      const responses = [
        'Excelente pergunta! Baseado no seu histórico, eu recomendo...',
        'Vou analisar seus dados e te dar uma resposta personalizada.',
        'Isso é muito importante para o seu progresso. Deixe-me explicar...',
        'Perfeito timing para essa pergunta! Aqui está minha sugestão...'
      ];
      
      const aiResponse = {
        type: 'ai',
        message: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Dumbbell className="h-5 w-5" />;
      case 'nutrition': return <Target className="h-5 w-5" />;
      case 'recovery': return <Clock className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coach Personal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Seu assistente pessoal para maximizar resultados
          </p>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">{coachData.currentPlan.name}</h3>
            <p className="text-purple-100">{coachData.currentPlan.duration}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{coachData.currentPlan.progress}%</div>
            <div className="text-sm text-purple-100">Concluído</div>
          </div>
        </div>
        <div className="w-full bg-purple-500/30 rounded-full h-2 mb-4">
          <div 
            className="bg-white rounded-full h-2"
            style={{ width: `${coachData.currentPlan.progress}%` }}
          ></div>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          Próximo treino: {coachData.currentPlan.nextWorkout}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'ai-coach', label: 'Coach AI', icon: MessageCircle },
            { id: 'trainers', label: 'Personal Trainers', icon: Users },
            { id: 'plans', label: 'Planos de Treino', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ai-coach' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-96">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
                Chat com Coach AI
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recomendações AI</h3>
            {coachData.aiRecommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-600 dark:text-gray-400 mt-1">
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
                    <button className="text-purple-600 hover:text-purple-700 text-sm mt-2">
                      Aplicar sugestão →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachData.personalTrainers.map(trainer => (
            <div key={trainer.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{trainer.image}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{trainer.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trainer.speciality}</p>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avaliação</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-1">{trainer.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    trainer.online 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${trainer.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    {trainer.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Preço</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{trainer.price}</span>
                </div>
              </div>
              
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">
                Contratar Sessão
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachData.workoutPlans.map(plan => (
            <div key={plan.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{plan.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    plan.level === 'Iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    plan.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {plan.level}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{plan.duration}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Foco</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{plan.focus}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avaliação</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-1">{plan.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">
                  Iniciar Plano
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachPage; 