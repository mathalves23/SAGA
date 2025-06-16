package com.hevyclone.app.repository.userprogress;

import com.hevyclone.app.model.userprogress.UserRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoutineRepository extends JpaRepository<UserRoutine, Long> {
    List<UserRoutine> findByUserId(Long userId);
    Optional<UserRoutine> findByUserIdAndActiveTrue(Long userId);
    List<UserRoutine> findByUserIdAndRoutineId(Long userId, Long routineId);
}

