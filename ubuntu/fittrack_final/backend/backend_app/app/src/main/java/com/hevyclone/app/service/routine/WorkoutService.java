package com.hevyclone.app.service.routine;

import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.repository.routine.RoutineRepository;
import com.hevyclone.app.repository.routine.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private RoutineRepository routineRepository; // Para associar o workout a uma rotina

    @Transactional(readOnly = true)
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Workout> getWorkoutById(Long id) {
        return workoutRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Workout> getWorkoutsByRoutineId(Long routineId) {
        return workoutRepository.findByRoutineId(routineId);
    }

    @Transactional
    public Workout createWorkout(Long routineId, Workout workout) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("Rotina não encontrada com o id: " + routineId));
        workout.setRoutine(routine);
        // Adicionar validações se necessário antes de salvar
        return workoutRepository.save(workout);
    }

    @Transactional
    public Workout updateWorkout(Long workoutId, Workout workoutDetails) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado com o id: " + workoutId));

        workout.setName(workoutDetails.getName());
        workout.setDayOfWeek(workoutDetails.getDayOfWeek());
        // A rotina associada geralmente não é alterada por aqui, mas sim ao mover um workout entre rotinas (operação mais complexa)
        // workout.setRoutine(workoutDetails.getRoutine()); 
        
        // WorkoutExercises são gerenciados via WorkoutExerciseService e WorkoutExerciseController
        if (workoutDetails.getWorkoutExercises() != null) {
            // Cuidado ao gerenciar o estado dos workoutExercises (novos, removidos, atualizados)
            workout.setWorkoutExercises(workoutDetails.getWorkoutExercises());
        }

        return workoutRepository.save(workout);
    }

    @Transactional
    public void deleteWorkout(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado com o id: " + workoutId));
        workoutRepository.delete(workout);
    }
}

