package com.hevyclone.app.dto.exercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

/**
 * DTO para respostas de exercícios
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String description;
    private String instructions;

    private Long primaryMuscleGroupId;
    private String primaryMuscleGroupName;    

    private Long equipmentId;
    private String equipmentName;

    private Long difficultyLevelId;
    private String difficultyLevelName;

    private String imageUrl;
    private String videoUrl;
    private String animationUrl;  // GIF/animação do exercício
    private String thumbnailUrl;  // Thumbnail para listas
    private String originalName;  // Nome original em inglês
    private String externalId;    // ID externo (ex: Hevy)
}
