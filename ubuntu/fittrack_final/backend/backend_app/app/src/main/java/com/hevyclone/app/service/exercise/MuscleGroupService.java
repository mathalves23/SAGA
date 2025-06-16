package com.hevyclone.app.service.exercise;

import com.hevyclone.app.model.exercise.MuscleGroup;

import java.util.List;
import java.util.Optional;

/**
 * Interface do serviço para operações com grupos musculares
 */
public interface MuscleGroupService {
    
    /**
     * Busca todos os grupos musculares
     * @return Lista de grupos musculares
     */
    List<MuscleGroup> getAllMuscleGroups();
    
    /**
     * Busca grupo muscular por ID
     * @param id ID do grupo muscular
     * @return Grupo muscular encontrado ou vazio
     */
    Optional<MuscleGroup> getMuscleGroupById(Long id);
    
    /**
     * Cria um novo grupo muscular
     * @param muscleGroup Dados do grupo muscular
     * @return Grupo muscular criado
     */
    MuscleGroup createMuscleGroup(MuscleGroup muscleGroup);
    
    /**
     * Atualiza um grupo muscular existente
     * @param id ID do grupo muscular
     * @param muscleGroup Dados atualizados
     * @return Grupo muscular atualizado ou vazio
     */
    Optional<MuscleGroup> updateMuscleGroup(Long id, MuscleGroup muscleGroup);
    
    /**
     * Remove um grupo muscular
     * @param id ID do grupo muscular
     * @return true se removido com sucesso, false caso contrário
     */
    boolean deleteMuscleGroup(Long id);
} 