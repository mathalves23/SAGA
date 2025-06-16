package com.hevyclone.app.service.userprogress;

import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.model.userprogress.UserRoutine;
import com.hevyclone.app.model.userprogress.UserWorkoutLog;
import com.hevyclone.app.repository.routine.WorkoutRepository;
import com.hevyclone.app.repository.userprogress.UserRoutineRepository;
import com.hevyclone.app.repository.userprogress.UserWorkoutLogRepository;
import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserWorkoutLogService {

    @Autowired
    private UserWorkoutLogRepository userWorkoutLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRoutineRepository userRoutineRepository; // Para associar o log à rotina ativa do usuário

    @Transactional(readOnly = true)
    public List<UserWorkoutLog> getLogsByUserId(Long userId) {
        return userWorkoutLogRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<UserWorkoutLog> getLogsByUserRoutineId(Long userRoutineId) {
        return userWorkoutLogRepository.findByUserRoutineId(userRoutineId);
    }

    @Transactional(readOnly = true)
    public Optional<UserWorkoutLog> getLogById(Long logId) {
        return userWorkoutLogRepository.findById(logId);
    }

    @Transactional
    public UserWorkoutLog logWorkout(Long userId, Long workoutId, UserWorkoutLog logDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o id: " + userId));
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout não encontrado com o id: " + workoutId));

        UserWorkoutLog newLog = new UserWorkoutLog();
        newLog.setUser(user);
        newLog.setWorkout(workout);
        newLog.setCompletedAt(logDetails.getCompletedAt() != null ? logDetails.getCompletedAt() : LocalDateTime.now());
        newLog.setDurationMinutes(logDetails.getDurationMinutes());
        newLog.setNotes(logDetails.getNotes());

        // Tenta associar à rotina ativa do usuário, se houver uma e se o workout pertencer a essa rotina
        Optional<UserRoutine> activeUserRoutineOpt = userRoutineRepository.findByUserIdAndActiveTrue(userId);
        if (activeUserRoutineOpt.isPresent()) {
            UserRoutine activeUserRoutine = activeUserRoutineOpt.get();
            // Verifica se o workout logado pertence à rotina ativa
            boolean workoutBelongsToActiveRoutine = activeUserRoutine.getRoutine().getWorkouts().stream()
                .anyMatch(w -> w.getId().equals(workoutId));
            if (workoutBelongsToActiveRoutine) {
                 newLog.setUserRoutine(activeUserRoutine);
            }
        }
        
        // Aqui poderiam ser disparados eventos para verificar PRs ou notificar amigos, por exemplo.

        return userWorkoutLogRepository.save(newLog);
    }

    @Transactional
    public UserWorkoutLog updateWorkoutLog(Long logId, UserWorkoutLog logDetails) {
        UserWorkoutLog existingLog = userWorkoutLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Log de treino não encontrado com o id: " + logId));

        // Apenas alguns campos são tipicamente editáveis após o log inicial
        existingLog.setDurationMinutes(logDetails.getDurationMinutes());
        existingLog.setNotes(logDetails.getNotes());
        if (logDetails.getCompletedAt() != null) { // Permitir ajuste da data/hora de conclusão
            existingLog.setCompletedAt(logDetails.getCompletedAt());
        }
        // O usuário e o workout geralmente não são alterados em um log existente.

        return userWorkoutLogRepository.save(existingLog);
    }

    @Transactional
    public void deleteWorkoutLog(Long logId) {
        UserWorkoutLog existingLog = userWorkoutLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("Log de treino não encontrado com o id: " + logId));
        userWorkoutLogRepository.delete(existingLog);
    }
}

