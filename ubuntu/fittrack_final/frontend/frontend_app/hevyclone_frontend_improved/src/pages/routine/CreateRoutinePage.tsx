import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { routineService } from '../../services/routineService';
import { exerciseService } from '../../services/exerciseService';
import { toast } from 'react-hot-toast';
import type { Routine } from "../../types/routine";
import { exerciseTranslations, muscleTranslations } from '../../utils/translations';

type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  level: string;
  sets: number;
  reps: number;
  restTime: string;
};

type RoutineForm = {
  name: string;
  exercises: Exercise[];
};

function CreateRoutinePage() {
  const [form, setForm] = useState<RoutineForm>({
    name: '',
    exercises: []
  });
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  const translateExercise = (name: string) => exerciseTranslations[name] || name;
  const translateMuscle = (name: string) => muscleTranslations[name?.toLowerCase()] || name || 'N/A';

  const navigate = useNavigate();

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await exerciseService.getAll();
        setAvailableExercises(
          data.map((ex: any) => ({
            id: ex.id.toString(),
            name: translateExercise(ex.name),
            muscleGroup: translateMuscle(ex.primaryMuscleGroupName),
            level: ex.difficultyLevelName || 'Iniciante',
            sets: 3,
            reps: 10,
            restTime: '60'
          }))
        );
      } catch (err: any) {
        console.error('Erro ao carregar exercícios:', err);
        toast.error('Não foi possível carregar a lista de exercícios');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, name: e.target.value }));
  };

  const isExerciseSelected = (exerciseId: string): boolean => {
    return form.exercises.some(ex => ex.id === exerciseId);
  };

  const handleExerciseSelection = (exercise: Exercise) => {
    setForm(prev => {
      const isSelected = prev.exercises.some(ex => ex.id === exercise.id);
      
      if (isSelected) {
        // Remove exercise
        return {
          ...prev,
          exercises: prev.exercises.filter(ex => ex.id !== exercise.id)
        };
      } else {
        // Add exercise
        return {
          ...prev,
          exercises: [...prev.exercises, { ...exercise }]
        };
      }
    });
  };

  const handleExerciseUpdate = (exerciseId: string, field: 'sets' | 'reps' | 'restTime', value: string | number) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, [field]: value }
          : ex
      )
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Nome da rotina é obrigatório');
      return;
    }

    if (form.exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício à rotina');
      return;
    }

    setLoading(true);

    try {
      // Create a simple routine without complex splitting
      const routinePayload = {
        name: form.name,
        description: `Rotina personalizada criada pelo usuário`,
        targetProfileLevel: 'INTERMEDIARIO',
        durationWeeks: 8,
        division: 'CUSTOM', // Simple default value
        workouts: [{
          name: form.name,
          dayOfWeek: null,
          exercises: form.exercises.map((ex) => ({
            exerciseId: parseInt(ex.id, 10),
            order: index + 1,
            sets: ex.sets.toString(),
            reps: ex.reps.toString(),
            restTime: `${ex.restTime}s`
          }))
        }]
      };

      console.log("Creating routine:", routinePayload);
      
      const createdRoutine = await routineService.createComplete(routinePayload as any);
      
      toast.success('Rotina criada com sucesso!');
      navigate('/routines');
    } catch (err: any) {
      console.error('Erro ao criar rotina:', err);
      toast.error('Erro ao criar rotina. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filter exercises
  const filteredExercises = availableExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleFilter ? ex.muscleGroup === muscleFilter : true;
    return matchesSearch && matchesMuscle;
  });

  // Get unique muscle groups for filter
  const muscleGroups = Array.from(new Set(availableExercises.map(ex => ex.muscleGroup))).sort();

  return (
    <div className="pt-16 pb-10 min-h-screen bg-background">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center">
          <Link to="/routines" className="mr-4 p-2 hover:bg-surface-light rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white">Criar Rotina</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !form.name.trim() || form.exercises.length === 0}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando Rotina...' : 'Salvar Rotina'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Main Content - Routine Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Routine Title */}
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Nome da Rotina</h3>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="Nome da Sua Rotina de Treino"
              className="w-full bg-background border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Selected Exercises */}
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            {form.exercises.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Nenhum Exercício</h3>
                <p className="text-gray-400">Você ainda não adicionou nenhum exercício a esta rotina.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-surface-light rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{exercise.name}</h4>
                          <p className="text-sm text-gray-400">{exercise.muscleGroup}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Note section */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Observação</label>
                      <textarea
                        placeholder="Adicionar anotação"
                        className="w-full bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20"
                      />
                    </div>

                    {/* Rest Timer */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tempo de Descanso:</label>
                      <select
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseUpdate(exercise.id, 'restTime', e.target.value)}
                        className="bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="30">00:30</option>
                        <option value="60">01:00</option>
                        <option value="90">01:30</option>
                        <option value="120">02:00</option>
                        <option value="180">03:00</option>
                      </select>
                    </div>

                    {/* Sets and Reps */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">SÉRIES</div>
                      <div className="text-sm text-gray-400">REPETIÇÕES</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseUpdate(exercise.id, 'sets', parseInt(e.target.value) || 1)}
                        className="w-16 bg-surface border border-gray-600 rounded-lg px-2 py-1 text-white text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseUpdate(exercise.id, 'reps', parseInt(e.target.value) || 1)}
                        className="w-16 bg-surface border border-gray-600 rounded-lg px-2 py-1 text-white text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">
                      + Adicionar série
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Exercise Library */}
        <div className="bg-surface rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Biblioteca</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              + Exercício Personalizado
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-3 mb-4">
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" className="bg-background text-white">Todos os Equipamentos</option>
              <option value="Barbell" className="bg-background text-white">Barra</option>
              <option value="Dumbbell" className="bg-background text-white">Halter</option>
              <option value="Machine" className="bg-background text-white">Máquina</option>
              <option value="Bodyweight" className="bg-background text-white">Peso Corporal</option>
            </select>

            <select
              value={muscleFilter}
              onChange={(e) => setMuscleFilter(e.target.value)}
              className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="" className="bg-background text-white">Todos os Músculos</option>
              {muscleGroups.map(group => (
                <option key={group} value={group} className="bg-background text-white">{group}</option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Buscar Exercícios"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 pl-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Todos os Exercícios</h4>
            <div className="max-h-96 overflow-y-auto space-y-1">
              {filteredExercises.map(exercise => {
                const isSelected = isExerciseSelected(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    onClick={() => handleExerciseSelection(exercise)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/20 border border-primary' : 'hover:bg-surface-light'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{exercise.name}</p>
                        <p className="text-sm text-gray-400">{exercise.muscleGroup}</p>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300">
                      {isSelected ? '−' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoutinePage;

