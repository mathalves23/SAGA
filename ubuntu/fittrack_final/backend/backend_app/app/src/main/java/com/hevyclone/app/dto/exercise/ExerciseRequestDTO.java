package com.hevyclone.app.dto.exercise;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisições de exercícios
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequestDTO {
    
    @NotBlank(message = "O nome do exercício é obrigatório")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String name;
    
    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
    private String description;
    
    @Size(max = 500, message = "As instruções devem ter no máximo 500 caracteres")
    private String instructions;
    
    @NotNull(message = "O grupo muscular é obrigatório")
    private Long primaryMuscleGroupId;
    
    private Long equipmentId;
    
    private Long difficultyLevelId;
    
    private String imageUrl;
    
    private String videoUrl;
    
    private String animationUrl;  // GIF/animação do exercício
    
    private String thumbnailUrl;  // Thumbnail para listas
    
    private String originalName;  // Nome original em inglês
    
    private String externalId;    // ID externo (ex: Hevy)
}
