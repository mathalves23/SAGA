package com.hevyclone.app.controller.userprogress;

import com.hevyclone.app.model.userprogress.UserRoutine;
import com.hevyclone.app.service.userprogress.UserRoutineService;
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
@RequestMapping("/api/user/routines")
public class UserRoutineController {

    @Autowired
    private UserRoutineService userRoutineService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    // Endpoint para o usuário listar todas as suas rotinas (ativas e inativas)
    @GetMapping
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<List<UserRoutine>> getAllMyRoutines() {
        Long userId = getCurrentUserId();
        List<UserRoutine> userRoutines = userRoutineService.getAllUserRoutines(userId);
        return ResponseEntity.ok(userRoutines);
    }

    // Endpoint para o usuário obter sua rotina ativa
    @GetMapping("/active")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserRoutine> getMyActiveRoutine() {
        Long userId = getCurrentUserId();
        Optional<UserRoutine> activeRoutine = userRoutineService.getActiveUserRoutine(userId);
        return activeRoutine.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Endpoint para buscar um UserRoutine específico pelo seu ID (pertencente ao usuário logado)
    @GetMapping("/{userRoutineId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserRoutine> getMyUserRoutineById(@PathVariable Long userRoutineId) {
        Long userId = getCurrentUserId();
        Optional<UserRoutine> userRoutineOpt = userRoutineService.getUserRoutineById(userRoutineId);
        if (userRoutineOpt.isPresent() && userRoutineOpt.get().getUser().getId().equals(userId)) {
            return ResponseEntity.ok(userRoutineOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoint para o usuário iniciar uma nova rotina
    @PostMapping("/start/{routineId}")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserRoutine> startNewRoutine(@PathVariable Long routineId) {
        Long userId = getCurrentUserId();
        try {
            UserRoutine startedRoutine = userRoutineService.startRoutine(userId, routineId);
            return ResponseEntity.status(HttpStatus.CREATED).body(startedRoutine);
        } catch (RuntimeException e) {
            // Pode ser que a rotina ou usuário não exista, ou outra regra de negócio
            return ResponseEntity.badRequest().build(); 
        }
    }

    // Endpoint para o usuário abandonar uma rotina ativa (identificada pelo seu ID de UserRoutine)
    @PostMapping("/{userRoutineId}/abandon")
    @PreAuthorize("hasRole(\'USER\')")
    public ResponseEntity<UserRoutine> abandonActiveRoutine(@PathVariable Long userRoutineId) {
        Long userId = getCurrentUserId();
        try {
            // Validar se o userRoutineId pertence ao usuário logado antes de abandonar
            Optional<UserRoutine> userRoutineOpt = userRoutineService.getUserRoutineById(userRoutineId);
            if (userRoutineOpt.isEmpty() || !userRoutineOpt.get().getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Ou notFound, dependendo da política
            }
            UserRoutine abandonedRoutine = userRoutineService.abandonRoutine(userRoutineId);
            return ResponseEntity.ok(abandonedRoutine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // Ex: rotina não está ativa
        }
    }
}

