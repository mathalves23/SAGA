package com.hevyclone.app.service.userprogress;

import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.model.userprogress.UserRoutine;
import com.hevyclone.app.repository.routine.RoutineRepository;
import com.hevyclone.app.repository.userprogress.UserRoutineRepository;
import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserRoutineService {

    @Autowired
    private UserRoutineRepository userRoutineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoutineRepository routineRepository;

    @Transactional(readOnly = true)
    public List<UserRoutine> getAllUserRoutines(Long userId) {
        return userRoutineRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<UserRoutine> getActiveUserRoutine(Long userId) {
        return userRoutineRepository.findByUserIdAndActiveTrue(userId);
    }

    @Transactional(readOnly = true)
    public Optional<UserRoutine> getUserRoutineById(Long userRoutineId) {
        return userRoutineRepository.findById(userRoutineId);
    }

    @Transactional
    public UserRoutine startRoutine(Long userId, Long routineId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + userId));
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("Rotina não encontrada com o id: " + routineId));

        // Desativar qualquer outra rotina ativa para este usuário
        userRoutineRepository.findByUserIdAndActiveTrue(userId).ifPresent(activeRoutine -> {
            activeRoutine.setActive(false);
            activeRoutine.setEndDate(LocalDate.now());
            userRoutineRepository.save(activeRoutine);
        });

        UserRoutine newUserRoutine = new UserRoutine();
        newUserRoutine.setUser(user);
        newUserRoutine.setRoutine(routine);
        newUserRoutine.setStartDate(LocalDate.now());
        newUserRoutine.setActive(true);

        return userRoutineRepository.save(newUserRoutine);
    }

    @Transactional
    public UserRoutine abandonRoutine(Long userRoutineId) {
        UserRoutine userRoutine = userRoutineRepository.findById(userRoutineId)
                .orElseThrow(() -> new RuntimeException("UserRoutine não encontrado com o id: " + userRoutineId));

        if (!userRoutine.isActive()) {
            throw new RuntimeException("Esta rotina não está ativa e não pode ser abandonada.");
        }

        userRoutine.setActive(false);
        userRoutine.setEndDate(LocalDate.now());
        return userRoutineRepository.save(userRoutine);
    }
    
    // Não há um método "marcar treino como realizado" aqui, pois isso será tratado 
    // pelo UserWorkoutLogService, que registrará um treino específico como concluído.
    // A lógica para verificar o progresso de uma rotina (ex: todos os treinos da semana concluídos)
    // pode ser mais complexa e residir neste serviço ou em um serviço de "progresso" dedicado.
}

