package com.hevyclone.app.model.routine;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hevyclone.app.model.exercise.Exercise;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "workouts") // Um treino específico dentro de uma rotina (ex: Dia A, Dia B)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Treino A - Peito e Tríceps"

    private String dayOfWeek; // Opcional, para rotinas com dias fixos (Segunda, Terça...)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    @JsonIgnore // Evita referência circular na serialização JSON
    private Routine routine;

    // Relacionamento com Exercícios do Treino (WorkoutExercise) - Um para Muitos
    // Um Workout tem uma lista de WorkoutExercise (que define a ordem, séries, repetições de um Exercise específico)
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkoutExercise> workoutExercises;

    // Construtores
    public Workout() {}

    public Workout(String name, String dayOfWeek, Routine routine) {
        this.name = name;
        this.dayOfWeek = dayOfWeek;
        this.routine = routine;
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

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Routine getRoutine() {
        return routine;
    }

    public void setRoutine(Routine routine) {
        this.routine = routine;
    }

    public List<WorkoutExercise> getWorkoutExercises() {
        return workoutExercises;
    }

    public void setWorkoutExercises(List<WorkoutExercise> workoutExercises) {
        this.workoutExercises = workoutExercises;
    }
}

