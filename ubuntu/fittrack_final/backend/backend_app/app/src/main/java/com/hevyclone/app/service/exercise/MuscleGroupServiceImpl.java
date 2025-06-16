package com.hevyclone.app.service.exercise;

import com.hevyclone.app.model.exercise.MuscleGroup;
import com.hevyclone.app.repository.exercise.MuscleGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Implementação do serviço para grupos musculares
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MuscleGroupServiceImpl implements MuscleGroupService {

    private final MuscleGroupRepository muscleGroupRepository;

    @Override
    @Cacheable(value = "muscleGroups")
    public List<MuscleGroup> getAllMuscleGroups() {
        log.debug("Buscando todos os grupos musculares");
        return muscleGroupRepository.findAll();
    }

    @Override
    @Cacheable(value = "muscleGroup", key = "#id")
    public Optional<MuscleGroup> getMuscleGroupById(Long id) {
        log.debug("Buscando grupo muscular por ID: {}", id);
        return muscleGroupRepository.findById(id);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"muscleGroups", "muscleGroup"}, allEntries = true)
    public MuscleGroup createMuscleGroup(MuscleGroup muscleGroup) {
        log.debug("Criando novo grupo muscular: {}", muscleGroup.getName());
        return muscleGroupRepository.save(muscleGroup);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"muscleGroups", "muscleGroup"}, allEntries = true)
    public Optional<MuscleGroup> updateMuscleGroup(Long id, MuscleGroup muscleGroup) {
        log.debug("Atualizando grupo muscular ID: {}", id);
        return muscleGroupRepository.findById(id)
                .map(existing -> {
                    existing.setName(muscleGroup.getName());
                    existing.setDescription(muscleGroup.getDescription());
                    existing.setImageUrl(muscleGroup.getImageUrl());
                    return muscleGroupRepository.save(existing);
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = {"muscleGroups", "muscleGroup"}, allEntries = true)
    public boolean deleteMuscleGroup(Long id) {
        log.debug("Removendo grupo muscular ID: {}", id);
        if (muscleGroupRepository.existsById(id)) {
            muscleGroupRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 