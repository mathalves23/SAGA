package com.hevyclone.app.controller.routine;

import com.hevyclone.app.model.profile.UserProfileLevel;
import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.service.routine.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/routines")
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    // Aberto para todos os usuários logados
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Routine>> getAllRoutines(
            @RequestParam(required = false) UserProfileLevel level,
            @RequestParam(required = false) String name) {
        List<Routine> routines;
        if (level != null) {
            routines = routineService.findRoutinesByTargetProfileLevel(level);
        } else if (name != null && !name.isEmpty()) {
            routines = routineService.findRoutinesByNameContaining(name);
        } else {
            routines = routineService.getAllRoutines();
        }
        return ResponseEntity.ok(routines);
    }

    // Aberto para todos os usuários logados
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Routine> getRoutineById(@PathVariable Long id) {
        Optional<Routine> routine = routineService.getRoutineById(id);
        return routine.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint específico para detalhes completos da rotina com carregamento otimizado
    @GetMapping("/{id}/details")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Routine> getRoutineDetails(@PathVariable Long id) {
        Optional<Routine> routine = routineService.getRoutineWithDetails(id);
        return routine.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }    // Permitido para USER e ADMIN criarem rotinas
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createRoutine(@RequestBody Routine routine) {
        try {
            Routine createdRoutine = routineService.createRoutine(routine);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoutine);
        } catch (RuntimeException e) {
            // Log do erro para depuração
            System.err.println("Erro ao criar rotina: " + e.getMessage());
            e.printStackTrace();
            
            // Retornar erro com mensagem específica
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao criar rotina");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Novo endpoint para criar rotina completa com workouts e exercícios
    @PostMapping("/complete")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createCompleteRoutine(@RequestBody RoutineService.RoutineCreationDTO routineDTO) {
        try {
            Routine createdRoutine = routineService.createCompleteRoutine(routineDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoutine);
        } catch (RuntimeException e) {
            // Log do erro para depuração
            System.err.println("Erro ao criar rotina completa: " + e.getMessage());
            e.printStackTrace();
            
            // Retornar erro com mensagem específica
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao criar rotina completa");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Permitido para USER e ADMIN atualizarem rotinas
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Routine> updateRoutine(@PathVariable Long id, @RequestBody Routine routineDetails) {
        try {
            Routine updatedRoutine = routineService.updateRoutine(id, routineDetails);
            return ResponseEntity.ok(updatedRoutine);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Permitido para USER e ADMIN excluírem rotinas
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id) {
        try {
            routineService.deleteRoutine(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

