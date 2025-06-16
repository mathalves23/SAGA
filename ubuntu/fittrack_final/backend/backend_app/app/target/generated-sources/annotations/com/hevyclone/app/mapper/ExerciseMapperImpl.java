package com.hevyclone.app.mapper;

import com.hevyclone.app.dto.exercise.ExerciseRequestDTO;
import com.hevyclone.app.dto.exercise.ExerciseResponseDTO;
import com.hevyclone.app.model.exercise.DifficultyLevel;
import com.hevyclone.app.model.exercise.Equipment;
import com.hevyclone.app.model.exercise.Exercise;
import com.hevyclone.app.model.exercise.MuscleGroup;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-16T13:12:37-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.0.v20250514-1000, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class ExerciseMapperImpl implements ExerciseMapper {

    @Override
    public ExerciseResponseDTO toDto(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }

        ExerciseResponseDTO.ExerciseResponseDTOBuilder exerciseResponseDTO = ExerciseResponseDTO.builder();

        exerciseResponseDTO.primaryMuscleGroupId( exercisePrimaryMuscleGroupId( exercise ) );
        exerciseResponseDTO.primaryMuscleGroupName( exercisePrimaryMuscleGroupName( exercise ) );
        exerciseResponseDTO.equipmentId( exerciseEquipmentId( exercise ) );
        exerciseResponseDTO.equipmentName( exerciseEquipmentName( exercise ) );
        exerciseResponseDTO.difficultyLevelId( exerciseDifficultyLevelId( exercise ) );
        exerciseResponseDTO.difficultyLevelName( exerciseDifficultyLevelName( exercise ) );
        exerciseResponseDTO.animationUrl( exercise.getAnimationUrl() );
        exerciseResponseDTO.description( exercise.getDescription() );
        exerciseResponseDTO.externalId( exercise.getExternalId() );
        exerciseResponseDTO.id( exercise.getId() );
        exerciseResponseDTO.imageUrl( exercise.getImageUrl() );
        exerciseResponseDTO.instructions( exercise.getInstructions() );
        exerciseResponseDTO.name( exercise.getName() );
        exerciseResponseDTO.originalName( exercise.getOriginalName() );
        exerciseResponseDTO.thumbnailUrl( exercise.getThumbnailUrl() );
        exerciseResponseDTO.videoUrl( exercise.getVideoUrl() );

        return exerciseResponseDTO.build();
    }

    @Override
    public Exercise toEntity(ExerciseRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Exercise.ExerciseBuilder exercise = Exercise.builder();

        exercise.animationUrl( dto.getAnimationUrl() );
        exercise.description( dto.getDescription() );
        exercise.externalId( dto.getExternalId() );
        exercise.imageUrl( dto.getImageUrl() );
        exercise.instructions( dto.getInstructions() );
        exercise.name( dto.getName() );
        exercise.originalName( dto.getOriginalName() );
        exercise.thumbnailUrl( dto.getThumbnailUrl() );
        exercise.videoUrl( dto.getVideoUrl() );

        return exercise.build();
    }

    @Override
    public void updateEntityFromDto(ExerciseRequestDTO dto, Exercise exercise) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAnimationUrl() != null ) {
            exercise.setAnimationUrl( dto.getAnimationUrl() );
        }
        if ( dto.getDescription() != null ) {
            exercise.setDescription( dto.getDescription() );
        }
        if ( dto.getExternalId() != null ) {
            exercise.setExternalId( dto.getExternalId() );
        }
        if ( dto.getImageUrl() != null ) {
            exercise.setImageUrl( dto.getImageUrl() );
        }
        if ( dto.getInstructions() != null ) {
            exercise.setInstructions( dto.getInstructions() );
        }
        if ( dto.getName() != null ) {
            exercise.setName( dto.getName() );
        }
        if ( dto.getOriginalName() != null ) {
            exercise.setOriginalName( dto.getOriginalName() );
        }
        if ( dto.getThumbnailUrl() != null ) {
            exercise.setThumbnailUrl( dto.getThumbnailUrl() );
        }
        if ( dto.getVideoUrl() != null ) {
            exercise.setVideoUrl( dto.getVideoUrl() );
        }
    }

    private Long exercisePrimaryMuscleGroupId(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        MuscleGroup primaryMuscleGroup = exercise.getPrimaryMuscleGroup();
        if ( primaryMuscleGroup == null ) {
            return null;
        }
        Long id = primaryMuscleGroup.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String exercisePrimaryMuscleGroupName(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        MuscleGroup primaryMuscleGroup = exercise.getPrimaryMuscleGroup();
        if ( primaryMuscleGroup == null ) {
            return null;
        }
        String name = primaryMuscleGroup.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long exerciseEquipmentId(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        Equipment equipment = exercise.getEquipment();
        if ( equipment == null ) {
            return null;
        }
        Long id = equipment.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String exerciseEquipmentName(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        Equipment equipment = exercise.getEquipment();
        if ( equipment == null ) {
            return null;
        }
        String name = equipment.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long exerciseDifficultyLevelId(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        DifficultyLevel difficultyLevel = exercise.getDifficultyLevel();
        if ( difficultyLevel == null ) {
            return null;
        }
        Long id = difficultyLevel.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String exerciseDifficultyLevelName(Exercise exercise) {
        if ( exercise == null ) {
            return null;
        }
        DifficultyLevel difficultyLevel = exercise.getDifficultyLevel();
        if ( difficultyLevel == null ) {
            return null;
        }
        String name = difficultyLevel.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
