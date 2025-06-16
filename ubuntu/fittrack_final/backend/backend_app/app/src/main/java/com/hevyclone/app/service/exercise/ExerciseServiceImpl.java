package com.hevyclone.app.service.exercise;

import com.hevyclone.app.dto.exercise.ExerciseRequestDTO;
import com.hevyclone.app.dto.exercise.ExerciseResponseDTO;
import com.hevyclone.app.exception.ResourceNotFoundException;
import com.hevyclone.app.mapper.ExerciseMapper;
import com.hevyclone.app.model.exercise.DifficultyLevel;
import com.hevyclone.app.model.exercise.Equipment;
import com.hevyclone.app.model.exercise.Exercise;
import com.hevyclone.app.model.exercise.MuscleGroup;
import com.hevyclone.app.repository.exercise.DifficultyLevelRepository;
import com.hevyclone.app.repository.exercise.EquipmentRepository;
import com.hevyclone.app.repository.exercise.ExerciseRepository;
import com.hevyclone.app.repository.exercise.MuscleGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementação do serviço de exercícios
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final MuscleGroupRepository muscleGroupRepository;
    private final EquipmentRepository equipmentRepository;
    private final DifficultyLevelRepository difficultyLevelRepository;
    private final ExerciseMapper exerciseMapper;

    @Override
    @Cacheable(value = "exercises")
    public List<ExerciseResponseDTO> getAllExercises() {
        log.debug("Buscando todos os exercícios");
        return exerciseRepository.findAll().stream()
                .map(exerciseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "exercisesPaginated", key = "#pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<ExerciseResponseDTO> getExercisesPaginated(Pageable pageable) {
        log.debug("Buscando exercícios paginados: página {}, tamanho {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return exerciseRepository.findAll(pageable)
                .map(exerciseMapper::toDto);
    }

    @Override
    @Cacheable(value = "exercise", key = "#id")
    public Optional<ExerciseResponseDTO> getExerciseById(Long id) {
        log.debug("Buscando exercício por ID: {}", id);
        return exerciseRepository.findById(id)
                .map(exerciseMapper::toDto);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"exercises", "exercisesPaginated", "exercisesByMuscleGroup", 
                         "exercisesByDifficultyLevel", "exercisesByEquipment"}, allEntries = true)
    public ExerciseResponseDTO createExercise(ExerciseRequestDTO exerciseDTO) {
        log.debug("Criando novo exercício: {}", exerciseDTO.getName());
        
        Exercise exercise = exerciseMapper.toEntity(exerciseDTO);
        
        // Configurar relacionamentos
        setRelationships(exercise, exerciseDTO);
        
        Exercise savedExercise = exerciseRepository.save(exercise);
        return exerciseMapper.toDto(savedExercise);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"exercises", "exercisesPaginated", "exercise", "exercisesByMuscleGroup", 
                         "exercisesByDifficultyLevel", "exercisesByEquipment"}, allEntries = true)
    public ExerciseResponseDTO updateExercise(Long id, ExerciseRequestDTO exerciseDTO) {
        log.debug("Atualizando exercício ID: {}", id);
        
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado com ID: " + id));
        
        exerciseMapper.updateEntityFromDto(exerciseDTO, exercise);
        
        // Atualizar relacionamentos
        setRelationships(exercise, exerciseDTO);
        
        Exercise updatedExercise = exerciseRepository.save(exercise);
        return exerciseMapper.toDto(updatedExercise);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"exercises", "exercisesPaginated", "exercise", "exercisesByMuscleGroup", 
                         "exercisesByDifficultyLevel", "exercisesByEquipment"}, allEntries = true)
    public void deleteExercise(Long id) {
        log.debug("Removendo exercício ID: {}", id);
        
        if (!exerciseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exercício não encontrado com ID: " + id);
        }
        
        exerciseRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = "exercisesByMuscleGroup", key = "#muscleGroupId")
    public List<ExerciseResponseDTO> findByMuscleGroup(Long muscleGroupId) {
        log.debug("Buscando exercícios por grupo muscular ID: {}", muscleGroupId);
        
        return exerciseRepository.findByPrimaryMuscleGroupId(muscleGroupId).stream()
                .map(exerciseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "exercisesByDifficultyLevel", key = "#difficultyLevelId")
    public List<ExerciseResponseDTO> findByDifficultyLevel(Long difficultyLevelId) {
        log.debug("Buscando exercícios por nível de dificuldade ID: {}", difficultyLevelId);
        
        return exerciseRepository.findByDifficultyLevelId(difficultyLevelId).stream()
                .map(exerciseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "exercisesByEquipment", key = "#equipmentId")
    public List<ExerciseResponseDTO> findByEquipment(Long equipmentId) {
        log.debug("Buscando exercícios por equipamento ID: {}", equipmentId);
        
        return exerciseRepository.findByEquipmentId(equipmentId).stream()
                .map(exerciseMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Configura os relacionamentos da entidade Exercise
     */
    private void setRelationships(Exercise exercise, ExerciseRequestDTO dto) {
        // Configurar grupo muscular
        if (dto.getPrimaryMuscleGroupId() != null) {
            MuscleGroup muscleGroup = muscleGroupRepository.findById(dto.getPrimaryMuscleGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Grupo muscular não encontrado com ID: " + dto.getPrimaryMuscleGroupId()));
            exercise.setPrimaryMuscleGroup(muscleGroup);
        }
        
        // Configurar equipamento
        if (dto.getEquipmentId() != null) {
            Equipment equipment = equipmentRepository.findById(dto.getEquipmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipamento não encontrado com ID: " + dto.getEquipmentId()));
            exercise.setEquipment(equipment);
        }
        
        // Configurar nível de dificuldade
        if (dto.getDifficultyLevelId() != null) {
            DifficultyLevel difficultyLevel = difficultyLevelRepository.findById(dto.getDifficultyLevelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nível de dificuldade não encontrado com ID: " + dto.getDifficultyLevelId()));
            exercise.setDifficultyLevel(difficultyLevel);
        }
    }
}
