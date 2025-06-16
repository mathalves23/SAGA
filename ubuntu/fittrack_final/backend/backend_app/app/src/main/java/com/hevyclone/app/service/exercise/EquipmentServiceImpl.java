package com.hevyclone.app.service.exercise;

import com.hevyclone.app.model.exercise.Equipment;
import com.hevyclone.app.repository.exercise.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para equipamentos
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;

    @Override
    @Cacheable(value = "equipments")
    public List<Equipment> getAllEquipments() {
        log.debug("Buscando todos os equipamentos");
        return equipmentRepository.findAll();
    }

    @Override
    @Cacheable(value = "equipment", key = "#id")
    public Optional<Equipment> getEquipmentById(Long id) {
        log.debug("Buscando equipamento por ID: {}", id);
        return equipmentRepository.findById(id);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"equipments", "equipment"}, allEntries = true)
    public Equipment createEquipment(Equipment equipment) {
        log.debug("Criando novo equipamento: {}", equipment.getName());
        return equipmentRepository.save(equipment);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"equipments", "equipment"}, allEntries = true)
    public Optional<Equipment> updateEquipment(Long id, Equipment equipment) {
        log.debug("Atualizando equipamento ID: {}", id);
        return equipmentRepository.findById(id)
                .map(existing -> {
                    existing.setName(equipment.getName());
                    existing.setNamePt(equipment.getNamePt());
                    existing.setDescription(equipment.getDescription());
                    return equipmentRepository.save(existing);
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = {"equipments", "equipment"}, allEntries = true)
    public boolean deleteEquipment(Long id) {
        log.debug("Removendo equipamento ID: {}", id);
        if (equipmentRepository.existsById(id)) {
            equipmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 