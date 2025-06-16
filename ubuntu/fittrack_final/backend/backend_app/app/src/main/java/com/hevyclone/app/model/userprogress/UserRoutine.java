package com.hevyclone.app.model.userprogress;

import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.user.model.User;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_routines")
public class UserRoutine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate; // Pode ser nulo se a rotina estiver ativa

    @Column(nullable = false)
    private boolean active = true; // Indica se esta é a rotina ativa do usuário

    // Poderia ter campos para progresso geral, ex: "semana_atual", "dias_completos_na_semana"
    // Mas para marcar treinos como "realizados", precisaremos de outra entidade (UserWorkoutLog)

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

    public Routine getRoutine() {
        return routine;
    }

    public void setRoutine(Routine routine) {
        this.routine = routine;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

