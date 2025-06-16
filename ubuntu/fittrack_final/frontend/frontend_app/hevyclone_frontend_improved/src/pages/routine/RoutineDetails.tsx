import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { routineService } from "../../services/routineService";
import { Routine } from "../../types/routine";
import toast, { Toaster } from "react-hot-toast";

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
    muscle_group?: string;
    equipment?: string;
    type?: string;
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

function RoutineDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<RoutineWithWorkouts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRoutineDetails = async () => {
      if (!id) {
        setError("ID da rotina não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const routineData = await routineService.getDetails(parseInt(id));
        setRoutine(routineData);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar detalhes da rotina:", err);
        setError("Erro ao carregar detalhes da rotina");
        toast.error("Erro ao carregar detalhes da rotina");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutineDetails();
  }, [id]);

  const handleEditRoutine = () => {
    if (routine?.id) {
      navigate(`/routines/${routine.id}/edit`);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routine?.id) return;

    try {
      setIsDeleting(true);
      await routineService.delete(routine.id);
      
      toast.success(`Rotina "${routine.name}" excluída com sucesso!`);
      navigate('/routines'); // Redirecionar para a listagem
    } catch (err: any) {
      console.error('Erro ao excluir rotina:', err);
      toast.error('Erro ao excluir rotina. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const handleBackToList = () => {
    navigate('/routines');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando detalhes da rotina...</p>
        </div>
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded">
            <p>{error || "Você não escolheu a rotina."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 pt-20">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Rotinas
          </button>
        </div>

        <div className="bg-surface shadow rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {routine.name || "Rotina sem nome"}
                </h1>
                {routine.description && (
                  <p className="mt-2 text-gray-300">{routine.description}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/workout/start/${routine.id}`)}
                  className="inline-flex items-center px-4 py-2 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-400 bg-green-900/20 hover:bg-green-900/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Iniciar Treino
                </button>
                <button
                  onClick={handleEditRoutine}
                  className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-400 bg-blue-900/20 hover:bg-blue-900/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-400 bg-red-900/20 hover:bg-red-900/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-400">Duração</h3>
                <p className="text-blue-300">
                  {routine.durationWeeks ? `${routine.durationWeeks} semanas` : "Não definido"}
                </p>
              </div>
              
              <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                <h3 className="font-semibold text-green-400">Divisão</h3>
                <p className="text-green-300">{routine.division || "Não definido"}</p>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-700 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400">Nível</h3>
                <p className="text-purple-300">
                  {routine.targetProfileLevel || "Não definido"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Exercícios da Rotina</h2>
              
              {/* Suporte tanto para workouts quanto para exercises diretos */}
              {(routine as any).exercises && (routine as any).exercises.length > 0 ? (
                <div className="bg-surface-light rounded-lg p-4 border border-gray-600">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Exercícios da Rotina
                  </h3>
                  
                  <div className="space-y-3">
                    {(routine as any).exercises.map((routineExercise: any, index: number) => (
                      <div key={routineExercise.id || index} className="bg-surface border border-gray-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {routineExercise.exercise?.name || "Exercício sem nome"}
                            </h4>
                            {routineExercise.exercise?.description && (
                              <p className="text-sm text-gray-400 mt-1">
                                {routineExercise.exercise.description}
                              </p>
                            )}
                            {routineExercise.exercise?.primaryMuscleGroupName && (
                              <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700">
                                  {routineExercise.exercise.primaryMuscleGroupName}
                                </span>
                                {routineExercise.exercise?.equipmentName && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/30 text-gray-300 border border-gray-600 ml-2">
                                    {routineExercise.exercise.equipmentName}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-300">
                              <span className="font-medium">Séries:</span> {routineExercise.sets || "N/A"}
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="font-medium">Repetições:</span> {routineExercise.reps || "N/A"}
                            </div>
                            {routineExercise.rest_seconds && (
                              <div className="text-sm text-gray-300">
                                <span className="font-medium">Descanso:</span> {routineExercise.rest_seconds}s
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : routine.workouts && routine.workouts.length > 0 ? (
                routine.workouts.map((workout, workoutIndex) => (
                  <div key={workout.id} className="bg-surface-light rounded-lg border border-gray-600 overflow-hidden">
                    {/* Header do Dia */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 px-6 py-4 border-b border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {String.fromCharCode(65 + workoutIndex)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              {workout.name}
                            </h3>
                            <p className="text-sm text-gray-300">
                              📅 {workout.dayOfWeek}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">
                            {workout.workoutExercises?.length || 0} exercícios
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lista de Exercícios */}
                    <div className="p-6">
                      {workout.workoutExercises && workout.workoutExercises.length > 0 ? (
                        <div className="space-y-4">
                          {workout.workoutExercises.map((exercise) => (
                            <div key={exercise.id || index} className="bg-surface border border-gray-600 rounded-lg p-4 hover:border-primary/50 transition-colors">
                              <div className="flex items-start gap-4">
                                {/* Número do Exercício */}
                                <div className="bg-blue-500/20 border border-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                                  <span className="text-blue-300 font-semibold text-sm">
                                    {index + 1}
                                  </span>
                                </div>
                                
                                {/* Detalhes do Exercício */}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white text-lg">
                                    {exercise.exercise?.name || exercise.name || "Exercício sem nome"}
                                  </h4>
                                  {exercise.exercise?.description && (
                                    <p className="text-sm text-gray-400 mt-1 mb-3">
                                      {exercise.exercise.description}
                                    </p>
                                  )}
                                  
                                  {/* Stats do Exercício */}
                                  <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-2 text-center">
                                      <p className="text-xs text-green-400 font-medium">Séries</p>
                                      <p className="text-lg font-bold text-green-300">{exercise.sets || "N/A"}</p>
                                    </div>
                                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-2 text-center">
                                      <p className="text-xs text-blue-400 font-medium">Repetições</p>
                                      <p className="text-lg font-bold text-blue-300">{exercise.reps || "N/A"}</p>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-2 text-center">
                                      <p className="text-xs text-purple-400 font-medium">Descanso</p>
                                      <p className="text-lg font-bold text-purple-300">{exercise.restTime || "N/A"}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Tags do Exercício */}
                                  <div className="flex flex-wrap gap-2">
                                    {exercise.exercise?.muscle_group && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700/50">
                                        🎯 {exercise.exercise.muscle_group}
                                      </span>
                                    )}
                                    {exercise.exercise?.equipment && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900/30 text-gray-300 border border-gray-600">
                                        🏋️ {exercise.exercise.equipment}
                                      </span>
                                    )}
                                    {exercise.exercise?.type && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900/30 text-slate-300 border border-slate-700/50">
                                        ⚡ {exercise.exercise.type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="bg-surface rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center border border-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <p className="text-gray-400">Nenhum exercício definido para este dia</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-surface-light rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center border border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Nenhum treino definido</h3>
                  <p className="text-gray-400">Esta rotina ainda não possui treinos configurados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg max-w-md w-full mx-4 border border-gray-600">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir a rotina <strong>"{routine?.name}"</strong>? 
              Esta ação não pode ser desfeita e todos os dados da rotina serão perdidos permanentemente.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 btn bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Excluindo...
                  </div>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutineDetails;
