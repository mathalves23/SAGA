package com.hevyclone.app.controller.exercise;

import com.hevyclone.app.model.exercise.MuscleGroup;
import com.hevyclone.app.service.exercise.MuscleGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller para operações relacionadas a grupos musculares
 */
@RestController
@RequestMapping("/api/muscle-groups")
@RequiredArgsConstructor
@Tag(name = "Grupos Musculares", description = "API para gerenciamento de grupos musculares")
public class MuscleGroupController {

    private final MuscleGroupService muscleGroupService;

    @GetMapping
    @Operation(summary = "Listar todos os grupos musculares", description = "Retorna uma lista com todos os grupos musculares cadastrados")
    public ResponseEntity<List<MuscleGroup>> getAllMuscleGroups() {
        return ResponseEntity.ok(muscleGroupService.getAllMuscleGroups());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar grupo muscular por ID", description = "Retorna um grupo muscular específico pelo ID")
    public ResponseEntity<MuscleGroup> getMuscleGroupById(@PathVariable Long id) {
        Optional<MuscleGroup> muscleGroup = muscleGroupService.getMuscleGroupById(id);
        return muscleGroup.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar novo grupo muscular", description = "Cria um novo grupo muscular")
    public ResponseEntity<MuscleGroup> createMuscleGroup(@RequestBody MuscleGroup muscleGroup) {
        MuscleGroup created = muscleGroupService.createMuscleGroup(muscleGroup);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar grupo muscular", description = "Atualiza um grupo muscular existente")
    public ResponseEntity<MuscleGroup> updateMuscleGroup(@PathVariable Long id, @RequestBody MuscleGroup muscleGroup) {
        Optional<MuscleGroup> updated = muscleGroupService.updateMuscleGroup(id, muscleGroup);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar grupo muscular", description = "Remove um grupo muscular pelo ID")
    public ResponseEntity<Void> deleteMuscleGroup(@PathVariable Long id) {
        if (muscleGroupService.deleteMuscleGroup(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
} 