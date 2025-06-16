import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, Plus, Calendar, Trophy, TrendingUp, Filter } from 'lucide-react';

type Goal = {
  id: string;
  title: string;
  description: string;
  type: 'weight' | 'frequency' | 'duration' | 'strength' | 'endurance';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  completedAt?: string;
  priority: 'high' | 'medium' | 'low';
};

type NewGoal = Omit<Goal, 'id' | 'createdAt' | 'currentValue' | 'status'>;

const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    description: '',
    type: 'weight',
    targetValue: 0,
    unit: 'kg',
    deadline: '',
    priority: 'medium'
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      setLoading(true);
      const savedGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      
      // Atualizar progresso das metas baseado nos treinos
      const workouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      const updatedGoals = savedGoals.map((goal: Goal) => {
        return updateGoalProgress(goal, workouts);
      });
      
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    } catch (error) {
    console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = (goal: Goal, workouts: any[]): Goal => {
    let currentValue = goal.currentValue;
    
    switch (goal.type) {
      case 'frequency':
        // Meta de frequência - contar treinos no período
        const deadline = new Date(goal.deadline);
        const created = new Date(goal.createdAt);
        const relevantWorkouts = workouts.filter(w => {
          const workoutDate = new Date(w.savedAt);
          return workoutDate >= created && workoutDate <= deadline;
        });
        currentValue = relevantWorkouts.length;
        break;
        
      case 'duration':
        // Meta de duração total
        const totalDuration = workouts.reduce((sum, w) => {
          const duration = parseInt(w.duration?.replace(' min', '') || '0');
          return sum + duration;
        }, 0);
        currentValue = totalDuration;
        break;
        
      default:
        // Para metas de peso/força, manter valor atual (atualizado manualmente)
        break;
    }
    
    return {
      ...goal,
      currentValue,
      status: currentValue >= goal.targetValue ? 'completed' : goal.status
    };
  };

  const saveGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) return;
    
    const goal: Goal = {
      ...newGoal,
      id: Date.now().toString(),
      currentValue: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    
    setShowCreateModal(false);
    setNewGoal({
      title: '',
      description: '',
      type: 'weight',
      targetValue: 0,
      unit: 'kg',
      deadline: '',
      priority: 'medium'
    });
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const updateCurrentValue = (goalId: string, value: number) => {
    updateGoal(goalId, { 
      currentValue: value,
      status: value >= goals.find(g => g.id === goalId)?.targetValue! ? 'completed' : 'active'
    });
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'weight': return <Target className="w-6 h-6" />;
      case 'frequency': return <Calendar className="w-6 h-6" />;
      case 'duration': return <TrendingUp className="w-6 h-6" />;
      case 'strength': return <Trophy className="w-6 h-6" />;
      case 'endurance': return <TrendingUp className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const goalTypeOptions = [
    { value: 'weight', label: 'Peso Corporal', unit: 'kg' },
    { value: 'frequency', label: 'Frequência de Treino', unit: 'treinos' },
    { value: 'duration', label: 'Tempo Total', unit: 'minutos' },
    { value: 'strength', label: 'Força (1RM)', unit: 'kg' },
    { value: 'endurance', label: 'Resistência', unit: 'minutos' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando suas metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Minhas Metas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Defina objetivos e acompanhe seu progresso
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por:</span>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption === 'all' ? 'Todas' : 
               filterOption === 'active' ? 'Ativas' : 'Concluídas'}
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-white/20">
                {goals.filter(g => filterOption === 'all' || g.status === filterOption).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Metas */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentValue, goal.targetValue);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-600 dark:text-purple-400">
                        {getGoalIcon(goal.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {goal.priority === 'high' ? 'Alta' : 
                       goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progresso</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          goal.status === 'completed' ? 'bg-green-500' : 'bg-purple-600'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {Math.round(progressPercentage)}% concluído
                      </span>
                      <span className={`text-xs ${
                        daysRemaining < 0 ? 'text-red-500' :
                        daysRemaining < 7 ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        {daysRemaining < 0 ? 'Vencido' :
                         daysRemaining === 0 ? 'Hoje' :
                         `${daysRemaining} dias restantes`}
                      </span>
                    </div>
                  </div>
                  
                  {goal.status === 'active' && goal.type !== 'frequency' && goal.type !== 'duration' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Atualizar Progresso
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm 
                                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Valor atual (${goal.unit})`}
                          onBlur={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              updateCurrentValue(goal.id, value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      goal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      goal.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {goal.status === 'completed' ? '✅ Concluída' :
                       goal.status === 'active' ? '🎯 Ativa' : '⏸️ Pausada'}
                    </span>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
                                 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="px-3 py-1 text-xs text-red-600 hover:text-red-800 
                                 border border-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {filter === 'all' ? 'Nenhuma meta definida' :
               filter === 'active' ? 'Nenhuma meta ativa' : 'Nenhuma meta concluída'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' ? 'Crie sua primeira meta para começar a acompanhar seu progresso!' :
               filter === 'active' ? 'Você não possui metas ativas no momento.' : 'Você ainda não concluiu nenhuma meta.'}
            </p>
            {filter === 'all' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Criar Primeira Meta
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de criação será implementado posteriormente */}
    </div>
  );
};

export default GoalsPage; 