import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Interfaces para tipos de dados
interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: WorkoutSet[];
}

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutData {
  name: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
}

interface ExerciseData {
  name: FormDataEntryValue | null;
  muscle: FormDataEntryValue | null;
}

interface SetData {
  reps: number;
  weight: number;
}

// Mock de um componente de treino integrado
const MockWorkoutApp = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const createWorkout = async (workoutData: WorkoutData) => {
    setLoading(true);
    setError('');
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name: workoutData.name as string,
        description: workoutData.description as string,
        exercises: []
      };
      
      setWorkouts(prev => [...prev, newWorkout]);
      setSelectedWorkout(newWorkout);
    } catch {
      setError('Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  const addExercise = async (workoutId: string, exerciseData: ExerciseData) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: exerciseData.name as string,
        muscle: exerciseData.muscle as string,
        sets: []
      };

      setWorkouts(prev => prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, exercises: [...workout.exercises, newExercise] }
          : workout
      ));

      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout(prev => prev ? ({ 
          ...prev, 
          exercises: [...prev.exercises, newExercise] 
        }) : null);
      }
    } catch {
      setError('Erro ao adicionar exercício');
    } finally {
      setLoading(false);
    }
  };

  const addSet = async (workoutId: string, exerciseId: string, setData: SetData) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const newSet: WorkoutSet = {
        id: Date.now().toString(),
        ...setData,
        completed: false
      };

      setWorkouts(prev => prev.map(workout => 
        workout.id === workoutId 
          ? {
              ...workout,
              exercises: workout.exercises.map((exercise: Exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, sets: [...exercise.sets, newSet] }
                  : exercise
              )
            }
          : workout
      ));

      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout(prev => prev ? ({
          ...prev,
          exercises: prev.exercises.map((exercise: Exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, sets: [...exercise.sets, newSet] }
              : exercise
          )
        }) : null);
      }
    } catch {
      setError('Erro ao adicionar série');
    } finally {
      setLoading(false);
    }
  };

  if (selectedWorkout) {
    return (
      <div>
        <h1>Treino: {selectedWorkout.name}</h1>
        <button onClick={() => setSelectedWorkout(null)}>Voltar</button>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Carregando...</p>}

        <div>
          <h2>Exercícios</h2>
          {selectedWorkout.exercises.map((exercise: Exercise) => (
            <div key={exercise.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{exercise.name}</h3>
              <p>Músculos: {exercise.muscle}</p>
              
              <div>
                <h4>Séries</h4>
                {exercise.sets.map((set: WorkoutSet) => (
                  <div key={set.id}>
                    {set.reps} reps x {set.weight}kg
                  </div>
                ))}
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  addSet(selectedWorkout.id, exercise.id, {
                    reps: parseInt(formData.get('reps') as string),
                    weight: parseFloat(formData.get('weight') as string)
                  });
                  (e.target as HTMLFormElement).reset();
                }}>
                  <input name="reps" type="number" placeholder="Repetições" required />
                  <input name="weight" type="number" step="0.5" placeholder="Peso (kg)" required />
                  <button type="submit">Adicionar Série</button>
                </form>
              </div>
            </div>
          ))}
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            addExercise(selectedWorkout.id, {
              name: formData.get('exerciseName'),
              muscle: formData.get('muscle')
            });
            (e.target as HTMLFormElement).reset();
          }}>
            <h3>Adicionar Exercício</h3>
            <input name="exerciseName" placeholder="Nome do exercício" required />
            <input name="muscle" placeholder="Músculo principal" required />
            <button type="submit">Adicionar Exercício</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Meus Treinos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <div>
        <h2>Lista de Treinos</h2>
        {workouts.length === 0 ? (
          <p>Nenhum treino encontrado</p>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{workout.name}</h3>
              <p>{workout.description}</p>
              <p>Exercícios: {workout.exercises.length}</p>
              <button onClick={() => setSelectedWorkout(workout)}>
                Ver Detalhes
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        createWorkout({
          name: formData.get('workoutName'),
          description: formData.get('description')
        });
        (e.target as HTMLFormElement).reset();
      }}>
        <h2>Criar Novo Treino</h2>
        <input name="workoutName" placeholder="Nome do treino" required />
        <textarea name="description" placeholder="Descrição" required />
        <button type="submit">Criar Treino</button>
      </form>
    </div>
  );
};

describe('Fluxo de Treinos - Integração', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve criar treino completo com exercícios e séries', async () => {
    render(<MockWorkoutApp />);

    // Verificar estado inicial
    expect(screen.getByText('Meus Treinos')).toBeInTheDocument();
    expect(screen.getByText('Nenhum treino encontrado')).toBeInTheDocument();

    // Criar novo treino
    const workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    const descriptionInput = screen.getByPlaceholderText('Descrição');
    const createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino de Peito' } });
    fireEvent.change(descriptionInput, { target: { value: 'Focado em peitorais' } });
    fireEvent.click(createButton);

    // Aguardar criação e verificar navegação
    await waitFor(() => {
      expect(screen.getByText('Treino: Treino de Peito')).toBeInTheDocument();
    });

    // Adicionar exercício
    const exerciseNameInput = screen.getByPlaceholderText('Nome do exercício');
    const muscleInput = screen.getByPlaceholderText('Músculo principal');
    const addExerciseButton = screen.getByRole('button', { name: /adicionar exercício/i });

    fireEvent.change(exerciseNameInput, { target: { value: 'Supino Reto' } });
    fireEvent.change(muscleInput, { target: { value: 'Peitoral' } });
    fireEvent.click(addExerciseButton);

    // Verificar exercício adicionado
    await waitFor(() => {
      expect(screen.getByText('Supino Reto')).toBeInTheDocument();
      expect(screen.getByText('Músculos: Peitoral')).toBeInTheDocument();
    });

    // Adicionar primeira série
    const repsInputs = screen.getAllByPlaceholderText('Repetições');
    const weightInputs = screen.getAllByPlaceholderText('Peso (kg)');
    const addSetButtons = screen.getAllByRole('button', { name: /adicionar série/i });

    fireEvent.change(repsInputs[0], { target: { value: '10' } });
    fireEvent.change(weightInputs[0], { target: { value: '80' } });
    fireEvent.click(addSetButtons[0]);

    // Verificar série adicionada
    await waitFor(() => {
      expect(screen.getByText('10 reps x 80kg')).toBeInTheDocument();
    });
  });

  it('deve navegar entre lista e detalhes do treino', async () => {
    render(<MockWorkoutApp />);

    // Criar treino
    const workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    const descriptionInput = screen.getByPlaceholderText('Descrição');
    const createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino Teste' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descrição teste' } });
    fireEvent.click(createButton);

    // Verificar navegação para detalhes
    await waitFor(() => {
      expect(screen.getByText('Treino: Treino Teste')).toBeInTheDocument();
    });

    // Voltar para lista
    const backButton = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backButton);

    // Verificar volta para lista
    await waitFor(() => {
      expect(screen.getByText('Meus Treinos')).toBeInTheDocument();
      expect(screen.getByText('Treino Teste')).toBeInTheDocument();
      expect(screen.getByText('Descrição teste')).toBeInTheDocument();
      expect(screen.getByText('Exercícios: 0')).toBeInTheDocument();
    });
  });

  it('deve manter consistência de dados durante operações múltiplas', async () => {
    render(<MockWorkoutApp />);

    // Criar primeiro treino
    let workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    let descriptionInput = screen.getByPlaceholderText('Descrição');
    let createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino A' } });
    fireEvent.change(descriptionInput, { target: { value: 'Primeira sessão' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Treino: Treino A')).toBeInTheDocument();
    });

    // Voltar e criar segundo treino
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));

    await waitFor(() => {
      expect(screen.getByText('Meus Treinos')).toBeInTheDocument();
    });

    workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    descriptionInput = screen.getByPlaceholderText('Descrição');
    createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino B' } });
    fireEvent.change(descriptionInput, { target: { value: 'Segunda sessão' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Treino: Treino B')).toBeInTheDocument();
    });

    // Voltar e verificar ambos os treinos
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }));

    await waitFor(() => {
      expect(screen.getByText('Treino A')).toBeInTheDocument();
      expect(screen.getByText('Treino B')).toBeInTheDocument();
      expect(screen.getByText('Primeira sessão')).toBeInTheDocument();
      expect(screen.getByText('Segunda sessão')).toBeInTheDocument();
    });
  });

  it('deve lidar com múltiplos exercícios no mesmo treino', async () => {
    render(<MockWorkoutApp />);

    // Criar treino
    const workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    const descriptionInput = screen.getByPlaceholderText('Descrição');
    const createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino Completo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Vários exercícios' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Treino: Treino Completo')).toBeInTheDocument();
    });

    // Adicionar primeiro exercício
    let exerciseNameInput = screen.getByPlaceholderText('Nome do exercício');
    let muscleInput = screen.getByPlaceholderText('Músculo principal');
    let addExerciseButton = screen.getByRole('button', { name: /adicionar exercício/i });

    fireEvent.change(exerciseNameInput, { target: { value: 'Supino' } });
    fireEvent.change(muscleInput, { target: { value: 'Peito' } });
    fireEvent.click(addExerciseButton);

    await waitFor(() => {
      expect(screen.getByText('Supino')).toBeInTheDocument();
    });

    // Adicionar segundo exercício
    exerciseNameInput = screen.getByPlaceholderText('Nome do exercício');
    muscleInput = screen.getByPlaceholderText('Músculo principal');
    addExerciseButton = screen.getByRole('button', { name: /adicionar exercício/i });

    fireEvent.change(exerciseNameInput, { target: { value: 'Agachamento' } });
    fireEvent.change(muscleInput, { target: { value: 'Pernas' } });
    fireEvent.click(addExerciseButton);

    await waitFor(() => {
      expect(screen.getByText('Supino')).toBeInTheDocument();
      expect(screen.getByText('Agachamento')).toBeInTheDocument();
      expect(screen.getByText('Músculos: Peito')).toBeInTheDocument();
      expect(screen.getByText('Músculos: Pernas')).toBeInTheDocument();
    });
  });

  it('deve exibir estados de loading durante operações', async () => {
    render(<MockWorkoutApp />);

    const workoutNameInput = screen.getByPlaceholderText('Nome do treino');
    const descriptionInput = screen.getByPlaceholderText('Descrição');
    const createButton = screen.getByRole('button', { name: /criar treino/i });

    fireEvent.change(workoutNameInput, { target: { value: 'Treino Loading' } });
    fireEvent.change(descriptionInput, { target: { value: 'Teste de loading' } });
    fireEvent.click(createButton);

    // Verificar estado de loading
    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    // Aguardar conclusão
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      expect(screen.getByText('Treino: Treino Loading')).toBeInTheDocument();
    });
  });
}); 