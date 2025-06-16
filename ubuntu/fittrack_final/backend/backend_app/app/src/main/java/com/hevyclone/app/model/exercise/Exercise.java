package com.hevyclone.app.model.exercise;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa um exercício
 */
@Entity
@Table(name = "exercises")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Exercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 500)
    private String instructions;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_muscle_group_id", nullable = false)
    private MuscleGroup primaryMuscleGroup;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "difficulty_level_id")
    private DifficultyLevel difficultyLevel;
    
    private String imageUrl;
    
    private String videoUrl;
    
    @Column(name = "animation_url")
    private String animationUrl;  // GIF/animação do exercício
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;  // Thumbnail para listas
    
    @Column(name = "original_name")
    private String originalName;  // Nome original em inglês
    
    @Column(name = "external_id")
    private String externalId;    // ID externo (ex: Hevy)
}
