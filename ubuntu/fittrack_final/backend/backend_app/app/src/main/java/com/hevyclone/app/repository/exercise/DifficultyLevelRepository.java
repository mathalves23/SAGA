package com.hevyclone.app.repository.exercise;

import com.hevyclone.app.model.exercise.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações com níveis de dificuldade
 */
@Repository
public interface DifficultyLevelRepository extends JpaRepository<DifficultyLevel, Long> {
    
    /**
     * Busca nível de dificuldade por nome
     * @param name Nome do nível de dificuldade
     * @return Nível de dificuldade encontrado ou vazio
     */
    DifficultyLevel findByNameIgnoreCase(String name);
    
    /**
     * Busca nível de dificuldade por level
     * @param level Valor numérico do nível
     * @return Nível de dificuldade encontrado ou vazio
     */
    DifficultyLevel findByLevel(Integer level);
}
