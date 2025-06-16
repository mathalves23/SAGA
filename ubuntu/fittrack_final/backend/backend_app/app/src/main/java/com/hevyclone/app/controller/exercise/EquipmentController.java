package com.hevyclone.app.controller.exercise;

import com.hevyclone.app.model.exercise.Equipment;
import com.hevyclone.app.service.exercise.EquipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller para operações relacionadas a equipamentos
 */
@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@Tag(name = "Equipamentos", description = "API para gerenciamento de equipamentos")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    @Operation(summary = "Listar todos os equipamentos", description = "Retorna uma lista com todos os equipamentos cadastrados")
    public ResponseEntity<List<Equipment>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar equipamento por ID", description = "Retorna um equipamento específico pelo ID")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        Optional<Equipment> equipment = equipmentService.getEquipmentById(id);
        return equipment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Criar novo equipamento", description = "Cria um novo equipamento")
    public ResponseEntity<Equipment> createEquipment(@RequestBody Equipment equipment) {
        Equipment created = equipmentService.createEquipment(equipment);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar equipamento", description = "Atualiza um equipamento existente")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipment) {
        Optional<Equipment> updated = equipmentService.updateEquipment(id, equipment);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar equipamento", description = "Remove um equipamento pelo ID")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        if (equipmentService.deleteEquipment(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
} 