package com.hevyclone.app.repository.userprogress;

import com.hevyclone.app.model.userprogress.UserWorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserWorkoutLogRepository extends JpaRepository<UserWorkoutLog, Long> {
    List<UserWorkoutLog> findByUserId(Long userId);
    List<UserWorkoutLog> findByUserIdAndWorkoutId(Long userId, Long workoutId);
    List<UserWorkoutLog> findByUserRoutineId(Long userRoutineId);
    // Outros métodos de busca personalizados podem ser adicionados aqui
}

