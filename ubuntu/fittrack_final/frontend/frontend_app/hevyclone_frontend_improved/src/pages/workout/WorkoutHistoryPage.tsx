import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';

type WorkoutHistoryItem = {
  id: string;
  name: string;
  savedAt: string;
  duration: string;
  exercises: any[];
  totalSets?: number;
  totalReps?: number;
};

type FilterOptions = {
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  sortBy: 'date' | 'duration' | 'exercises';
  sortOrder: 'asc' | 'desc';
};

const WorkoutHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    averageDuration: 0,
    totalExercises: 0,
    longestWorkout: 0,
    mostActiveMonth: '',
    favoriteExercise: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workouts, filters]);

  const loadWorkoutHistory = () => {
    try {
      setLoading(true);
      
      const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      
      const processedWorkouts = savedWorkouts.map((workout: any) => {
        const totalSets = workout.exercises?.reduce((sum: number, ex: any) => {
          // Verificar se sets é um array ou número
          const sets = Array.isArray(ex.sets) ? ex.sets.length : (ex.sets || 0);
          return sum + sets;
        }, 0) || 0;
        
        const totalReps = workout.exercises?.reduce((sum: number, ex: any) => {
          // Calcular reps totais considerando diferentes formatos
          let reps = 0;
          if (Array.isArray(ex.sets)) {
            reps = ex.sets.reduce((setSum: number, set: any) => setSum + (set.reps || 0), 0);
          } else {
            reps = (ex.reps || 0) * (ex.sets || 0);
          }
          return sum + reps;
        }, 0) || 0;
        
        return {
          ...workout,
          totalSets,
          totalReps
        };
      });
      
      setWorkouts(processedWorkouts);
      calculateStats(processedWorkouts);
      
    } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workouts];
    
    // Filtrar por período
    const now = new Date();
    switch (filters.timeRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(w => new Date(w.savedAt) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(w => new Date(w.savedAt) >= monthAgo);
        break;
      case 'quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(w => new Date(w.savedAt) >= quarterAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(w => new Date(w.savedAt) >= yearAgo);
        break;
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
          break;
        case 'duration':
          const aDuration = parseInt(a.duration?.replace(' min', '') || '0');
          const bDuration = parseInt(b.duration?.replace(' min', '') || '0');
          comparison = aDuration - bDuration;
          break;
        case 'exercises':
          comparison = (a.exercises?.length || 0) - (b.exercises?.length || 0);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setFilteredWorkouts(filtered);
  };

  const calculateStats = (workoutList: WorkoutHistoryItem[]) => {
    if (workoutList.length === 0) {
      setStats({
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalExercises: 0,
        longestWorkout: 0,
        mostActiveMonth: '',
        favoriteExercise: ''
      });
      return;
    }
    
    const totalWorkouts = workoutList.length;
    const durations = workoutList.map(w => parseInt(w.duration?.replace(' min', '') || '0'));
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    const averageDuration = Math.round(totalDuration / totalWorkouts);
    const longestWorkout = Math.max(...durations);
    const totalExercises = workoutList.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
    
    // Mês mais ativo
    const monthCounts: { [key: string]: number } = {};
    workoutList.forEach(workout => {
      const month = new Date(workout.savedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const mostActiveMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
    // Exercício favorito
    const exerciseCounts: { [key: string]: number } = {};
    workoutList.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const name = exercise.name || exercise.exercise?.name || 'Exercício';
        exerciseCounts[name] = (exerciseCounts[name] || 0) + 1;
      });
    });
    const favoriteExercise = Object.entries(exerciseCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
    setStats({
      totalWorkouts,
      totalDuration,
      averageDuration,
      totalExercises,
      longestWorkout,
      mostActiveMonth,
      favoriteExercise
    });
  };

  const getWorkoutIcon = (index: number, exerciseCount: number) => {
    if (exerciseCount >= 10) return '🔥';
    if (exerciseCount >= 7) return '💪';
    if (exerciseCount >= 5) return '⚡';
    return '✅';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                📊 Histórico de Treinos
              </h1>
              <p className="text-gray-300 text-lg">
                Acompanhe sua jornada e evolução
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/routines/discover">
                <Button className="bg-primary hover:bg-primary/90">
                  🔥 Novo Treino
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">💪</div>
                <h3 className="text-xl font-bold text-blue-400">{stats.totalWorkouts}</h3>
                <p className="text-xs text-blue-300">Treinos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <h3 className="text-xl font-bold text-green-400">{Math.round(stats.totalDuration / 60)}h</h3>
                <p className="text-xs text-green-300">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">📊</div>
                <h3 className="text-xl font-bold text-purple-400">{stats.averageDuration}min</h3>
                <p className="text-xs text-purple-300">Média</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/20 border-slate-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <h3 className="text-xl font-bold text-slate-400">{stats.totalExercises}</h3>
                <p className="text-xs text-slate-300">Exercícios</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">🔥</div>
                <h3 className="text-xl font-bold text-red-400">{stats.longestWorkout}min</h3>
                <p className="text-xs text-red-300">Máximo</p>
              </div>
            </CardContent>
          </Card>
          
                        <Card className="bg-teal-900/20 border-teal-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <h3 className="text-sm font-bold text-teal-400 truncate">{stats.favoriteExercise || 'N/A'}</h3>
                <p className="text-xs text-teal-300">Favorito</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-surface border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
                <select 
                  value={filters.timeRange}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
                >
                  <option value="all">Todos</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mês</option>
                  <option value="quarter">Últimos 3 meses</option>
                  <option value="year">Último ano</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
                >
                  <option value="date">Data</option>
                  <option value="duration">Duração</option>
                  <option value="exercises">Exercícios</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
                <select 
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({...filters, sortOrder: e.target.value as any})}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
                >
                  <option value="desc">Mais recente</option>
                  <option value="asc">Mais antigo</option>
                </select>
              </div>
              
              <div className="ml-auto">
                <p className="text-sm text-gray-400">
                  {filteredWorkouts.length} treino{filteredWorkouts.length !== 1 ? 's' : ''} encontrado{filteredWorkouts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Treinos */}
        {filteredWorkouts.length > 0 ? (
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-surface border-gray-700 hover:border-primary/50 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">
                          {getWorkoutIcon(index, workout.exercises?.length || 0)}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {workout.name || 'Treino Personalizado'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatDate(workout.savedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-900/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-blue-400 font-medium">Duração</p>
                          <p className="text-lg font-bold text-blue-300">{workout.duration || 'N/A'}</p>
                        </div>
                        <div className="bg-green-900/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-green-400 font-medium">Exercícios</p>
                          <p className="text-lg font-bold text-green-300">{workout.exercises?.length || 0}</p>
                        </div>
                        <div className="bg-purple-900/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-400 font-medium">Séries</p>
                          <p className="text-lg font-bold text-purple-300">{workout.totalSets || 0}</p>
                        </div>
                        <div className="bg-slate-900/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-400 font-medium">Repetições</p>
                          <p className="text-lg font-bold text-slate-300">{workout.totalReps || 0}</p>
                        </div>
                      </div>
                      
                      {workout.exercises && workout.exercises.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-300 mb-2">Exercícios realizados:</p>
                          <div className="flex flex-wrap gap-2">
                            {workout.exercises.slice(0, 5).map((exercise, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600"
                              >
                                {exercise.name || exercise.exercise?.name || `Exercício ${idx + 1}`}
                              </span>
                            ))}
                            {workout.exercises.length > 5 && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                                +{workout.exercises.length - 5} mais
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-300 border border-green-700">
                        ✓ Concluído
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <Card className="bg-surface border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-2xl font-semibold text-white mb-3">Nenhum treino registrado</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Comece sua jornada fitness registrando seu primeiro treino. 
                Escolha uma rotina ou crie um treino personalizado.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/routines/discover">
                  <Button className="bg-primary hover:bg-primary/90">
                    Descobrir Rotinas
                  </Button>
                </Link>
                <Link to="/workout/start">
                  <Button variant="outline" className="border-primary text-primary">
                    Treino Livre
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-surface border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum treino encontrado</h3>
              <p className="text-gray-400 mb-4">
                Tente ajustar os filtros para ver mais resultados.
              </p>
              <Button 
                onClick={() => setFilters({ timeRange: 'all', sortBy: 'date', sortOrder: 'desc' })}
                variant="outline" 
                className="border-primary text-primary"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
