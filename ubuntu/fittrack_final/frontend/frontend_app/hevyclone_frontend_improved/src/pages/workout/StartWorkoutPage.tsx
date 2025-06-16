import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routineService } from '../../services/routineService';
import { toast } from 'react-hot-toast';

type Exercise = {
  id: number;
  name: string;
  sets: string;
  reps: string;
  restTime?: string;
  order?: number;
  exercise?: {
    id: number;
    name: string;
    description?: string;
  };
};

type Workout = {
  id: number;
  name: string;
  dayOfWeek: string;
  workoutExercises: Exercise[];
};

type RoutineWithWorkouts = {
  id: number;
  name: string;
  description?: string;
  durationWeeks?: number;
  division?: string;
  targetProfileLevel?: string;
  workouts?: Workout[];
};

const StartWorkoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<RoutineWithWorkouts | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);

  useEffect(() => {
    loadRoutineDetails();
  }, [id]);

  const loadRoutineDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const routineData = await routineService.getDetails(parseInt(id));
      setRoutine(routineData);
      
      // Se há apenas um treino, selecionar automaticamente
      if (routineData.workouts && routineData.workouts.length === 1) {
        setSelectedWorkout(routineData.workouts[0]);
      }
    } catch (error) {
    console.error('Erro ao carregar rotina:', error);
      toast.error('Erro ao carregar detalhes da rotina');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = (workout?: Workout) => {
    const workoutToStart = workout || selectedWorkout;
    if (!workoutToStart) {
      toast.error('Selecione um treino para começar');
      return;
    }

    // Navegar para a página de logging com o ID do workout
    navigate(`/workout/logging/${workoutToStart.id}?routineId=${id}`);
  };

  const handleQuickStart = () => {
    if (!routine) return;
    
    // Início rápido - usar o primeiro treino disponível ou criar um treino vazio
    if (routine.workouts && routine.workouts.length > 0) {
      handleStartWorkout(routine.workouts[0]);
    } else {
      // Criar um treino vazio para adicionar exercícios on-the-fly
      navigate(`/workout/logging/new?routineId=${id}&routineName=${encodeURIComponent(routine.name)}`);
    }
  };

  const getDayName = (dayOfWeek: string) => {
    const days: Record<string, string> = {
      'MONDAY': 'Segunda-feira',
      'TUESDAY': 'Terça-feira', 
      'WEDNESDAY': 'Quarta-feira',
      'THURSDAY': 'Quinta-feira',
      'FRIDAY': 'Sexta-feira',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return days[dayOfWeek] || dayOfWeek;
  };

  const formatExerciseCount = (exercises: Exercise[]) => {
    return `${exercises.length} exercício${exercises.length !== 1 ? 's' : ''}`;
  };

  const getTotalSets = (exercises: Exercise[]) => {
    return exercises.reduce((total, ex) => total + parseInt(ex.sets || '0'), 0);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">Carregando rotina...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="pt-20 pb-6">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Rotina não encontrada</h2>
          <p className="text-gray-400 mb-6">A rotina selecionada não pôde ser carregada.</p>
          <Link to="/routines" className="btn btn-primary">
            Voltar para Rotinas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/routines" className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white">Iniciar Treino</h1>
        </div>
        
        <div className="bg-surface-light rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">{routine.name}</h2>
          {routine.description && (
            <p className="text-gray-400 mb-3">{routine.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {routine.division && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {routine.division}
              </span>
            )}
            {routine.targetProfileLevel && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {routine.targetProfileLevel}
              </span>
            )}
            {routine.workouts && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {routine.workouts.length} treino{routine.workouts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botão de Início Rápido */}
      <div className="mb-8">
        <button
          onClick={handleQuickStart}
          className="w-full btn btn-primary py-4 text-lg font-semibold"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Início Rápido
        </button>
        <p className="text-center text-gray-400 text-sm mt-2">
          Começar com o primeiro treino disponível
        </p>
      </div>

      {/* Seleção de Treinos */}
      {routine.workouts && routine.workouts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Selecionar Treino Específico
          </h3>
          
          <div className="space-y-4">
            {routine.workouts.map((workout) => (
              <div
                key={workout.id}
                className={`card p-4 cursor-pointer transition-all duration-200 hover:border-primary ${
                  selectedWorkout?.id === workout.id ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-white text-lg mr-3">
                        {workout.name}
                      </h4>
                      <span className="text-sm text-gray-400 bg-surface-light px-2 py-1 rounded">
                        {getDayName(workout.dayOfWeek)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <span>{formatExerciseCount(workout.workoutExercises || [])}</span>
                      <span>•</span>
                      <span>{getTotalSets(workout.workoutExercises || [])} séries</span>
                    </div>

                    {/* Preview dos exercícios */}
                    {workout.workoutExercises && workout.workoutExercises.length > 0 && (
                      <div className="space-y-1">
                        {workout.workoutExercises.slice(0, 3).map((ex) => (
                          <div key={ex.id} className="text-sm text-gray-300">
                            {ex.exercise?.name || ex.name} - {ex.sets} séries × {ex.reps} reps
                          </div>
                        ))}
                        {workout.workoutExercises.length > 3 && (
                          <div className="text-sm text-gray-400">
                            +{workout.workoutExercises.length - 3} mais exercícios
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartWorkout(workout);
                      }}
                      className="btn btn-primary py-2 px-4"
                    >
                      Iniciar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedWorkout && (
            <div className="mt-6">
              <button
                onClick={() => handleStartWorkout()}
                className="w-full btn btn-primary py-3 text-lg"
              >
                Iniciar {selectedWorkout.name}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Estado vazio */}
      {(!routine.workouts || routine.workouts.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Nenhum treino definido</h3>
          <p className="text-gray-400 mb-6">
            Esta rotina não possui treinos específicos. Use o Início Rápido para começar um treino livre.
          </p>
        </div>
      )}
    </div>
  );
};

export default StartWorkoutPage; 