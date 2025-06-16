import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { routineService } from '../../services/routineService';
import { toast } from 'react-hot-toast';

type RoutineItem = {
  id: number;
  name: string;
  description: string;
  workouts?: any[];
  targetProfileLevel?: string;
  durationWeeks?: number;
  division?: string;
  lastUsed?: string;
};

const RoutinesList: React.FC = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [routineToDelete, setRoutineToDelete] = useState<RoutineItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const data = await routineService.getAll();
      console.log('Rotinas carregadas da API:', data);
      
      // Mapear os dados da API para o formato esperado
      const mappedRoutines = data.map(routine => ({
        id: routine.id,
        name: routine.name || routine.title || 'Rotina sem nome',
        description: routine.description || 'Sem descrição',
        workouts: routine.workouts || [],
        targetProfileLevel: routine.targetProfileLevel,
        durationWeeks: routine.durationWeeks,
        division: routine.division,
        lastUsed: new Date().toLocaleDateString('pt-BR') // Por enquanto, usar data atual
      }));
      
      setRoutines(mappedRoutines);
    } catch (err: any) {
      console.error('Erro ao buscar rotinas:', err);
      setError('Erro ao carregar rotinas');
      toast.error('Erro ao carregar suas rotinas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleEditRoutine = (routineId: number) => {
    navigate(`/routines/${routineId}/edit`);
  };

  const handleDeleteClick = (routine: RoutineItem) => {
    setRoutineToDelete(routine);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routineToDelete) return;

    try {
      setIsDeleting(true);
      await routineService.delete(routineToDelete.id);
      
      // Atualizar a lista local removendo a rotina deletada
      setRoutines(prevRoutines => 
        prevRoutines.filter(routine => routine.id !== routineToDelete.id)
      );
      
      toast.success(`Rotina "${routineToDelete.name}" excluída com sucesso!`);
      setDeleteModalOpen(false);
      setRoutineToDelete(null);
    } catch (err: any) {
      console.error('Erro ao excluir rotina:', err);
      toast.error('Erro ao excluir rotina. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRoutineToDelete(null);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-6">
        <div className="text-center text-gray-400 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Carregando suas rotinas...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Minhas Rotinas</h1>
          <p className="text-secondary">Gerencie suas rotinas de treino</p>
        </div>
        <Link to="/routines/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Rotina
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar rotinas..."
              className="w-full search-input pl-10 pr-4 py-2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 search-icon absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {routines.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-surface-light rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-primary mb-2">Nenhuma rotina encontrada</h3>
            <p className="text-secondary mb-6">Você ainda não criou nenhuma rotina. Comece criando sua primeira rotina!</p>
            <Link to="/routines/create" className="btn btn-primary">
              Criar Primeira Rotina
            </Link>
          </div>
        ) : (
          routines.map(routine => (
            <div key={routine.id} className="workout-card">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-primary text-lg">{routine.name}</h3>
                    <p className="text-sm text-secondary mt-1">{routine.description}</p>
                    <div className="flex items-center mt-3 text-sm text-secondary">
                      <div className="flex items-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {routine.workouts?.length || 0} treinos
                      </div>
                      {routine.targetProfileLevel && (
                        <div className="flex items-center mr-4">
                          <span className="text-accent-primary">{routine.targetProfileLevel}</span>
                        </div>
                      )}
                      {routine.durationWeeks && (
                        <div className="flex items-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {routine.durationWeeks} semanas
                        </div>
                      )}
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Criada: {routine.lastUsed}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/routines/${routine.id}`} className="btn btn-outline py-1 px-3 text-xs">
                      Ver
                    </Link>
                    <button 
                      onClick={() => handleEditRoutine(routine.id)}
                      className="btn btn-outline py-1 px-3 text-xs hover:bg-blue-500/20 hover:border-blue-500 hover:text-blue-400"
                      title="Editar rotina"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(routine)}
                      className="btn btn-outline py-1 px-3 text-xs hover:bg-red-500/20 hover:border-red-500 hover:text-red-400"
                      title="Excluir rotina"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <Link to={`/workout/start/${routine.id}`} className="btn btn-primary py-1 px-3 text-xs">
                      Iniciar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir a rotina <strong>"{routineToDelete?.name}"</strong>? 
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Rotinas Sugeridas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/discover" className="card p-4 hover:border-primary transition-colors">
            <div className="flex items-center">
              <div className="bg-primary/20 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Descobrir Rotinas</h3>
                <p className="text-sm text-gray-400">Explore rotinas populares da comunidade</p>
              </div>
            </div>
          </Link>
          <Link to="/routines/create" className="card p-4 hover:border-primary transition-colors">
            <div className="flex items-center">
              <div className="bg-primary/20 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Criar Personalizada</h3>
                <p className="text-sm text-gray-400">Monte sua rotina do zero</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoutinesList;
