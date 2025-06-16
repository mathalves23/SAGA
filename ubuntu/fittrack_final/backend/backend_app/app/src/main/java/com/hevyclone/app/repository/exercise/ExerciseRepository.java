package com.hevyclone.app.repository.exercise;

import com.hevyclone.app.model.exercise.Exercise;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações com exercícios
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    /**
     * Busca exercícios por grupo muscular
     * @param muscleGroupId ID do grupo muscular
     * @return Lista de exercícios
     */
    List<Exercise> findByPrimaryMuscleGroupId(Long muscleGroupId);

    /**
     * Busca exercícios por equipamento
     * @param equipmentId ID do equipamento
     * @return Lista de exercícios
     */
    List<Exercise> findByEquipmentId(Long equipmentId);

    /**
     * Busca exercícios por nível de dificuldade
     * @param difficultyLevelId ID do nível de dificuldade
     * @return Lista de exercícios
     */
    List<Exercise> findByDifficultyLevelId(Long difficultyLevelId);

    /**
     * Busca exercício por ID com carregamento eager de relacionamentos
     * @param id ID do exercício
     * @return Exercício encontrado ou vazio
     */
    @EntityGraph(attributePaths = {"primaryMuscleGroup", "equipment", "difficultyLevel"})
    Optional<Exercise> findWithRelationshipsById(Long id);    

    /**
     * Busca exercícios por nome contendo texto
     * @param name Texto a ser buscado no nome
     * @return Lista de exercícios
     */
    @Query("SELECT e FROM Exercise e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Exercise> findByNameContainingIgnoreCase(@Param("name") String name);
}
