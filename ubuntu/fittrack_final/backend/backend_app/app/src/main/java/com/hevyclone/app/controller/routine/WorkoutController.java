package com.hevyclone.app.controller.routine;

import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.service.routine.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api") // Base path para os endpoints de workout
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    // Endpoint para listar todos os workouts de uma rotina específica
    @GetMapping("/routines/{routineId}/workouts")
    @PreAuthorize("hasRole(\'USER\') or hasRole(\'ADMIN\')")
    public ResponseEntity<List<Workout>> getWorkoutsByRoutineId(@PathVariable Long routineId) {
        List<Workout> workouts = workoutService.getWorkoutsByRoutineId(routineId);
        return ResponseEntity.ok(workouts);
    }

    // Endpoint para buscar um workout específico pelo ID
    @GetMapping("/workouts/{workoutId}")
    @PreAuthorize("hasRole(\'USER\') or hasRole(\'ADMIN\')")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long workoutId) {
        Optional<Workout> workout = workoutService.getWorkoutById(workoutId);
        return workout.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para criar um novo workout associado a uma rotina (Apenas ADMIN)
    @PostMapping("/routines/{routineId}/workouts")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<Workout> createWorkout(@PathVariable Long routineId, @RequestBody Workout workout) {
        try {
            Workout createdWorkout = workoutService.createWorkout(routineId, workout);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkout);
        } catch (RuntimeException e) {
            // Se a rotina não for encontrada, por exemplo
            return ResponseEntity.badRequest().build(); 
        }
    }

    // Endpoint para atualizar um workout existente (Apenas ADMIN)
    @PutMapping("/workouts/{workoutId}")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long workoutId, @RequestBody Workout workoutDetails) {
        try {
            Workout updatedWorkout = workoutService.updateWorkout(workoutId, workoutDetails);
            return ResponseEntity.ok(updatedWorkout);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para deletar um workout (Apenas ADMIN)
    @DeleteMapping("/workouts/{workoutId}")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long workoutId) {
        try {
            workoutService.deleteWorkout(workoutId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

