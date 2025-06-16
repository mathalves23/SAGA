package com.hevyclone.app.repository.exercise;

import com.hevyclone.app.model.exercise.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações com equipamentos
 */
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    
    /**
     * Busca equipamento por nome
     * @param name Nome do equipamento
     * @return Equipamento encontrado ou vazio
     */
    Equipment findByNameIgnoreCase(String name);
}
