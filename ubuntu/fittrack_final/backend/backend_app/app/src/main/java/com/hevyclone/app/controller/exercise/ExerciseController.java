package com.hevyclone.app.controller.exercise;

import com.hevyclone.app.dto.exercise.ExerciseRequestDTO;
import com.hevyclone.app.dto.exercise.ExerciseResponseDTO;
import com.hevyclone.app.service.exercise.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para operações relacionadas a exercícios
 */
@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercícios", description = "API para gerenciamento de exercícios")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    @Operation(summary = "Listar todos os exercícios", description = "Retorna uma lista com todos os exercícios cadastrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exercícios encontrados com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acesso proibido", content = @Content)
    })
    public ResponseEntity<List<ExerciseResponseDTO>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/paginated")
    @Operation(summary = "Listar exercícios paginados", description = "Retorna uma página de exercícios")
    public ResponseEntity<Page<ExerciseResponseDTO>> getExercisesPaginated(Pageable pageable) {
        return ResponseEntity.ok(exerciseService.getExercisesPaginated(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar exercício por ID", description = "Retorna um exercício específico pelo seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exercício encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Exercício não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acesso proibido", content = @Content)
    })
    public ResponseEntity<ExerciseResponseDTO> getExerciseById(
            @Parameter(description = "ID do exercício", required = true)
            @PathVariable Long id) {
        return exerciseService.getExerciseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar exercício", description = "Cria um novo exercício")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Exercício criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autorizado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acesso proibido", content = @Content)
    })
    public ResponseEntity<ExerciseResponseDTO> createExercise(
            @Parameter(description = "Dados do exercício", required = true)
            @Valid @RequestBody ExerciseRequestDTO exerciseDTO) {
        ExerciseResponseDTO createdExercise = exerciseService.createExercise(exerciseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExercise);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar exercício", description = "Atualiza um exercício existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exercício atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Exercício não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acesso proibido", content = @Content)
    })
    public ResponseEntity<ExerciseResponseDTO> updateExercise(
            @Parameter(description = "ID do exercício", required = true)
            @PathVariable Long id,
            @Parameter(description = "Novos dados do exercício", required = true)
            @Valid @RequestBody ExerciseRequestDTO exerciseDTO) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, exerciseDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remover exercício", description = "Remove um exercício existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Exercício removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Exercício não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acesso proibido", content = @Content)
    })
    public ResponseEntity<Void> deleteExercise(
            @Parameter(description = "ID do exercício", required = true)
            @PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/muscle-group/{muscleGroupId}")
    @Operation(summary = "Buscar exercícios por grupo muscular", description = "Retorna exercícios de um grupo muscular específico")
    public ResponseEntity<List<ExerciseResponseDTO>> getExercisesByMuscleGroup(
            @Parameter(description = "ID do grupo muscular", required = true)
            @PathVariable Long muscleGroupId) {
        return ResponseEntity.ok(exerciseService.findByMuscleGroup(muscleGroupId));
    }

    @GetMapping("/difficulty-level/{difficultyLevelId}")
    @Operation(summary = "Buscar exercícios por nível de dificuldade", description = "Retorna exercícios de um nível de dificuldade específico")
    public ResponseEntity<List<ExerciseResponseDTO>> getExercisesByDifficultyLevel(
            @Parameter(description = "ID do nível de dificuldade", required = true)
            @PathVariable Long difficultyLevelId) {
        return ResponseEntity.ok(exerciseService.findByDifficultyLevel(difficultyLevelId));
    }

    @GetMapping("/equipment/{equipmentId}")
    @Operation(summary = "Buscar exercícios por equipamento", description = "Retorna exercícios que utilizam um equipamento específico")
    public ResponseEntity<List<ExerciseResponseDTO>> getExercisesByEquipment(
            @Parameter(description = "ID do equipamento", required = true)
            @PathVariable Long equipmentId) {
        return ResponseEntity.ok(exerciseService.findByEquipment(equipmentId));
    }
}
