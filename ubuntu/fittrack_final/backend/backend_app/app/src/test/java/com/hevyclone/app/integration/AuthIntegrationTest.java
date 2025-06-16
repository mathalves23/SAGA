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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest(classes = HevycloneAppApplication.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Transactional
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String userEmail = "integration@teste.com";
    private String userPassword = "senha123";
    private String userName = "Usuário Integração";
    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        // Limpar dados de teste se necessário
        authToken = null;
    }

    @Test
    @Order(1)
    void deveRealizarFluxoCompletoDeRegistroELogin() throws Exception {
        // Fase 1: Registrar novo usuário
        Map<String, Object> registerData = new HashMap<>();
        registerData.put("name", userName);
        registerData.put("email", userEmail);
        registerData.put("password", userPassword);

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerData)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value(userName))
                .andExpect(jsonPath("$.user.email").value(userEmail))
                .andExpect(jsonPath("$.user.id").exists())
                .andReturn();

        // Extrair token do registro
        String registerResponse = registerResult.getResponse().getContentAsString();
        Map<String, Object> registerJson = objectMapper.readValue(registerResponse, Map.class);
        String registerToken = (String) registerJson.get("token");

        // Fase 2: Fazer logout
        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer " + registerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout realizado com sucesso"));

        // Fase 3: Fazer login com as mesmas credenciais
        Map<String, Object> loginData = new HashMap<>();
        loginData.put("email", userEmail);
        loginData.put("password", userPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value(userName))
                .andExpect(jsonPath("$.user.email").value(userEmail))
                .andExpect(jsonPath("$.user.id").exists())
                .andReturn();

        // Extrair token do login
        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, Object> loginJson = objectMapper.readValue(loginResponse, Map.class);
        authToken = (String) loginJson.get("token");

        // Fase 4: Verificar perfil com token válido
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(userName))
                .andExpect(jsonPath("$.email").value(userEmail));
    }

    @Test
    @Order(2)
    void deveRejeitarCredenciaisInvalidas() throws Exception {
        // Tentar login com email inválido
        Map<String, Object> invalidEmailData = new HashMap<>();
        invalidEmailData.put("email", "email@inexistente.com");
        invalidEmailData.put("password", "qualquersenha");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidEmailData)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(containsString("Credenciais inválidas")));

        // Tentar login com senha inválida
        Map<String, Object> invalidPasswordData = new HashMap<>();
        invalidPasswordData.put("email", userEmail);
        invalidPasswordData.put("password", "senhaerrada");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidPasswordData)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(containsString("Credenciais inválidas")));
    }

    @Test
    @Order(3)
    void deveValidarDadosDeRegistro() throws Exception {
        // Email já existente
        Map<String, Object> duplicateEmailData = new HashMap<>();
        duplicateEmailData.put("name", "Outro Usuário");
        duplicateEmailData.put("email", userEmail); // Email já usado
        duplicateEmailData.put("password", "outrasenha");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateEmailData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Email já cadastrado")));

        // Dados inválidos - email vazio
        Map<String, Object> invalidData = new HashMap<>();
        invalidData.put("name", "Nome Válido");
        invalidData.put("email", "");
        invalidData.put("password", "senha123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());

        // Senha muito curta
        Map<String, Object> shortPasswordData = new HashMap<>();
        shortPasswordData.put("name", "Nome Válido");
        shortPasswordData.put("email", "novo@email.com");
        shortPasswordData.put("password", "123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shortPasswordData)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.password").exists());
    }

    @Test
    @Order(4)
    void deveRejeitarTokenInvalido() throws Exception {
        // Token malformado
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(containsString("Token inválido")));

        // Token expirado (simulado)
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE2MDk0NTkyMDB9.invalid"))
                .andExpect(status().isUnauthorized());

        // Sem token
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void deveRenovarTokenValido() throws Exception {
        // Primeiro, fazer login
        Map<String, Object> loginData = new HashMap<>();
        loginData.put("email", userEmail);
        loginData.put("password", userPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, Object> loginJson = objectMapper.readValue(loginResponse, Map.class);
        String token = (String) loginJson.get("token");

        // Renovar token
        mockMvc.perform(post("/api/auth/refresh")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").value(not(token))) // Deve ser um token diferente
                .andExpect(jsonPath("$.user").exists());
    }

    @Test
    @Order(6)
    void deveManterSessaoAposMultiplasOperacoes() throws Exception {
        // Login
        Map<String, Object> loginData = new HashMap<>();
        loginData.put("email", userEmail);
        loginData.put("password", userPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, Object> loginJson = objectMapper.readValue(loginResponse, Map.class);
        String sessionToken = (String) loginJson.get("token");

        // Múltiplas operações com o mesmo token
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(get("/api/auth/me")
                    .header("Authorization", "Bearer " + sessionToken))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(userEmail));

            // Simular operação que requer autenticação
            mockMvc.perform(get("/api/users/profile")
                    .header("Authorization", "Bearer " + sessionToken))
                    .andExpect(status().isOk());

            Thread.sleep(100); // Pequena pausa entre operações
        }

        // Verificar que o token ainda é válido após múltiplas operações
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + sessionToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(userEmail));
    }

    @Test
    @Order(7)
    void deveLidarComOperacoesConcorrentes() throws Exception {
        // Login
        Map<String, Object> loginData = new HashMap<>();
        loginData.put("email", userEmail);
        loginData.put("password", userPassword);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        Map<String, Object> loginJson = objectMapper.readValue(loginResponse, Map.class);
        String concurrentToken = (String) loginJson.get("token");

        // Simular requisições concorrentes
        Thread t1 = new Thread(() -> {
            try {
                mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + concurrentToken))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Log error in real scenario
            }
        });

        Thread t2 = new Thread(() -> {
            try {
                mockMvc.perform(get("/api/users/profile")
                        .header("Authorization", "Bearer " + concurrentToken))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Log error in real scenario
            }
        });

        Thread t3 = new Thread(() -> {
            try {
                mockMvc.perform(post("/api/auth/refresh")
                        .header("Authorization", "Bearer " + concurrentToken))
                        .andExpect(status().isOk());
            } catch (Exception e) {
                // Log error in real scenario
            }
        });

        // Executar threads concorrentemente
        t1.start();
        t2.start();
        t3.start();

        // Aguardar conclusão
        t1.join();
        t2.join();
        t3.join();

        // Verificar que o sistema mantém consistência
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + concurrentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(userEmail));
    }
} 