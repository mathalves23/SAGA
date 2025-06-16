package com.hevyclone.app.service.exercise;

import com.hevyclone.app.model.exercise.Equipment;

import java.util.List;
import java.util.Optional;

/**
 * Interface do serviço para operações com equipamentos
 */
public interface EquipmentService {
    
    /**
     * Busca todos os equipamentos
     * @return Lista de equipamentos
     */
    List<Equipment> getAllEquipments();
    
    /**
     * Busca equipamento por ID
     * @param id ID do equipamento
     * @return Equipamento encontrado ou vazio
     */
    Optional<Equipment> getEquipmentById(Long id);
    
    /**
     * Cria um novo equipamento
     * @param equipment Dados do equipamento
     * @return Equipamento criado
     */
    Equipment createEquipment(Equipment equipment);
    
    /**
     * Atualiza um equipamento existente
     * @param id ID do equipamento
     * @param equipment Dados atualizados
     * @return Equipamento atualizado ou vazio
     */
    Optional<Equipment> updateEquipment(Long id, Equipment equipment);
    
    /**
     * Remove um equipamento
     * @param id ID do equipamento
     * @return true se removido com sucesso, false caso contrário
     */
    boolean deleteEquipment(Long id);
} 