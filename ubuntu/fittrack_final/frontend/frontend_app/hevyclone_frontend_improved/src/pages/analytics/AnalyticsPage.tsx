import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, 
  LineChart, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  Clock,
  Dumbbell,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  weeklyProgress: Array<{ week: string; workouts: number; volume: number }>;
  monthlyStats: {
    totalWorkouts: number;
    totalVolume: number;
    averageDuration: number;
    streakDays: number;
  };
  exerciseBreakdown: Array<{ name: string; count: number; percentage: number }>;
  performanceMetrics: {
    strength: number;
    endurance: number;
    consistency: number;
  };
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    weeklyProgress: [
      { week: 'Sem 1', workouts: 4, volume: 2400 },
      { week: 'Sem 2', workouts: 5, volume: 3200 },
      { week: 'Sem 3', workouts: 3, volume: 2800 },
      { week: 'Sem 4', workouts: 6, volume: 4100 }
    ],
    monthlyStats: {
      totalWorkouts: 18,
      totalVolume: 12500,
      averageDuration: 52,
      streakDays: 7
    },
    exerciseBreakdown: [
      { name: 'Peito', count: 24, percentage: 30 },
      { name: 'Costas', count: 20, percentage: 25 },
      { name: 'Pernas', count: 18, percentage: 22 },
      { name: 'Ombros', count: 12, percentage: 15 },
      { name: 'Braços', count: 6, percentage: 8 }
    ],
    performanceMetrics: {
      strength: 85,
      endurance: 78,
      consistency: 92
    }
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análise detalhada do seu progresso
          </p>
        </div>
        
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="1y">Último ano</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Treinos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.monthlyStats.totalWorkouts}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            +12% vs mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.monthlyStats.totalVolume.toLocaleString()}kg</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            +8% vs mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duração Média</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.monthlyStats.averageDuration}min</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            +5min vs mês anterior
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sequência Atual</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.monthlyStats.streakDays} dias</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            <Award className="h-4 w-4 inline mr-1" />
            Recorde pessoal!
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progresso Semanal</h3>
            <LineChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {analytics.weeklyProgress.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{week.week}</span>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-purple-600 dark:text-purple-400">{week.workouts} treinos</span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span className="text-blue-600 dark:text-blue-400">{week.volume}kg</span>
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(week.workouts / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Grupos Musculares</h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {analytics.exerciseBreakdown.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-purple-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-green-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{exercise.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{exercise.count}</span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-purple-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-green-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${exercise.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10">{exercise.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Métricas de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(analytics.performanceMetrics).map(([key, value], index) => (
            <div key={key} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${value}, 100`}
                    className={`${
                      index === 0 ? 'text-purple-500' :
                      index === 1 ? 'text-blue-500' : 'text-green-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{value}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key === 'strength' ? 'Força' : key === 'endurance' ? 'Resistência' : 'Consistência'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Award className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
          Insights Personalizados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Meta Recomendada</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Baseado no seu progresso, tente aumentar o volume em 10% na próxima semana.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📈 Tendência</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Você está 25% mais consistente que no mês passado. Continue assim!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 