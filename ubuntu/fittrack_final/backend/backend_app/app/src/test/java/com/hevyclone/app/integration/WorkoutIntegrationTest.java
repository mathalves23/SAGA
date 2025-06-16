package com.hevyclone.app.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hevyclone.app.HevycloneAppApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = HevycloneAppApplication.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class WorkoutIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;
    private String userId;
    private String workoutId;
    private String exerciseId;

    @BeforeEach
    void setUp() throws Exception {
        // Criar usuário e obter token para testes
        Map<String, Object> userData = new HashMap<>();
        userData.put("name", "Usuário Treino");
        userData.put("email", "treino@teste.com");
        userData.put("password", "senha123");

        MvcResult authResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userData)))
                .andExpect(status().isCreated())
                .andReturn();

        String authResponse = authResult.getResponse().getContentAsString();
        Map<String, Object> authJson = objectMapper.readValue(authResponse, Map.class);
        authToken = (String) authJson.get("token");
        
        Map<String, Object> user = (Map<String, Object>) authJson.get("user");
        userId = user.get("id").toString();
    }

    @Test
    @Order(1)
    void deveCriarTreinoCompletoComExerciciosESeries() throws Exception {
        // Fase 1: Criar treino
        Map<String, Object> workoutData = new HashMap<>();
        workoutData.put("name", "Treino de Peito Integração");
        workoutData.put("description", "Treino focado em peitoral para teste de integração");
        workoutData.put("category", "STRENGTH");

        MvcResult workoutResult = mockMvc.perform(post("/api/workouts")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Treino de Peito Integração"))
                .andExpect(jsonPath("$.description").value("Treino focado em peitoral para teste de integração"))
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.exercises").isEmpty())
                .andReturn();

        String workoutResponse = workoutResult.getResponse().getContentAsString();
        Map<String, Object> workoutJson = objectMapper.readValue(workoutResponse, Map.class);
        workoutId = workoutJson.get("id").toString();

        // Fase 2: Adicionar primeiro exercício
        Map<String, Object> exercise1Data = new HashMap<>();
        exercise1Data.put("name", "Supino Reto");
        exercise1Data.put("muscleGroup", "CHEST");
        exercise1Data.put("equipment", "BARBELL");

        MvcResult exercise1Result = mockMvc.perform(post("/api/workouts/{workoutId}/exercises", workoutId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exercise1Data)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Supino Reto"))
                .andExpect(jsonPath("$.muscleGroup").value("CHEST"))
                .andReturn();

        String exercise1Response = exercise1Result.getResponse().getContentAsString();
        Map<String, Object> exercise1Json = objectMapper.readValue(exercise1Response, Map.class);
        exerciseId = exercise1Json.get("id").toString();

        // Fase 3: Adicionar séries ao exercício
        List<Map<String, Object>> setsData = new ArrayList<>();
        
        Map<String, Object> set1 = new HashMap<>();
        set1.put("reps", 12);
        set1.put("weight", 80.0);
        set1.put("restTime", 60); // segundos
        setsData.add(set1);

        Map<String, Object> set2 = new HashMap<>();
        set2.put("reps", 10);
        set2.put("weight", 85.0);
        set2.put("restTime", 60);
        setsData.add(set2);

        Map<String, Object> set3 = new HashMap<>();
        set3.put("reps", 8);
        set3.put("weight", 90.0);
        set3.put("restTime", 90);
        setsData.add(set3);

        mockMvc.perform(post("/api/workouts/{workoutId}/exercises/{exerciseId}/sets", workoutId, exerciseId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(setsData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].reps").value(12))
                .andExpect(jsonPath("$[0].weight").value(80.0))
                .andExpect(jsonPath("$[1].reps").value(10))
                .andExpect(jsonPath("$[2].weight").value(90.0));

        // Fase 4: Adicionar segundo exercício
        Map<String, Object> exercise2Data = new HashMap<>();
        exercise2Data.put("name", "Supino Inclinado");
        exercise2Data.put("muscleGroup", "CHEST");
        exercise2Data.put("equipment", "DUMBBELL");

        mockMvc.perform(post("/api/workouts/{workoutId}/exercises", workoutId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exercise2Data)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Supino Inclinado"));

        // Fase 5: Verificar treino completo
        mockMvc.perform(get("/api/workouts/{id}", workoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(workoutId))
                .andExpect(jsonPath("$.name").value("Treino de Peito Integração"))
                .andExpect(jsonPath("$.exercises", hasSize(2)))
                .andExpect(jsonPath("$.exercises[0].name").value("Supino Reto"))
                .andExpect(jsonPath("$.exercises[0].sets", hasSize(3)))
                .andExpect(jsonPath("$.exercises[1].name").value("Supino Inclinado"));
    }

    @Test
    @Order(2)
    void deveExecutarTreinoCompleto() throws Exception {
        // Primeiro criar um treino
        Map<String, Object> workoutData = new HashMap<>();
        workoutData.put("name", "Treino para Execução");
        workoutData.put("description", "Treino que será executado");
        
        MvcResult workoutResult = mockMvc.perform(post("/api/workouts")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> workoutJson = objectMapper.readValue(
            workoutResult.getResponse().getContentAsString(), Map.class);
        String testWorkoutId = workoutJson.get("id").toString();

        // Iniciar sessão de treino
        mockMvc.perform(post("/api/workouts/{id}/start", testWorkoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.startedAt").exists());

        // Verificar status do treino
        mockMvc.perform(get("/api/workouts/{id}/status", testWorkoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // Completar um exercício (simular execução)
        Map<String, Object> progressData = new HashMap<>();
        progressData.put("exerciseId", exerciseId);
        progressData.put("completedSets", 3);
        progressData.put("notes", "Treino executado com sucesso");

        mockMvc.perform(post("/api/workouts/{id}/progress", testWorkoutId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(progressData)))
                .andExpect(status().isOk());

        // Finalizar treino
        Map<String, Object> finishData = new HashMap<>();
        finishData.put("notes", "Treino finalizado com sucesso");
        finishData.put("duration", 3600); // 1 hora em segundos

        mockMvc.perform(post("/api/workouts/{id}/finish", testWorkoutId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finishData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.completedAt").exists())
                .andExpect(jsonPath("$.duration").value(3600));
    }

    @Test
    @Order(3)
    void deveBuscarHistoricoDeTreelainxos() throws Exception {
        // Criar alguns treinos para o histórico
        String[] workoutNames = {
            "Treino Histórico 1",
            "Treino Histórico 2", 
            "Treino Histórico 3"
        };

        List<String> createdWorkoutIds = new ArrayList<>();

        for (String name : workoutNames) {
            Map<String, Object> workoutData = new HashMap<>();
            workoutData.put("name", name);
            workoutData.put("description", "Treino para histórico");

            MvcResult result = mockMvc.perform(post("/api/workouts")
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(workoutData)))
                    .andExpect(status().isCreated())
                    .andReturn();

            Map<String, Object> json = objectMapper.readValue(
                result.getResponse().getContentAsString(), Map.class);
            createdWorkoutIds.add(json.get("id").toString());

            // Simular execução e finalização do treino
            mockMvc.perform(post("/api/workouts/{id}/start", json.get("id"))
                    .header("Authorization", "Bearer " + authToken))
                    .andExpect(status().isOk());

            mockMvc.perform(post("/api/workouts/{id}/finish", json.get("id"))
                    .header("Authorization", "Bearer " + authToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(Map.of("duration", 1800))))
                    .andExpect(status().isOk());
        }

        // Buscar histórico completo
        mockMvc.perform(get("/api/workouts/history")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(3)));

        // Buscar histórico com paginação
        mockMvc.perform(get("/api/workouts/history?page=0&size=2")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.pageable.pageSize").value(2))
                .andExpect(jsonPath("$.pageable.pageNumber").value(0));

        // Buscar histórico por período
        mockMvc.perform(get("/api/workouts/history?startDate=2024-01-01&endDate=2024-12-31")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Buscar estatísticas de treinos
        mockMvc.perform(get("/api/workouts/statistics")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalWorkouts").value(greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$.completedWorkouts").value(greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$.averageDuration").exists());
    }

    @Test
    @Order(4)
    void deveCompartilharECurtirTreeino() throws Exception {
        // Criar treino para compartilhar
        Map<String, Object> workoutData = new HashMap<>();
        workoutData.put("name", "Treino Compartilhado");
        workoutData.put("description", "Treino que será compartilhado");
        workoutData.put("public", true);

        MvcResult workoutResult = mockMvc.perform(post("/api/workouts")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> workoutJson = objectMapper.readValue(
            workoutResult.getResponse().getContentAsString(), Map.class);
        String sharedWorkoutId = workoutJson.get("id").toString();

        // Compartilhar treino
        Map<String, Object> shareData = new HashMap<>();
        shareData.put("message", "Compartilhando meu treino de hoje!");
        shareData.put("platforms", Arrays.asList("FEED", "SOCIAL"));

        mockMvc.perform(post("/api/workouts/{id}/share", sharedWorkoutId)
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shareData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shared").value(true))
                .andExpect(jsonPath("$.shareUrl").exists());

        // Criar segundo usuário para curtir
        Map<String, Object> user2Data = new HashMap<>();
        user2Data.put("name", "Usuário 2");
        user2Data.put("email", "user2@teste.com");
        user2Data.put("password", "senha123");

        MvcResult auth2Result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2Data)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> auth2Json = objectMapper.readValue(
            auth2Result.getResponse().getContentAsString(), Map.class);
        String authToken2 = (String) auth2Json.get("token");

        // Curtir treino com segundo usuário
        mockMvc.perform(post("/api/workouts/{id}/like", sharedWorkoutId)
                .header("Authorization", "Bearer " + authToken2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(true))
                .andExpect(jsonPath("$.likesCount").value(1));

        // Comentar no treino
        Map<String, Object> commentData = new HashMap<>();
        commentData.put("text", "Ótimo treino! Vou tentar também.");

        mockMvc.perform(post("/api/workouts/{id}/comments", sharedWorkoutId)
                .header("Authorization", "Bearer " + authToken2)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(commentData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Ótimo treino! Vou tentar também."))
                .andExpect(jsonPath("$.author").exists());

        // Verificar treino com likes e comentários
        mockMvc.perform(get("/api/workouts/{id}", sharedWorkoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.likesCount").value(1))
                .andExpect(jsonPath("$.commentsCount").value(1))
                .andExpect(jsonPath("$.comments", hasSize(1)));
    }

    @Test
    @Order(5)
    void deveValidarPermissoesDeAcesso() throws Exception {
        // Criar treino privado
        Map<String, Object> privateWorkoutData = new HashMap<>();
        privateWorkoutData.put("name", "Treino Privado");
        privateWorkoutData.put("description", "Treino apenas para o dono");
        privateWorkoutData.put("public", false);

        MvcResult privateResult = mockMvc.perform(post("/api/workouts")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(privateWorkoutData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> privateJson = objectMapper.readValue(
            privateResult.getResponse().getContentAsString(), Map.class);
        String privateWorkoutId = privateJson.get("id").toString();

        // Criar outro usuário
        Map<String, Object> otherUserData = new HashMap<>();
        otherUserData.put("name", "Outro Usuário");
        otherUserData.put("email", "outro@teste.com");
        otherUserData.put("password", "senha123");

        MvcResult otherAuthResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(otherUserData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> otherAuthJson = objectMapper.readValue(
            otherAuthResult.getResponse().getContentAsString(), Map.class);
        String otherAuthToken = (String) otherAuthJson.get("token");

        // Tentar acessar treino privado com outro usuário - deve falhar
        mockMvc.perform(get("/api/workouts/{id}", privateWorkoutId)
                .header("Authorization", "Bearer " + otherAuthToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value(containsString("Acesso negado")));

        // Tentar editar treino de outro usuário - deve falhar
        Map<String, Object> updateData = new HashMap<>();
        updateData.put("name", "Nome Alterado");

        mockMvc.perform(put("/api/workouts/{id}", privateWorkoutId)
                .header("Authorization", "Bearer " + otherAuthToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isForbidden());

        // Dono deve conseguir acessar normalmente
        mockMvc.perform(get("/api/workouts/{id}", privateWorkoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Treino Privado"));
    }

    @Test
    @Order(6)
    void deveLidarComOperacoesConcorrentes() throws Exception {
        // Criar treino para teste de concorrência
        Map<String, Object> workoutData = new HashMap<>();
        workoutData.put("name", "Treino Concorrente");
        workoutData.put("description", "Teste de concorrência");

        MvcResult workoutResult = mockMvc.perform(post("/api/workouts")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(workoutData)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<String, Object> workoutJson = objectMapper.readValue(
            workoutResult.getResponse().getContentAsString(), Map.class);
        String concurrentWorkoutId = workoutJson.get("id").toString();

        // Simular múltiplas operações concorrentes
        List<Thread> threads = new ArrayList<>();

        // Thread 1: Iniciar treino
        threads.add(new Thread(() -> {
            try {
                mockMvc.perform(post("/api/workouts/{id}/start", concurrentWorkoutId)
                        .header("Authorization", "Bearer " + authToken))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Em cenário real, logar erro
            }
        }));

        // Thread 2: Buscar detalhes do treino
        threads.add(new Thread(() -> {
            try {
                mockMvc.perform(get("/api/workouts/{id}", concurrentWorkoutId)
                        .header("Authorization", "Bearer " + authToken))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Em cenário real, logar erro
            }
        }));

        // Thread 3: Atualizar progresso
        threads.add(new Thread(() -> {
            try {
                Map<String, Object> progressData = new HashMap<>();
                progressData.put("notes", "Progresso concurrent");
                
                mockMvc.perform(post("/api/workouts/{id}/progress", concurrentWorkoutId)
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(progressData)))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Em cenário real, logar erro
            }
        }));

        // Executar threads
        threads.forEach(Thread::start);

        // Aguardar conclusão
        for (Thread thread : threads) {
            thread.join();
        }

        // Verificar consistência final
        mockMvc.perform(get("/api/workouts/{id}", concurrentWorkoutId)
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Treino Concorrente"));
    }
} 