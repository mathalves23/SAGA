package com.hevyclone.app.repository.routine;

import com.hevyclone.app.model.routine.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByRoutineId(Long routineId);
    // Outros métodos de busca personalizados podem ser adicionados aqui
}

