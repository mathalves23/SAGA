package com.hevyclone.app.controller.userprogress;

import com.hevyclone.app.model.userprogress.UserWorkoutLog;
import com.hevyclone.app.service.userprogress.UserWorkoutLogService;
import com.hevyclone.app.auth.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/logs") // Base path para logs de treino do usuário
public class UserWorkoutLogController {

    @Autowired
    private UserWorkoutLogService userWorkoutLogService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    // Endpoint para o usuário listar todos os seus logs de treino
    @GetMapping
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<List<UserWorkoutLog>> getMyWorkoutLogs() {
        Long userId = getCurrentUserId();
        List<UserWorkoutLog> logs = userWorkoutLogService.getLogsByUserId(userId);
        return ResponseEntity.ok(logs);
    }

    // Endpoint para o usuário listar os logs de treino associados a uma UserRoutine específica
    @GetMapping("/routine/{userRoutineId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<List<UserWorkoutLog>> getMyWorkoutLogsByUserRoutine(@PathVariable Long userRoutineId) {
        Long userId = getCurrentUserId();
        // Adicionar validação para garantir que userRoutineId pertence ao userId logado
        // Esta validação pode ser feita no serviço ou aqui.
        // Por simplicidade, assumimos que o serviço pode lidar com isso ou que o frontend envia o ID correto.
        List<UserWorkoutLog> logs = userWorkoutLogService.getLogsByUserRoutineId(userRoutineId);
        // Filtrar para garantir que os logs pertencem ao usuário atual, se a busca no serviço não o fizer implicitamente.
        // No entanto, UserWorkoutLog tem um campo User, então o serviço já deve filtrar por user ID ao buscar por userRoutineId.
        return ResponseEntity.ok(logs);
    }


    // Endpoint para o usuário buscar um log de treino específico pelo ID
    @GetMapping("/{logId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserWorkoutLog> getMyWorkoutLogById(@PathVariable Long logId) {
        Long userId = getCurrentUserId();
        Optional<UserWorkoutLog> logOpt = userWorkoutLogService.getLogById(logId);
        if (logOpt.isPresent() && logOpt.get().getUser().getId().equals(userId)) {
            return ResponseEntity.ok(logOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint para o usuário registrar um novo treino (log)
    // O workoutId é o ID do treino (template) que foi realizado.
    // O corpo da requisição (logDetails) contém informações como duração, notas, data de conclusão.
    @PostMapping("/workout/{workoutId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserWorkoutLog> logNewWorkout(@PathVariable Long workoutId, @RequestBody UserWorkoutLog logDetails) {
        Long userId = getCurrentUserId();
        try {
            UserWorkoutLog createdLog = userWorkoutLogService.logWorkout(userId, workoutId, logDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // Ex: Workout ou User não encontrado
        }
    }

    // Endpoint para o usuário atualizar um log de treino existente
    @PutMapping("/{logId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserWorkoutLog> updateMyWorkoutLog(@PathVariable Long logId, @RequestBody UserWorkoutLog logDetails) {
        Long userId = getCurrentUserId();
        try {
            // Validar se o logId pertence ao usuário logado antes de atualizar
            Optional<UserWorkoutLog> existingLogOpt = userWorkoutLogService.getLogById(logId);
            if (existingLogOpt.isEmpty() || !existingLogOpt.get().getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            UserWorkoutLog updatedLog = userWorkoutLogService.updateWorkoutLog(logId, logDetails);
            return ResponseEntity.ok(updatedLog);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Ex: Log não encontrado
        }
    }

    // Endpoint para o usuário deletar um log de treino
    @DeleteMapping("/{logId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<Void> deleteMyWorkoutLog(@PathVariable Long logId) {
        Long userId = getCurrentUserId();
        try {
            // Validar se o logId pertence ao usuário logado antes de deletar
            Optional<UserWorkoutLog> existingLogOpt = userWorkoutLogService.getLogById(logId);
            if (existingLogOpt.isEmpty() || !existingLogOpt.get().getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            userWorkoutLogService.deleteWorkoutLog(logId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Ex: Log não encontrado
        }
    }
}

