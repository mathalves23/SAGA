package com.hevyclone.app.model.userprogress;

import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.user.model.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_workout_logs")
public class UserWorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout; // O treino específico que foi realizado

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_routine_id") // Opcional, se quisermos vincular ao UserRoutine ativo
    private UserRoutine userRoutine;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    private Integer durationMinutes; // Duração do treino em minutos

    @Lob
    private String notes; // Anotações do usuário sobre este treino específico

    // Aqui poderiam entrar detalhes sobre PRs alcançados neste treino específico,
    // ou isso poderia ser uma entidade separada UserExerciseLog ligada a esta.
    // Por simplicidade inicial, vamos manter assim.

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Workout getWorkout() {
        return workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public UserRoutine getUserRoutine() {
        return userRoutine;
    }

    public void setUserRoutine(UserRoutine userRoutine) {
        this.userRoutine = userRoutine;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

