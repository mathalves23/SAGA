package com.hevyclone.app.repository.routine;

import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.model.routine.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    // Métodos de busca personalizados podem ser adicionados aqui, se necessário
    // Ex: List<Routine> findByTargetProfileLevel(UserProfileLevel level);
    // Ex: List<Routine> findByNameContainingIgnoreCase(String name);
    
    // Método para buscar rotina com workouts
    @Query("SELECT DISTINCT r FROM Routine r " +
           "LEFT JOIN FETCH r.workouts " +
           "WHERE r.id = :id")
    Optional<Routine> findByIdWithWorkouts(@Param("id") Long id);
    
    // Método para carregar workout exercises para uma rotina específica
    @Query("SELECT DISTINCT w FROM Workout w " +
           "LEFT JOIN FETCH w.workoutExercises we " +
           "WHERE w.routine.id = :routineId")
    List<Workout> findWorkoutsWithExercisesByRoutineId(@Param("routineId") Long routineId);
    
    // Método para carregar exercícios com todos os detalhes
    @Query("SELECT DISTINCT we FROM WorkoutExercise we " +
           "LEFT JOIN FETCH we.exercise e " +
           "LEFT JOIN FETCH e.primaryMuscleGroup " +
           "LEFT JOIN FETCH e.equipment " +
           "LEFT JOIN FETCH e.difficultyLevel " +
           "WHERE we.workout.routine.id = :routineId")
    List<WorkoutExercise> findWorkoutExercisesWithDetailsByRoutineId(@Param("routineId") Long routineId);
}

