package com.hevyclone.app.repository.exercise;

import com.hevyclone.app.model.exercise.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExerciseTypeRepository extends JpaRepository<ExerciseType, Long> {
    Optional<ExerciseType> findByNameIgnoreCase(String name);
}
