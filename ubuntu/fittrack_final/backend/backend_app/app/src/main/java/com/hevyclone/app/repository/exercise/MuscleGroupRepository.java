package com.hevyclone.app.repository.exercise;

import com.hevyclone.app.model.exercise.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações com grupos musculares
 */
@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroup, Long> {
    
    /**
     * Busca grupo muscular por nome
     * @param name Nome do grupo muscular
     * @return Grupo muscular encontrado ou vazio
     */
    MuscleGroup findByNameIgnoreCase(String name);
}
