import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShareIcon,
  CogIcon,
  BoltIcon,
  HeartIcon,
  TargetIcon,
  ScaleIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Scatter,
  ScatterChart
} from 'recharts';

interface AnalyticsData {
  workoutFrequency: Array<{
    date: string;
    workouts: number;
    duration: number;
    calories: number;
  }>;
  muscleGroupProgress: Array<{
    muscle: string;
    progress: number;
    volume: number;
    color: string;
  }>;
  strengthProgress: Array<{
    exercise: string;
    previous: number;
    current: number;
    improvement: number;
  }>;
  bodyComposition: Array<{
    date: string;
    weight: number;
    bodyFat: number;
    muscle: number;
  }>;
  personalRecords: Array<{
    exercise: string;
    weight: number;
    reps: number;
    date: string;
    improvement: string;
  }>;
  weeklyStats: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    avgIntensity: number;
    consistency: number;
  };
  monthlyGoals: {
    workouts: { current: number; target: number };
    duration: { current: number; target: number };
    weight: { current: number; target: number };
    bodyFat: { current: number; target: number };
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'progress' | 'goals' | 'insights'>('overview');
  const [loading, setLoading] = useState(true);

  // Simulando dados analíticos realistas
  useEffect(() => {
    const generateAnalyticsData = (): AnalyticsData => {
      const workoutFrequency = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          workouts: Math.floor(Math.random() * 3) + (i % 7 === 0 || i % 7 === 6 ? 0 : 1),
          duration: Math.floor(Math.random() * 60) + 30,
          calories: Math.floor(Math.random() * 300) + 200
        };
      });

      const muscleGroupProgress = [
        { muscle: 'Peito', progress: 85, volume: 12500, color: '#8B5CF6' },
        { muscle: 'Costas', progress: 78, volume: 11200, color: '#10B981' },
        { muscle: 'Pernas', progress: 92, volume: 15800, color: '#F59E0B' },
        { muscle: 'Ombros', progress: 71, volume: 8900, color: '#EF4444' },
        { muscle: 'Braços', progress: 88, volume: 9600, color: '#06B6D4' },
        { muscle: 'Core', progress: 65, volume: 7200, color: '#EC4899' }
      ];

      const strengthProgress = [
        { exercise: 'Supino Reto', previous: 80, current: 87.5, improvement: 9.4 },
        { exercise: 'Agachamento', previous: 120, current: 135, improvement: 12.5 },
        { exercise: 'Levantamento Terra', previous: 140, current: 152.5, improvement: 8.9 },
        { exercise: 'Desenvolvimento', previous: 45, current: 50, improvement: 11.1 },
        { exercise: 'Remada Curvada', previous: 70, current: 77.5, improvement: 10.7 }
      ];

      const bodyComposition = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          date: date.toISOString().split('T')[0],
          weight: 75 + Math.sin(i * 0.5) * 3 + (i * 0.2),
          bodyFat: 15 - (i * 0.3) + Math.sin(i * 0.3) * 1.5,
          muscle: 45 + (i * 0.4) + Math.sin(i * 0.2) * 1
        };
      });

      const personalRecords = [
        { exercise: 'Supino Reto', weight: 87.5, reps: 5, date: '2024-12-15', improvement: '+7.5kg' },
        { exercise: 'Agachamento', weight: 135, reps: 8, date: '2024-12-12', improvement: '+15kg' },
        { exercise: 'Levantamento Terra', weight: 152.5, reps: 3, date: '2024-12-10', improvement: '+12.5kg' },
        { exercise: 'Desenvolvimento', weight: 50, reps: 6, date: '2024-12-08', improvement: '+5kg' }
      ];

      const weeklyStats = {
        totalWorkouts: 5,
        totalDuration: 280,
        totalCalories: 1250,
        avgIntensity: 7.8,
        consistency: 85
      };

      const monthlyGoals = {
        workouts: { current: 18, target: 20 },
        duration: { current: 1080, target: 1200 },
        weight: { current: 78.2, target: 80 },
        bodyFat: { current: 12.8, target: 12 }
      };

      return {
        workoutFrequency,
        muscleGroupProgress,
        strengthProgress,
        bodyComposition,
        personalRecords,
        weeklyStats,
        monthlyGoals
      };
    };

    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'purple',
    trend = 'up'
  }: {
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
            {trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </motion.div>
  );

  const GoalProgress = ({ 
    title, 
    current, 
    target, 
    unit = '',
    color = '#8B5CF6' 
  }: {
    title: string;
    current: number;
    target: number;
    unit?: string;
    color?: string;
  }) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <span className="text-sm font-medium text-gray-600">
            {current}{unit} / {target}{unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="text-right text-sm font-medium" style={{ color }}>
          {percentage.toFixed(1)}%
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Acompanhe seu progresso e performance</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              {/* View Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['overview', 'progress', 'goals', 'insights'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                      selectedView === view
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <ShareIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                <CogIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && analyticsData && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Treinos Esta Semana"
                  value={analyticsData.weeklyStats.totalWorkouts}
                  change="+25%"
                  icon={FireIcon}
                  color="orange"
                  trend="up"
                />
                <StatCard
                  title="Tempo Total (min)"
                  value={analyticsData.weeklyStats.totalDuration}
                  change="+12%"
                  icon={ClockIcon}
                  color="blue"
                  trend="up"
                />
                <StatCard
                  title="Calorias Queimadas"
                  value={analyticsData.weeklyStats.totalCalories}
                  change="+8%"
                  icon={BoltIcon}
                  color="green"
                  trend="up"
                />
                <StatCard
                  title="Consistência"
                  value={`${analyticsData.weeklyStats.consistency}%`}
                  change="+5%"
                  icon={TargetIcon}
                  color="purple"
                  trend="up"  
                />
              </div>

              {/* Workout Frequency Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Frequência de Treinos</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      Treinos
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                      Duração (min)
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.workoutFrequency}>
                    <defs>
                      <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                    />
                    <Area
                      type="monotone"
                      dataKey="workouts"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fill="url(#workoutGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="duration"
                      stroke="#EC4899"
                      strokeWidth={2}
                      fill="url(#durationGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Muscle Group Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Progresso por Grupo Muscular</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={analyticsData.muscleGroupProgress}>
                        <RadialBar
                          minAngle={15}
                          label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                          background
                          clockWise
                          dataKey="progress"
                        />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {analyticsData.muscleGroupProgress.map((muscle, index) => (
                      <motion.div
                        key={muscle.muscle}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: muscle.color }}
                          />
                          <span className="font-medium">{muscle.muscle}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{muscle.progress}%</div>
                          <div className="text-sm text-gray-600">{muscle.volume.toLocaleString()}kg</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Personal Records */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recordes Pessoais Recentes</h3>
                  <TrophyIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyticsData.personalRecords.map((record, index) => (
                    <motion.div
                      key={record.exercise}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{record.exercise}</h4>
                        <span className="text-sm font-medium text-green-600">{record.improvement}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{record.weight}kg × {record.reps} reps</span>
                        <span>{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedView === 'goals' && analyticsData && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Metas do Mês</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GoalProgress
                    title="Treinos Realizados"
                    current={analyticsData.monthlyGoals.workouts.current}
                    target={analyticsData.monthlyGoals.workouts.target}
                    color="#8B5CF6"
                  />
                  <GoalProgress
                    title="Tempo de Treino"
                    current={analyticsData.monthlyGoals.duration.current}
                    target={analyticsData.monthlyGoals.duration.target}
                    unit=" min"
                    color="#10B981"
                  />
                  <GoalProgress
                    title="Peso Alvo"
                    current={analyticsData.monthlyGoals.weight.current}
                    target={analyticsData.monthlyGoals.weight.target}
                    unit=" kg"
                    color="#F59E0B"
                  />
                  <GoalProgress
                    title="Gordura Corporal"
                    current={analyticsData.monthlyGoals.bodyFat.target}
                    target={analyticsData.monthlyGoals.bodyFat.current}
                    unit="%"
                    color="#EF4444"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 