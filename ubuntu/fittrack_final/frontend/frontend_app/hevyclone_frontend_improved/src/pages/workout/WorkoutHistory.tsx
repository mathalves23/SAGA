import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

type SavedWorkout = {
  id: string;
  routineId: string;
  name: string;
  duration: string;
  date: string;
  exercises: Array<{
    id: string;
    name: string;
    muscleGroup: string;
    notes: string;
    sets: Array<{
      weight: number;
      reps: number;
      completed: boolean;
      isPR: boolean;
    }>;
  }>;
  savedAt: string;
};

function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    try {
      // Buscar treinos salvos no localStorage
      const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
      
      // Ordenar por data mais recente
      const sortedWorkouts = savedWorkouts.sort((a: SavedWorkout, b: SavedWorkout) => 
        new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
      
      setWorkouts(sortedWorkouts);
    } catch (error) {
    console.error('Erro ao carregar histórico:', error);
      toast.error('Erro ao carregar histórico de treinos');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico de treinos?')) {
      localStorage.removeItem('savedWorkouts');
      setWorkouts([]);
      toast.success('Histórico limpo com sucesso!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getWorkoutStats = (workout: SavedWorkout) => {
    const completedSets = workout.exercises.flatMap(ex => 
      ex.sets.filter(set => set.completed)
    );
    
    const totalVolume = completedSets.reduce((total, set) => 
      total + (set.weight * set.reps), 0
    );
    
    const mainExercises = workout.exercises
      .filter(ex => ex.sets.some(set => set.completed))
      .map(ex => ex.name)
      .slice(0, 4);
    
    return {
      totalSets: completedSets.length,
      totalVolume,
      mainExercises
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-blue-500 text-xl">Carregando histórico...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-[#1c1c1e] px-4 py-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Histórico de Treinos</h1>
            <p className="text-gray-400 mt-1">Acompanhe seu progresso ao longo do tempo</p>
          </div>
          
          {workouts.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium"
            >
              Limpar Histórico
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 bg-[#1c1c1e] border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar treinos..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="ml-4">
            <select className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💪</div>
            <h2 className="text-xl font-semibold mb-2">Nenhum treino encontrado</h2>
            <p className="text-gray-400 mb-6">Comece um treino para ver seu histórico aqui</p>
            <Link 
              to="/routines"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white font-medium inline-block"
            >
              Iniciar Treino
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => {
              const stats = getWorkoutStats(workout);
              
              return (
                <div key={workout.id} className="bg-[#1c1c1e] rounded-lg border border-gray-800">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{workout.name}</h3>
                        <p className="text-gray-400 text-sm">{formatDate(workout.savedAt)}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-medium">{workout.duration}</div>
                        <div className="flex space-x-2 mt-2">
                          <button className="text-blue-500 hover:text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button className="text-red-500 hover:text-red-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Exercícios principais */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {stats.mainExercises.map((exercise) => (
                        <span
                          key={index}
                          className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {exercise}
                        </span>
                      ))}
                    </div>
                    
                    {/* Estatísticas */}
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="text-gray-400">Volume</div>
                        <div className="font-semibold">{stats.totalVolume} kg</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Séries</div>
                        <div className="font-semibold">{stats.totalSets}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Exercícios</div>
                        <div className="font-semibold">{workout.exercises.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutHistory;
