import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type ProgressStats = {
  weeklyProgress: Array<{
    week: string;
    workouts: number;
    duration: number;
    exercises: number;
  }>;
  muscleGroupStats: Array<{
    muscle: string;
    count: number;
    percentage: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }>;
  totalStats: {
    totalWorkouts: number;
    totalDuration: number;
    totalExercises: number;
    avgWorkoutsPerWeek: number;
    longestStreak: number;
    favoriteDay: string;
  };
};

const ProgressPage: React.FC = () => {
  const { user } = useAuth();
  
  // Cores para os gráficos
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  const [progressData, setProgressData] = useState<ProgressStats>({
    weeklyProgress: [],
    muscleGroupStats: [],
    achievements: [],
    totalStats: {
      totalWorkouts: 0,
      totalDuration: 0,
      totalExercises: 0,
      avgWorkoutsPerWeek: 0,
      longestStreak: 0,
      favoriteDay: 'Segunda-feira'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateProgress = () => {
      try {
        setLoading(true);
        
        // Carregar dados dos treinos
        const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
        
        // Calcular progresso semanal
        const weeklyProgress = calculateWeeklyProgress(savedWorkouts);
        
        // Calcular estatísticas por grupo muscular
        const muscleGroupStats = calculateMuscleGroupStats(savedWorkouts);
        
        // Gerar conquistas baseadas nos dados
        const achievements = generateAchievements(savedWorkouts);
        
        // Estatísticas totais
        const totalStats = calculateTotalStats(savedWorkouts);
        
        setProgressData({
          weeklyProgress,
          muscleGroupStats,
          achievements,
          totalStats
        });
        
      } catch (error) {
    console.error('Erro ao calcular progresso:', error);
      } finally {
        setLoading(false);
      }
    };
    
    calculateProgress();
  }, []);

  const calculateWeeklyProgress = (workouts: any[]) => {
    const weeks: { [key: string]: { workouts: number; duration: number; exercises: number } } = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.savedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { workouts: 0, duration: 0, exercises: 0 };
      }
      
      weeks[weekKey].workouts++;
      weeks[weekKey].duration += parseInt(workout.duration?.replace(' min', '') || '0');
      weeks[weekKey].exercises += workout.exercises?.length || 0;
    });
    
    return Object.entries(weeks)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        ...data
      }))
      .slice(-8); // Últimas 8 semanas
  };

  const calculateMuscleGroupStats = (workouts: any[]) => {
    const muscleGroups: { [key: string]: number } = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach((exercise: any) => {
        const muscle = exercise.muscleGroup || exercise.exercise?.muscle_group || 'Outros';
        muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1;
      });
    });
    
    const total = Object.values(muscleGroups).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(muscleGroups)
      .map(([muscle, count]) => ({
        muscle,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const generateAchievements = (workouts: any[]) => {
    const achievements = [];
    
    if (workouts.length >= 1) {
      achievements.push({
        id: 'first_workout',
        title: 'Primeiro Passo',
        description: 'Completou seu primeiro treino!',
        unlockedAt: workouts[0]?.savedAt,
        icon: '🎯'
      });
    }
    
    if (workouts.length >= 5) {
      achievements.push({
        id: 'five_workouts',
        title: 'Em Movimento',
        description: 'Completou 5 treinos!',
        unlockedAt: workouts[4]?.savedAt,
        icon: '🔥'
      });
    }
    
    if (workouts.length >= 10) {
      achievements.push({
        id: 'ten_workouts',
        title: 'Dedicado',
        description: 'Completou 10 treinos!',
        unlockedAt: workouts[9]?.savedAt,
        icon: '💪'
      });
    }
    
    // Verificar sequência de dias
    const consecutiveDays = calculateConsecutiveDays(workouts);
    if (consecutiveDays >= 3) {
      achievements.push({
        id: 'three_day_streak',
        title: 'Consistência',
        description: 'Treinou 3 dias seguidos!',
        unlockedAt: new Date().toISOString(),
        icon: '⚡'
      });
    }
    
    return achievements;
  };

  const calculateConsecutiveDays = (workouts: any[]) => {
    if (workouts.length === 0) return 0;
    
    const dates = workouts
      .map(w => new Date(w.savedAt).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  const calculateTotalStats = (workouts: any[]) => {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + parseInt(w.duration?.replace(' min', '') || '0'), 0);
    const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
    
    // Calcular média de treinos por semana
    const firstWorkout = workouts[0];
    if (firstWorkout) {
      const firstDate = new Date(firstWorkout.savedAt);
      const today = new Date();
      const weeksDiff = Math.max(1, Math.ceil((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)));
      var avgWorkoutsPerWeek = Math.round((totalWorkouts / weeksDiff) * 10) / 10;
    } else {
      var avgWorkoutsPerWeek = 0;
    }
    
    // Dia favorito
    const dayCount: { [key: string]: number } = {};
    workouts.forEach(workout => {
      const day = new Date(workout.savedAt).toLocaleDateString('pt-BR', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    
    const favoriteDay = Object.entries(dayCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Segunda-feira';
    
    return {
      totalWorkouts,
      totalDuration,
      totalExercises,
      avgWorkoutsPerWeek,
      longestStreak: calculateConsecutiveDays(workouts),
      favoriteDay
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Analisando seu progresso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-2">
            📊 Análise de Progresso
          </h1>
          <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-lg">
            Acompanhe sua evolução e conquistas no fitness
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">💪</div>
                <h3 className="text-3xl font-bold text-blue-400">{progressData.totalStats.totalWorkouts}</h3>
                <p className="text-sm text-blue-300 mt-1">Treinos Totais</p>
                <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">
                  {progressData.totalStats.avgWorkoutsPerWeek} por semana
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="text-3xl font-bold text-green-400">
                  {Math.round(progressData.totalStats.totalDuration / 60)}h
                </h3>
                <p className="text-sm text-green-300 mt-1">Tempo Total</p>
                <p className="text-xs text-gray-400 mt-1">
                  {progressData.totalStats.totalDuration} minutos
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <h3 className="text-3xl font-bold text-purple-400">{progressData.totalStats.longestStreak}</h3>
                <p className="text-sm text-purple-300 mt-1">Maior Sequência</p>
                <p className="text-xs text-gray-400 mt-1">dias consecutivos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 border-slate-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📅</div>
                <h3 className="text-lg font-bold text-slate-400">{progressData.totalStats.favoriteDay}</h3>
                <p className="text-sm text-slate-300 mt-1">Dia Favorito</p>
                <p className="text-xs text-gray-400 mt-1">para treinar</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Progresso Semanal */}
          <Card className="bg-surface border-gray-700">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-gray-900 flex items-center">
                📈 Evolução de Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.weeklyProgress.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="week" 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        labelStyle={{ color: '#ffffff' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="workouts" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#3b82f6' }}
                        name="Treinos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="duration" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: '#10b981' }}
                        name="Duração (min)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-400">Nenhum dado de progresso ainda</p>
                    <p className="text-sm text-gray-500 mt-2">Complete alguns treinos para ver gráficos</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grupos Musculares */}
          <Card className="bg-surface border-gray-700">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-gray-900 flex items-center">
                🎯 Distribuição Muscular
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.muscleGroupStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gráfico de Pizza */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressData.muscleGroupStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {progressData.muscleGroupStats.map((entry) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#ffffff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legenda */}
                  <div className="space-y-3">
                    {progressData.muscleGroupStats.map((muscle) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-white font-medium">{muscle.muscle}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-primary font-semibold">{muscle.percentage}%</span>
                          <p className="text-xs text-gray-400">{muscle.count} exercícios</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-400">Comece a treinar para ver estatísticas</p>
                    <p className="text-sm text-gray-500 mt-2">Seus grupos musculares aparecerão aqui</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Exercícios por Semana */}
        <Card className="bg-surface border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              🏋️‍♂️ Volume de Exercícios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressData.weeklyProgress.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar 
                      dataKey="exercises" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      name="Exercícios"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏋️‍♂️</div>
                  <p className="text-gray-400">Dados de exercícios aparecerão aqui</p>
                  <p className="text-sm text-gray-500 mt-2">Complete treinos para ver o volume semanal</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className="bg-surface border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              🏆 Suas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressData.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {progressData.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className="bg-gradient-to-br from-slate-900/20 to-purple-900/20 border border-slate-500/30 rounded-lg p-4 text-center"
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-bold text-purple-400 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">Suas conquistas aparecerão aqui!</h3>
                <p className="text-gray-400 mb-6">Complete treinos para desbloquear badges especiais</p>
                <Button className="bg-primary hover:bg-primary/90">
                  Começar Primeiro Treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage; 