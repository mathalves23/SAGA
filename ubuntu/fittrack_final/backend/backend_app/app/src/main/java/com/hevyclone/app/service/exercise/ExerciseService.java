package com.hevyclone.app.service.exercise;

import com.hevyclone.app.dto.exercise.ExerciseRequestDTO;
import com.hevyclone.app.dto.exercise.ExerciseResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Interface para o serviço de exercícios
 */
public interface ExerciseService {
    /**
     * Retorna todos os exercícios
     * @return Lista de exercícios
     */
    List<ExerciseResponseDTO> getAllExercises();
    
    /**
     * Retorna exercícios de forma paginada
     * @param pageable Informações de paginação
     * @return Página de exercícios
     */
    Page<ExerciseResponseDTO> getExercisesPaginated(Pageable pageable);
    
    /**
     * Busca um exercício pelo ID
     * @param id ID do exercício
     * @return Exercício encontrado ou vazio
     */
    Optional<ExerciseResponseDTO> getExerciseById(Long id);
    
    /**
     * Cria um novo exercício
     * @param exerciseDTO Dados do exercício
     * @return Exercício criado
     */
    ExerciseResponseDTO createExercise(ExerciseRequestDTO exerciseDTO);
    
    /**
     * Atualiza um exercício existente
     * @param id ID do exercício
     * @param exerciseDTO Novos dados do exercício
     * @return Exercício atualizado
     */
    ExerciseResponseDTO updateExercise(Long id, ExerciseRequestDTO exerciseDTO);
    
    /**
     * Remove um exercício
     * @param id ID do exercício
     */
    void deleteExercise(Long id);
    
    /**
     * Busca exercícios por grupo muscular
     * @param muscleGroupId ID do grupo muscular
     * @return Lista de exercícios
     */
    List<ExerciseResponseDTO> findByMuscleGroup(Long muscleGroupId);
    
    /**
     * Busca exercícios por nível de dificuldade
     * @param difficultyLevelId ID do nível de dificuldade
     * @return Lista de exercícios
     */
    List<ExerciseResponseDTO> findByDifficultyLevel(Long difficultyLevelId);
    
    /**
     * Busca exercícios por equipamento
     * @param equipmentId ID do equipamento
     * @return Lista de exercícios
     */
    List<ExerciseResponseDTO> findByEquipment(Long equipmentId);
}
