package com.hevyclone.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.hevyclone.app.dto.exercise.ExerciseRequestDTO;
import com.hevyclone.app.dto.exercise.ExerciseResponseDTO;
import com.hevyclone.app.model.exercise.Exercise;
import com.hevyclone.app.model.exercise.MuscleGroup;
import com.hevyclone.app.model.exercise.Equipment;
import com.hevyclone.app.model.exercise.DifficultyLevel;

/**
 * Interface para mapeamento entre entidade Exercise e seus DTOs
 */
@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ExerciseMapper {
    
    /**
     * Converte entidade Exercise para ExerciseResponseDTO
     * 
     * @param exercise entidade a ser convertida
     * @return DTO de resposta
     */
    @Mapping(target = "primaryMuscleGroupId", source = "primaryMuscleGroup.id")
    @Mapping(target = "primaryMuscleGroupName", source = "primaryMuscleGroup.name")
    @Mapping(target = "equipmentId", source = "equipment.id")
    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "difficultyLevelId", source = "difficultyLevel.id")
    @Mapping(target = "difficultyLevelName", source = "difficultyLevel.name")
    ExerciseResponseDTO toDto(Exercise exercise);
    
    /**
     * Converte ExerciseRequestDTO para entidade Exercise
     * 
     * @param dto DTO de requisição
     * @return entidade Exercise
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "primaryMuscleGroup", ignore = true)
    @Mapping(target = "equipment", ignore = true)
    @Mapping(target = "difficultyLevel", ignore = true)
    Exercise toEntity(ExerciseRequestDTO dto);
    
    /**
     * Atualiza entidade Exercise com dados do DTO
     * 
     * @param dto DTO com dados atualizados
     * @param exercise entidade a ser atualizada
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "primaryMuscleGroup", ignore = true)
    @Mapping(target = "equipment", ignore = true)
    @Mapping(target = "difficultyLevel", ignore = true)
    void updateEntityFromDto(ExerciseRequestDTO dto, @MappingTarget Exercise exercise);
    
    default MuscleGroup muscleGroupFromId(Long id) {
        if (id == null) {
            return null;
        }
        return MuscleGroup.builder().id(id).build();
    }
    
    default Equipment equipmentFromId(Long id) {
        if (id == null) {
            return null;
        }
        return Equipment.builder().id(id).build();
    }
    
    default DifficultyLevel difficultyLevelFromId(Long id) {
        if (id == null) {
            return null;
        }
        return DifficultyLevel.builder().id(id).build();
    }
}
