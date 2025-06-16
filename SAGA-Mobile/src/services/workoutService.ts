import { Workout, WorkoutSession } from '../types';

const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'Complete full body workout targeting all major muscle groups',
    exercises: [
      {
        exerciseId: '1',
        exercise: {
          id: '1',
          name: 'Squat',
          description: 'Fundamental leg exercise',
          category: 'Pernas',
          muscleGroups: ['Quadríceps', 'Glúteos'],
          difficulty: 2,
          instructions: ['Stand with feet hip-width apart', 'Lower down as if sitting'],
          equipment: []
        },
        sets: 3,
        reps: 12,
        restTime: 60
      }
    ],
    duration: 45,
    difficulty: 2,
    category: 'Strength',
    createdAt: new Date(),
    userId: '1'
  }
];

class WorkoutService {
  private workouts: Workout[] = SAMPLE_WORKOUTS;

  async getWorkouts(): Promise<Workout[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.workouts;
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.workouts.find(workout => workout.id === id) || null;
  }

  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout | null> {
    const index = this.workouts.findIndex(w => w.id === id);
    if (index === -1) return null;

    this.workouts[index] = { ...this.workouts[index], ...updates };
    return this.workouts[index];
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const index = this.workouts.findIndex(w => w.id === id);
    if (index === -1) return false;

    this.workouts.splice(index, 1);
    return true;
  }

  async searchWorkouts(query: string): Promise<Workout[]> {
    const searchTerm = query.toLowerCase();
    return this.workouts.filter(workout =>
      workout.name.toLowerCase().includes(searchTerm) ||
      workout.description.toLowerCase().includes(searchTerm) ||
      workout.category.toLowerCase().includes(searchTerm)
    );
  }
}

export const workoutService = new WorkoutService(); 