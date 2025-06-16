package com.hevyclone.app.service.routine;

import com.hevyclone.app.model.profile.UserProfileLevel;
import com.hevyclone.app.model.routine.Routine;
import com.hevyclone.app.model.routine.Workout;
import com.hevyclone.app.model.routine.WorkoutExercise;
import com.hevyclone.app.model.exercise.Exercise;
import com.hevyclone.app.repository.routine.RoutineRepository;
import com.hevyclone.app.repository.routine.WorkoutRepository;
import com.hevyclone.app.repository.exercise.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public List<Routine> getAllRoutines() {
        return routineRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Routine> getRoutineById(Long id) {
        return routineRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Routine> getRoutineWithDetails(Long id) {
        // 1. Carregar rotina com workouts básicos
        Optional<Routine> routineOpt = routineRepository.findByIdWithWorkouts(id);
        
        if (routineOpt.isPresent()) {
            // 2. Carregar workouts com seus exercises
            routineRepository.findWorkoutsWithExercisesByRoutineId(id);
            
            // 3. Carregar os detalhes completos dos exercícios
            routineRepository.findWorkoutExercisesWithDetailsByRoutineId(id);
            
            // Todos os dados agora estão no cache do Hibernate e serão serializados corretamente
        }
        
        return routineOpt;
    }

    @Transactional
    public Routine createRoutine(Routine routine) {
        // Log para debug
        System.out.println("RoutineService.createRoutine: Recebida rotina com nome: " + routine.getName());
        System.out.println("RoutineService.createRoutine: Division: " + routine.getDivision());
        System.out.println("RoutineService.createRoutine: TargetProfileLevel: " + routine.getTargetProfileLevel());
        System.out.println("RoutineService.createRoutine: DurationWeeks: " + routine.getDurationWeeks());
        
        // Validações antes de salvar
        if (routine.getName() == null || routine.getName().trim().isEmpty()) {
            throw new RuntimeException("O nome da rotina é obrigatório");
        }
        
        // Se division não for fornecida, usar valor padrão
        if (routine.getDivision() == null || routine.getDivision().trim().isEmpty()) {
            routine.setDivision("CUSTOM");
        }
        
        // Validar se o targetProfileLevel é válido
        if (routine.getTargetProfileLevel() == null) {
            throw new RuntimeException("O nível do perfil é obrigatório");
        }
        
        // Validar se já existe uma rotina com o mesmo nome
        // Nota: Para implementar esta validação, seria necessário adicionar um método no repository
        // Optional<Routine> existingRoutine = routineRepository.findByName(routine.getName());
        // if (existingRoutine.isPresent()) {
        //     throw new RuntimeException("Já existe uma rotina com este nome");
        // }
        
        System.out.println("RoutineService.createRoutine: Validações passaram, salvando rotina...");
        Routine savedRoutine = routineRepository.save(routine);
        System.out.println("RoutineService.createRoutine: Rotina salva com ID: " + savedRoutine.getId());
        
        return savedRoutine;
    }

    @Transactional
    public Routine updateRoutine(Long id, Routine routineDetails) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rotina não encontrada com o id: " + id));

        routine.setName(routineDetails.getName());
        routine.setDescription(routineDetails.getDescription());
        routine.setDurationWeeks(routineDetails.getDurationWeeks());
        routine.setDivision(routineDetails.getDivision());
        routine.setTargetProfileLevel(routineDetails.getTargetProfileLevel());
        // Workouts são gerenciados via WorkoutService e WorkoutController, 
        // mas a relação é definida aqui se a rotina for atualizada com uma nova lista de workouts.
        // No entanto, geralmente, os workouts são adicionados/removidos de uma rotina existente.
        // Se routineDetails.getWorkouts() não for nulo, pode-se atualizar a lista.
        if (routineDetails.getWorkouts() != null) {
            // É preciso cuidado aqui para gerenciar o estado dos workouts (novos, removidos, atualizados)
            // Esta é uma simplificação. Uma abordagem mais robusta seria ter endpoints específicos para gerenciar workouts em uma rotina.
            routine.setWorkouts(routineDetails.getWorkouts());
        }

        return routineRepository.save(routine);
    }

    @Transactional
    public void deleteRoutine(Long id) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rotina não encontrada com o id: " + id));
        routineRepository.delete(routine);
    }

    // Métodos de busca personalizados (exemplos baseados nos comentários do Repository)
    @Transactional(readOnly = true)
    public List<Routine> findRoutinesByTargetProfileLevel(UserProfileLevel level) {
        // Implementar quando necessário - por ora retornando lista vazia
        return routineRepository.findAll().stream()
                .filter(routine -> routine.getTargetProfileLevel() == level)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<Routine> findRoutinesByNameContaining(String name) {
        // Implementar quando necessário - por ora retornando lista vazia
        return routineRepository.findAll().stream()
                .filter(routine -> routine.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
    }

    // Novo método para criar rotina completa com workouts e exercícios
    @Transactional
    public Routine createCompleteRoutine(RoutineCreationDTO routineDTO) {
        System.out.println("RoutineService.createCompleteRoutine: Iniciando criação de rotina completa");
        
        // 1. Criar e salvar a rotina básica
        Routine routine = new Routine();
        routine.setName(routineDTO.getName());
        routine.setDescription(routineDTO.getDescription());
        routine.setTargetProfileLevel(routineDTO.getTargetProfileLevel());
        routine.setDurationWeeks(routineDTO.getDurationWeeks());
        routine.setDivision(routineDTO.getDivision());
        
        routine = routineRepository.save(routine);
        System.out.println("RoutineService.createCompleteRoutine: Rotina básica criada com ID: " + routine.getId());
        
        // 2. Criar workouts se fornecidos
        if (routineDTO.getWorkouts() != null && !routineDTO.getWorkouts().isEmpty()) {
            List<Workout> workouts = new ArrayList<>();
            
            for (WorkoutCreationDTO workoutDTO : routineDTO.getWorkouts()) {
                Workout workout = new Workout();
                workout.setName(workoutDTO.getName());
                workout.setDayOfWeek(workoutDTO.getDayOfWeek());
                workout.setRoutine(routine);
                
                workout = workoutRepository.save(workout);
                System.out.println("RoutineService.createCompleteRoutine: Workout criado: " + workout.getName());
                
                // 3. Criar workout exercises se fornecidos
                if (workoutDTO.getExercises() != null && !workoutDTO.getExercises().isEmpty()) {
                    List<WorkoutExercise> workoutExercises = new ArrayList<>();
                    
                    for (WorkoutExerciseCreationDTO exerciseDTO : workoutDTO.getExercises()) {
                        // Buscar o exercício por ID
                        Optional<Exercise> exerciseOpt = exerciseRepository.findById(exerciseDTO.getExerciseId());
                        if (exerciseOpt.isPresent()) {
                            WorkoutExercise workoutExercise = new WorkoutExercise();
                            workoutExercise.setWorkout(workout);
                            workoutExercise.setExercise(exerciseOpt.get());
                            workoutExercise.setOrder(exerciseDTO.getOrder());
                            workoutExercise.setSets(exerciseDTO.getSets());
                            workoutExercise.setReps(exerciseDTO.getReps());
                            workoutExercise.setRestTime(exerciseDTO.getRestTime());
                            
                            workoutExercises.add(workoutExercise);
                            System.out.println("RoutineService.createCompleteRoutine: Exercise adicionado ao workout");
                        } else {
                            System.err.println("RoutineService.createCompleteRoutine: Exercício não encontrado com ID: " + exerciseDTO.getExerciseId());
                        }
                    }
                    
                    workout.setWorkoutExercises(workoutExercises);
                }
                
                workouts.add(workout);
            }
            
            routine.setWorkouts(workouts);
        }
        
        System.out.println("RoutineService.createCompleteRoutine: Rotina completa criada com sucesso!");
        return routine;
    }

    // Classes DTO para estruturar os dados de entrada
    public static class RoutineCreationDTO {
        private String name;
        private String description;
        private UserProfileLevel targetProfileLevel;
        private Integer durationWeeks;
        private String division;
        private List<WorkoutCreationDTO> workouts;
        
        // Getters e Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public UserProfileLevel getTargetProfileLevel() { return targetProfileLevel; }
        public void setTargetProfileLevel(UserProfileLevel targetProfileLevel) { this.targetProfileLevel = targetProfileLevel; }
        
        public Integer getDurationWeeks() { return durationWeeks; }
        public void setDurationWeeks(Integer durationWeeks) { this.durationWeeks = durationWeeks; }
        
        public String getDivision() { return division; }
        public void setDivision(String division) { this.division = division; }
        
        public List<WorkoutCreationDTO> getWorkouts() { return workouts; }
        public void setWorkouts(List<WorkoutCreationDTO> workouts) { this.workouts = workouts; }
    }
    
    public static class WorkoutCreationDTO {
        private String name;
        private String dayOfWeek;
        private List<WorkoutExerciseCreationDTO> exercises;
        
        // Getters e Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        
        public List<WorkoutExerciseCreationDTO> getExercises() { return exercises; }
        public void setExercises(List<WorkoutExerciseCreationDTO> exercises) { this.exercises = exercises; }
    }
    
    public static class WorkoutExerciseCreationDTO {
        private Long exerciseId;
        private Integer order;
        private String sets;
        private String reps;
        private String restTime;
        
        // Getters e Setters
        public Long getExerciseId() { return exerciseId; }
        public void setExerciseId(Long exerciseId) { this.exerciseId = exerciseId; }
        
        public Integer getOrder() { return order; }
        public void setOrder(Integer order) { this.order = order; }
        
        public String getSets() { return sets; }
        public void setSets(String sets) { this.sets = sets; }
        
        public String getReps() { return reps; }
        public void setReps(String reps) { this.reps = reps; }
        
        public String getRestTime() { return restTime; }
        public void setRestTime(String restTime) { this.restTime = restTime; }
    }
}

