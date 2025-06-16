package com.hevyclone.app.service.routine;

import com.hevyclone.app.model.exercise.Exercise;
import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.model.routine.WorkoutExercise;
import com.hevyclone.app.repository.exercise.ExerciseRepository;
import com.hevyclone.app.repository.routine.WorkoutExerciseRepository;
import com.hevyclone.app.repository.routine.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WorkoutExerciseService {

    @Autowired
    private WorkoutExerciseRepository workoutExerciseRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public List<WorkoutExercise> getWorkoutExercisesByWorkoutId(Long workoutId) {
        return workoutExerciseRepository.findByWorkoutIdOrderByOrderAsc(workoutId);
    }

    @Transactional(readOnly = true)
    public Optional<WorkoutExercise> getWorkoutExerciseById(Long id) {
        return workoutExerciseRepository.findById(id);
    }

    @Transactional
    public WorkoutExercise addExerciseToWorkout(Long workoutId, Long exerciseId, WorkoutExercise workoutExerciseDetails) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado com o id: " + workoutId));
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado com o id: " + exerciseId));

        WorkoutExercise workoutExercise = new WorkoutExercise();
        workoutExercise.setWorkout(workout);
        workoutExercise.setExercise(exercise);
        workoutExercise.setOrder(workoutExerciseDetails.getOrder());
        workoutExercise.setSets(workoutExerciseDetails.getSets());
        workoutExercise.setReps(workoutExerciseDetails.getReps());
        workoutExercise.setRestTime(workoutExerciseDetails.getRestTime());
        workoutExercise.setNotes(workoutExerciseDetails.getNotes());

        return workoutExerciseRepository.save(workoutExercise);
    }

    @Transactional
    public WorkoutExercise updateWorkoutExercise(Long workoutExerciseId, WorkoutExercise workoutExerciseDetails) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new RuntimeException("WorkoutExercise não encontrado com o id: " + workoutExerciseId));

        // Atualizar os campos necessários
        // O exercício associado (exercise_id) e o treino (workout_id) geralmente não são alterados aqui.
        // Se precisar mudar o exercício, seria mais uma remoção e adição.
        workoutExercise.setOrder(workoutExerciseDetails.getOrder());
        workoutExercise.setSets(workoutExerciseDetails.getSets());
        workoutExercise.setReps(workoutExerciseDetails.getReps());
        workoutExercise.setRestTime(workoutExerciseDetails.getRestTime());
        workoutExercise.setNotes(workoutExerciseDetails.getNotes());

        return workoutExerciseRepository.save(workoutExercise);
    }

    @Transactional
    public void removeExerciseFromWorkout(Long workoutExerciseId) {
        WorkoutExercise workoutExercise = workoutExerciseRepository.findById(workoutExerciseId)
                .orElseThrow(() -> new RuntimeException("WorkoutExercise não encontrado com o id: " + workoutExerciseId));
        workoutExerciseRepository.delete(workoutExercise);
    }
}

