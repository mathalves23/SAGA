package com.hevyclone.app.controller.routine;

import com.hevyclone.app.model.routine.WorkoutExercise;
import com.hevyclone.app.service.routine.WorkoutExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api") // Base path
public class WorkoutExerciseController {

    @Autowired
    private WorkoutExerciseService workoutExerciseService;

    // Endpoint para listar todos os exercícios de um workout específico
    @GetMapping("/workouts/{workoutId}/exercises")
    @PreAuthorize("hasRole(\'USER\') or hasRole(\'ADMIN\')")
    public ResponseEntity<List<WorkoutExercise>> getWorkoutExercisesByWorkoutId(@PathVariable Long workoutId) {
        List<WorkoutExercise> workoutExercises = workoutExerciseService.getWorkoutExercisesByWorkoutId(workoutId);
        return ResponseEntity.ok(workoutExercises);
    }

    // Endpoint para buscar um WorkoutExercise específico pelo ID
    @GetMapping("/workout-exercises/{workoutExerciseId}")
    @PreAuthorize("hasRole(\'USER\') or hasRole(\'ADMIN\')")
    public ResponseEntity<WorkoutExercise> getWorkoutExerciseById(@PathVariable Long workoutExerciseId) {
        Optional<WorkoutExercise> workoutExercise = workoutExerciseService.getWorkoutExerciseById(workoutExerciseId);
        return workoutExercise.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para adicionar um exercício a um workout (Apenas ADMIN)
    // O corpo da requisição deve conter os detalhes do WorkoutExercise (ordem, series, reps, etc.)
    // e o exerciseId deve ser passado como parâmetro ou no corpo, dependendo da preferência.
    // Aqui, vamos assumir que o exerciseId está no corpo de workoutExerciseDetails ou será buscado de outra forma.
    // Para simplificar, passaremos exerciseId como path variable.
    @PostMapping("/workouts/{workoutId}/exercises/{exerciseId}")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<WorkoutExercise> addExerciseToWorkout(@PathVariable Long workoutId, 
                                                              @PathVariable Long exerciseId, 
                                                              @RequestBody WorkoutExercise workoutExerciseDetails) {
        try {
            WorkoutExercise createdWorkoutExercise = workoutExerciseService.addExerciseToWorkout(workoutId, exerciseId, workoutExerciseDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdWorkoutExercise);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Ou uma mensagem de erro mais específica
        }
    }

    // Endpoint para atualizar os detalhes de um exercício em um workout (Apenas ADMIN)
    @PutMapping("/workout-exercises/{workoutExerciseId}")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<WorkoutExercise> updateWorkoutExercise(@PathVariable Long workoutExerciseId, 
                                                               @RequestBody WorkoutExercise workoutExerciseDetails) {
        try {
            WorkoutExercise updatedWorkoutExercise = workoutExerciseService.updateWorkoutExercise(workoutExerciseId, workoutExerciseDetails);
            return ResponseEntity.ok(updatedWorkoutExercise);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para remover um exercício de um workout (Apenas ADMIN)
    @DeleteMapping("/workout-exercises/{workoutExerciseId}")
    @PreAuthorize("hasRole(\'ADMIN\')")
    public ResponseEntity<Void> removeExerciseFromWorkout(@PathVariable Long workoutExerciseId) {
        try {
            workoutExerciseService.removeExerciseFromWorkout(workoutExerciseId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

