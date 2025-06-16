package com.hevyclone.app.model.routine;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hevyclone.app.model.profile.UserProfileLevel;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "routines") // Plano de treino completo
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Rotina de Hipertrofia - Intermediário"

    private String description; // Descrição opcional da rotina

    @Column(name = "duration_weeks")
    private Integer durationWeeks; // Duração da rotina em semanas

    private String division; // Ex: "ABC", "ABCDE", "Upper/Lower"

    @Enumerated(EnumType.STRING)
    @Column(name = "target_profile_level")
    private UserProfileLevel targetProfileLevel; // Nível alvo da rotina (INICIANTE, INTERMEDIARIO, AVANCADO)

    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Workout> workouts; // Lista de treinos desta rotina

    // Construtores
    public Routine() {}

    public Routine(String name, String description, Integer durationWeeks, String division, UserProfileLevel targetProfileLevel) {
        this.name = name;
        this.description = description;
        this.durationWeeks = durationWeeks;
        this.division = division;
        this.targetProfileLevel = targetProfileLevel;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(Integer durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public UserProfileLevel getTargetProfileLevel() {
        return targetProfileLevel;
    }

    public void setTargetProfileLevel(UserProfileLevel targetProfileLevel) {
        this.targetProfileLevel = targetProfileLevel;
    }

    public List<Workout> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(List<Workout> workouts) {
        this.workouts = workouts;
    }
}

