import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workoutService } from '../../services/workoutService';
import { exerciseService } from '../../services/exerciseService';
import { routineService } from '../../services/routineService';
import { recordsService, SetRecord, ExerciseRecord } from '../../services/recordsService';
import { toast } from 'react-hot-toast';
import RecordBadge from '../../components/RecordBadge';
import RecordNotification from '../../components/RecordNotification';
import './WorkoutLogging.css';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Clock, Play, Pause, Plus, Trash, Check } from '../../components/ui/Icons';
import { gamificationService } from '../../services/gamificationService';

type Set = {
  id: number;
  weight: number;
  reps: number;
  completed: boolean;
  restTimer: string;
  isPR?: boolean;
  records?: SetRecord[];
  previousWeight?: number;
  previousReps?: number;
};

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
  notes: string;
};

// Dados mock para fallback
const mockWorkoutExercises: Exercise[] = [
  {
    id: 'supino-reto',
    name: 'Supino Reto',
    muscleGroup: 'Peito',
    sets: [
      { id: 1, weight: 20, reps: 12, completed: false, restTimer: '01:30' },
      { id: 2, weight: 20, reps: 10, completed: false, restTimer: '01:30' },
      { id: 3, weight: 20, reps: 8, completed: false, restTimer: '01:30' }
    ],
    notes: ''
  },
  {
    id: 'agachamento',
    name: 'Agachamento',
    muscleGroup: 'Pernas',
    sets: [
      { id: 1, weight: 40, reps: 15, completed: false, restTimer: '02:00' },
      { id: 2, weight: 40, reps: 12, completed: false, restTimer: '02:00' },
      { id: 3, weight: 35, reps: 15, completed: false, restTimer: '02:00' }
    ],
    notes: ''
  },
  {
    id: 'desenvolvimento-ombros',
    name: 'Desenvolvimento de Ombros',
    muscleGroup: 'Ombros',
    sets: [
      { id: 1, weight: 15, reps: 12, completed: false, restTimer: '01:00' },
      { id: 2, weight: 15, reps: 10, completed: false, restTimer: '01:00' },
      { id: 3, weight: 12, reps: 15, completed: false, restTimer: '01:00' }
    ],
    notes: ''
  }
];

function WorkoutLogging() {
  const { id } = useParams<{ id: string }>();
  const [timer, setTimer] = useState('0s');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('Treino');
  const [newRecords, setNewRecords] = useState<ExerciseRecord[]>([]);
  const [checkingRecords, setCheckingRecords] = useState(false);
  const [restTimer, setRestTimer] = useState<number>(0); // Timer de descanso global
  const [isRestActive, setIsRestActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [defaultRestTime, setDefaultRestTime] = useState(60); // seconds
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const navigate = useNavigate();

  // Obter parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const routineId = urlParams.get('routineId');
  const routineName = urlParams.get('routineName');

  // Verificar se há progresso no treino
  const hasWorkoutProgress = () => {
    return exercises.some(ex => 
      ex.sets.some(set => set.completed || set.weight > 0 || set.reps > 0)
    ) || exercises.some(ex => ex.notes.trim() !== '');
  };

  // Sistema mais simples de proteção (useBlocker pode não estar disponível)
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    loadWorkout();
    
    // Iniciar o timer principal
    setStartTime(new Date());
  }, [id]);

  useEffect(() => {
    // Timer principal do treino
    const workoutInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(workoutInterval);
  }, [startTime]);

  useEffect(() => {
    // Timer de descanso
    const restInterval = setInterval(updateRestTimer, 1000);
    return () => clearInterval(restInterval);
  }, [isRestActive, restTimer]);

  // Prevenir saída acidental da página (refresh, fechar aba, etc)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!workoutFinished && hasWorkoutProgress()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [workoutFinished, exercises]);

  const updateTimer = () => {
    if (!startTime) return;
    
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    
    const totalSeconds = Math.floor(diff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      setTimer(`${minutes}min ${seconds}s`);
    } else {
      setTimer(`${seconds}s`);
    }
  };

  // Timer de descanso global - reseta sempre que qualquer série é completada
  const updateRestTimer = () => {
    if (isRestActive && restTimer > 0) {
      setRestTimer(prev => prev - 1);
    } else if (isRestActive && restTimer <= 0) {
      setIsRestActive(false);
    }
  };

  const startRestTimer = () => {
    setRestTimer(defaultRestTime);
    setIsRestActive(true);
  };

  const formatRestTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  const loadWorkout = async () => {
    if (!id) return;
    
    setInitialLoading(true);
    try {
      // Se o ID é 'new', criar treino vazio
      if (id === 'new') {
        setWorkoutName(routineName ? decodeURIComponent(routineName) : 'Treino Livre');
        setExercises(mockWorkoutExercises);
        setInitialLoading(false);
        return;
      }

      // Verificar se temos um routineId nos parâmetros
      if (routineId) {
        // Carregar rotina e encontrar o workout específico
        const routineData = await routineService.getDetails(parseInt(routineId));
        
        if (routineData) {
          setWorkoutName(routineData.name || 'Treino');
          
          // Encontrar o workout específico pelo ID
          const targetWorkout = routineData.workouts?.find((w: any) => w.id.toString() === id);
          
          if (targetWorkout) {
            const formattedExercises = targetWorkout.workoutExercises?.map((workoutEx: any) => ({
              id: workoutEx.exercise?.id || workoutEx.id,
              name: workoutEx.exercise?.name || workoutEx.name || 'Exercício',
              muscleGroup: workoutEx.exercise?.muscleGroup || 'Não especificado',
              sets: Array(parseInt(workoutEx.sets) || 3).fill(0).map((_, idx) => ({
                id: idx + 1,
                weight: 0,
                reps: parseInt(workoutEx.reps) || 10,
                completed: false,
                restTimer: workoutEx.restTime || '01:00'
              })),
              notes: ''
            })) || [];
            
            setExercises(formattedExercises);
            setWorkoutName(`${routineData.name} - ${targetWorkout.name}`);
          } else {
            // Workout não encontrado, usar o primeiro disponível ou mock
            if (routineData.workouts && routineData.workouts.length > 0) {
              const firstWorkout = routineData.workouts[0];
              const formattedExercises = firstWorkout.workoutExercises?.map((workoutEx: any) => ({
                id: workoutEx.exercise?.id || workoutEx.id,
                name: workoutEx.exercise?.name || workoutEx.name || 'Exercício',
                muscleGroup: workoutEx.exercise?.muscleGroup || 'Não especificado',
                sets: Array(parseInt(workoutEx.sets) || 3).fill(0).map((_, idx) => ({
                  id: idx + 1,
                  weight: 0,
                  reps: parseInt(workoutEx.reps) || 10,
                  completed: false,
                  restTimer: workoutEx.restTime || '01:00'
                })),
                notes: ''
              })) || [];
              
              setExercises(formattedExercises);
            } else {
              setExercises(mockWorkoutExercises);
            }
          }
        } else {
          setExercises(mockWorkoutExercises);
        }
      } else {
        // Modo legado: tentar carregar como rotina diretamente
        const routineData = await routineService.getDetails(parseInt(id));
        
        if (routineData) {
          setWorkoutName(routineData.name || 'Treino');
          
          if (routineData.workouts && routineData.workouts.length > 0) {
            const firstWorkout = routineData.workouts[0];
            const formattedExercises = firstWorkout.workoutExercises?.map((workoutEx: any) => {
              // Dados mock de treinos anteriores baseados no nome do exercício
              const exerciseName = workoutEx.exercise?.name || workoutEx.name || 'Exercício';
              const previousData: Record<string, { weight: number; reps: number }[]> = {
                'Supino Reto': [
                  { weight: 75, reps: 15 },
                  { weight: 86, reps: 12 },
                  { weight: 93, reps: 10 },
                  { weight: 100, reps: 8 }
                ],
                'Pec Deck': [
                  { weight: 40, reps: 15 },
                  { weight: 60, reps: 10 }
                ],
                'Supino Inclinado (Halter)': [
                  { weight: 34, reps: 7 },
                  { weight: 34, reps: 8 },
                  { weight: 34, reps: 10 },
                  { weight: 34, reps: 10 }
                ],
                'Triceps Testa (Halter)': [
                  { weight: 16, reps: 10 },
                  { weight: 20, reps: 12 }
                ],
                'Levantamento De Joelhos Nas Barras Paralelas': [
                  { weight: 0, reps: 15 },
                  { weight: 0, reps: 16 },
                  { weight: 0, reps: 17 }
                ]
              };

              const exercisePreviousData = previousData[exerciseName] || [];
              const numberOfSets = parseInt(workoutEx.sets) || 3;
              
              return {
                id: workoutEx.exercise?.id || workoutEx.id,
                name: exerciseName,
                muscleGroup: workoutEx.exercise?.muscleGroup || 'Não especificado',
                sets: Array(numberOfSets).fill(0).map((_, idx) => ({
                  id: idx + 1,
                  weight: 0,
                  reps: parseInt(workoutEx.reps) || 10,
                  completed: false,
                  restTimer: workoutEx.restTime || '01:00',
                  previousWeight: exercisePreviousData[idx]?.weight || undefined,
                  previousReps: exercisePreviousData[idx]?.reps || undefined
                })),
                notes: ''
              };
            }) || [];
            
            setExercises(formattedExercises);
          } else {
            setExercises(mockWorkoutExercises);
          }
        } else {
          setExercises(mockWorkoutExercises);
        }
      }
    } catch (error) {
    console.error('Erro ao carregar treino:', error);
      toast.error('Erro ao carregar treino. Usando dados de exemplo.');
      setExercises(mockWorkoutExercises);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSetCompletion = async (exerciseId: string, setId: number, completed: boolean) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.map(s => s.id === setId ? { ...s, completed } : s) }
          : ex
      )
    );

    // Verificar recordes quando uma série é completada
    if (completed) {
      await checkForRecords(exerciseId);
      // Iniciar/resetar timer de descanso global
      startRestTimer();
    }
  };

  const handleWeightChange = (exerciseId: string, setId: number, weight: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, weight: parseInt(weight) || 0 } : s
              )
            }
          : ex
      )
    );
  };

  const handleRepsChange = (exerciseId: string, setId: number, reps: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, reps: parseInt(reps) || 0 } : s
              )
            }
          : ex
      )
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          const last = ex.sets[ex.sets.length - 1];
          const newSet: Set = {
            id: last ? last.id + 1 : 1,
            weight: last ? last.weight : 0,
            reps: last ? last.reps : 10,
            completed: false,
            restTimer: '01:00'
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    );
  };

  const handleNotesChange = (exerciseId: string, notes: string) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === exerciseId ? { ...ex, notes } : ex))
    );
  };

  // Calcular estatísticas do treino
  const getWorkoutStats = () => {
    const completedSets = exercises.flatMap(ex => 
      ex.sets.filter(set => set.completed)
    );
    
    const totalVolume = completedSets.reduce((total, set) => 
      total + (set.weight * set.reps), 0
    );
    
    return {
      duration: timer,
      volume: `${totalVolume} kg`,
      sets: completedSets.length
    };
  };

  const handleDiscardWorkout = () => {
    if (window.confirm('Tem certeza que deseja descartar este treino? Todos os dados serão perdidos.')) {
      setWorkoutFinished(true); // Permitir navegação
      navigate('/routines');
    }
  };

  const handleBackNavigation = () => {
    if (!workoutFinished && hasWorkoutProgress()) {
      if (window.confirm('Tem certeza que deseja sair? O progresso do treino será perdido.')) {
        setWorkoutFinished(true);
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleAddExercise = () => {
    // TODO: Implementar seleção de exercícios
    toast('Funcionalidade de adicionar exercício em desenvolvimento');
  };

  // Verificar recordes para um exercício específico
  const checkForRecords = useCallback(async (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    setCheckingRecords(true);
    try {
      const completedSets = exercise.sets
        .filter(set => set.completed && set.weight > 0 && set.reps > 0)
        .map(set => ({ weight: set.weight, reps: set.reps }));

      if (completedSets.length === 0) return;

      // Calcular recordes para o exercício
      const setRecords = await recordsService.calculateExerciseRecords(exerciseId, completedSets);
      
      // Atualizar o estado com os recordes
      setExercises(prev =>
        prev.map(ex => {
          if (ex.id === exerciseId) {
            const updatedSets = ex.sets.map((set) => {
              const recordIndex = completedSets.findIndex((_, i) => i === index);
              if (recordIndex !== -1 && setRecords[recordIndex]) {
                return { ...set, records: [setRecords[recordIndex]] };
              }
              return set;
            });
            return { ...ex, sets: updatedSets };
          }
          return ex;
        })
      );

      // Verificar se há novos recordes para mostrar notificação
      const exerciseRecords = await recordsService.checkForNewRecords(
        exerciseId,
        exercise.name,
        completedSets,
        'current-user-id' // TODO: Pegar do contexto de autenticação
      );

      if (exerciseRecords.length > 0) {
        setNewRecords(prev => [...prev, ...exerciseRecords]);
      }
    } catch (error) {
    console.error('Erro ao verificar recordes:', error);
    } finally {
      setCheckingRecords(false);
    }
  }, [exercises]);

  const handleFinishWorkout = async () => {
    // Verificar se há exercícios pendentes (séries não completadas)
    const hasPendingExercises = exercises.some(ex => 
      ex.sets.some(set => !set.completed && (set.weight > 0 || set.reps > 0))
    );
    
    const hasCompletedSets = exercises.some(ex => 
      ex.sets.some(set => set.completed)
    );
    
    // Se há exercícios pendentes, mostrar confirmação
    if (hasPendingExercises) {
      const confirmFinish = window.confirm(
        'Você tem certeza que deseja concluir sua rotina? Ainda possui exercícios pendentes.'
      );
      if (!confirmFinish) {
        return;
      }
    }
    
    setLoading(true);
    try {
      // Preparar dados para envio (incluir todas as séries, mesmo não completadas)
      const workoutData = {
        routineId: id,
        name: workoutName,
        duration: timer,
        date: new Date().toISOString(),
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          notes: ex.notes,
          sets: ex.sets.map(set => ({
            weight: set.weight || 0,
            reps: set.reps || 0,
            completed: set.completed,
            isPR: set.isPR || false
          }))
        }))
      };
      
      console.log('Salvando treino:', workoutData);
      
      // Salvar localmente se houver erro no serviço
      try {
        await workoutService.logWorkout(workoutData);
      } catch (serviceError) {
        console.warn('Erro no serviço, salvando localmente:', serviceError);
        // Salvar no localStorage como fallback
        const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
        savedWorkouts.push({
          ...workoutData,
          id: `workout-${Date.now()}`,
          savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
      }
      
      setWorkoutFinished(true); // Marcar como finalizado para permitir navegação
      toast.success('Treino finalizado com sucesso!');
      navigate('/routines');

      // Sistema de gamificação - adicionar XP e verificar recompensas
      try {
        const { xpGained, newBadges, levelUp } = gamificationService.addWorkoutXP(workoutData);
        
        // Notificação de XP ganho
        toast.success(`Treino salvo! +${xpGained} XP ganhos! 🎉`);
        
        // Notificações de level up
        if (levelUp) {
          const userStats = gamificationService.getUserStats();
          const levelInfo = gamificationService.getLevelInfo(userStats.level);
          toast.success(`🎊 LEVEL UP! Você alcançou ${levelInfo.name} (Nível ${userStats.level})!`, {
            duration: 5000,
            style: {
              background: '#7c3aed',
              color: '#ffffff',
              border: '2px solid #a855f7',
            },
          });
        }
        
        // Notificações de novos badges
        newBadges.forEach((badge, index) => {
          setTimeout(() => {
            toast.success(`🏆 Novo Badge Desbloqueado: ${badge.name}! (+${badge.xpReward} XP)`, {
              duration: 4000,
              style: {
                background: '#059669',
                color: '#ffffff',
                border: '2px solid #10b981',
              },
            });
          }, (index + 1) * 1000); // Delay entre notificações
        });
        
      } catch (gamificationError) {
        console.error('Erro na gamificação:', gamificationError);
        // Falha na gamificação não deve impedir salvar o treino
        toast.success('Treino salvo com sucesso!');
      }

    } catch (error) {
    console.error('Erro ao finalizar treino:', error);
      toast.error('Erro ao finalizar treino. Dados salvos localmente.');
      // Mesmo com erro, permitir sair
      setWorkoutFinished(true);
      navigate('/routines');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="pt-20 pb-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-blue-500 text-xl">Carregando treino...</div>
      </div>
    );
  }

    const stats = getWorkoutStats();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header da aplicação SAGA */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={handleBackNavigation} className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium">Treinamento</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{timer}</span>
          </div>
          
          <button
            onClick={handleFinishWorkout}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Concluindo...' : 'Concluir'}
          </button>
        </div>
      </div>

            {/* Estatísticas do treino - FIXAS */}
      <div className="sticky top-0 bg-[#1c1c1e] px-4 py-3 border-b border-gray-800 z-40">
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-gray-400">Duração</div>
            <div className="text-blue-500 font-semibold">{stats.duration}</div>
          </div>
          <div>
            <div className="text-gray-400">Volume</div>
            <div className="text-white">{stats.volume}</div>
          </div>
          <div>
            <div className="text-gray-400">Séries</div>
            <div className="text-white">{stats.sets}</div>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de exercícios */}
      <div className={`flex-1 overflow-y-auto ${isRestActive ? 'pb-32' : 'pb-6'}`}>
        {exercises.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400 mb-4">Nenhum exercício encontrado.</p>
            <button 
              onClick={() => navigate('/routines')}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
            >
              Voltar para Rotinas
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {exercises.map((exercise, exerciseIndex) => (
              <div key={exercise.id} className="bg-[#1c1c1e] border-b border-gray-800">
                {/* Header do exercício */}
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-blue-500 text-lg font-medium">{exercise.name}</h3>
                    <button className="ml-auto text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) => handleNotesChange(exercise.id, e.target.value)}
                      placeholder="Adicionar notas aqui..."
                      className="w-full bg-transparent text-gray-400 text-sm placeholder-gray-500 border-none outline-none"
                    />
                  </div>

                  {/* Tabela de séries */}
                  <div className="space-y-0">
                    {/* Header da tabela */}
                    <div className="flex items-center justify-between py-2 text-gray-400 text-sm font-medium">
                      <div className="w-12">SÉRIE</div>
                      <div className="w-20">ANTERIOR</div>
                      <div className="w-16">KG</div>
                      <div className="w-16">REPS</div>
                      <div className="w-8">✓</div>
                    </div>

                    {/* Linhas das séries */}
                    {exercise.sets.map((set, setIndex) => {
                      return (
                        <div key={set.id} className="flex items-center justify-between py-3 border-t border-gray-800">
                          <div className="w-12 text-white font-medium flex items-center space-x-2">
                            <span>{set.id}</span>
                            {set.records && set.records.map((record, idx) => (
                              <RecordBadge key={idx} record={record} />
                            ))}
                          </div>
                          
                          <div className="w-20 text-gray-400 text-sm">
                            {set.previousWeight && set.previousReps 
                              ? `${set.previousWeight}kg x ${set.previousReps}`
                              : '-'
                            }
                          </div>
                          
                          <div className="w-16">
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}
                              className="w-full bg-transparent text-white text-center border-none outline-none"
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="w-16">
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)}
                              className="w-full bg-transparent text-white text-center border-none outline-none"
                              placeholder="0"
                            />
                          </div>
                          
                          <div className="w-8">
                            <button
                              onClick={() => handleSetCompletion(exercise.id, set.id, !set.completed)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                set.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-600 text-gray-400'
                              }`}
                              disabled={checkingRecords}
                            >
                              {set.completed && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Botão adicionar série */}
                    <button
                      onClick={() => handleAddSet(exercise.id)}
                      className="w-full py-3 mt-4 bg-gray-800 text-gray-400 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Adicionar Série</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão adicionar exercício */}
        <div className="p-4">
          <button
            onClick={handleAddExercise}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Adicionar Exercício</span>
          </button>
        </div>

        {/* Botões finais */}
        <div className="p-4 flex space-x-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium"
          >
            Definições
          </button>
          <button
            onClick={handleDiscardWorkout}
            className="flex-1 py-3 bg-red-900 text-red-400 rounded-lg font-medium"
          >
            Descartar Treino
          </button>
        </div>
      </div>

      {/* Timer de Descanso Fixo - aparece quando ativo */}
      {isRestActive && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 z-50">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
            {/* Timer menor */}
            <div className="text-center mb-3">
              <div className="text-4xl font-light text-white tracking-wider">
                {Math.floor(restTimer / 60).toString().padStart(2, '0')}:
                {(restTimer % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            {/* Botões de controle */}
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setRestTimer(prev => Math.max(0, prev - 15))}
                className="bg-black bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                -15
              </button>
              
              <button
                onClick={() => setRestTimer(prev => prev + 15)}
                className="bg-black bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                +15
              </button>
              
              <button
                onClick={() => {
                  setIsRestActive(false);
                  setRestTimer(0);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm ml-4"
              >
                Pular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Recordes */}
      {newRecords.length > 0 && (
        <RecordNotification
          records={newRecords}
          onClose={() => setNewRecords([])}
        />
      )}

      {/* Modal de Definições */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1e] rounded-lg p-6 w-80 mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
                Tempo de Descanso Padrão
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={Math.floor(defaultRestTime / 60)}
                  onChange={(e) => setDefaultRestTime(parseInt(e.target.value) * 60)}
                  className="w-16 bg-gray-800 text-white text-center py-2 rounded border border-gray-600"
                  min="0"
                  max="10"
                />
                <span className="text-gray-300">minutos</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-2 bg-gray-800 text-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-2 bg-blue-500 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default WorkoutLogging;
