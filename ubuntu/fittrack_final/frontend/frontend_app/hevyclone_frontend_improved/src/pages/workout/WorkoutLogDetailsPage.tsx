import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { workoutService } from '../../services/workoutService';

type WorkoutLog = {
  id: string;
  routineName?: string;
  date: string;
  exercises: {
    name: string;
    sets: {
      weight: number;
      reps: number;
    }[];
  }[];
};

function WorkoutLogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<WorkoutLog | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const data = await workoutService.getWorkoutById(id!);
        setLog(data);
      } catch {
        setError('Erro ao carregar detalhes do treino.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLog();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!log) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{log.routineName || 'Treino Personalizado'}</h2>
      <p className="text-gray-400 mb-4">{new Date(log.date).toLocaleDateString()}</p>

      <div className="space-y-4">
        {log.exercises.map((exercise, idx) => (
          <div key={idx} className="bg-[#1C1C1E] p-4 rounded">
            <h3 className="font-semibold mb-2 text-white">{exercise.name}</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              {exercise.sets.map((set, i) => (
                <li key={i}>
                  Série {i + 1}: {set.reps} reps x {set.weight} kg
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutLogDetailsPage;
