package com.hevyclone.app.repository.routine;

import com.hevyclone.app.model.routine.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
    List<WorkoutExercise> findByWorkoutIdOrderByOrderAsc(Long workoutId);
    // Outros métodos de busca personalizados podem ser adicionados aqui
}

