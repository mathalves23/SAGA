package com.hevyclone.app.unit;

import com.hevyclone.app.auth.controller.AuthController;
import com.hevyclone.app.auth.dto.JwtResponse;
import com.hevyclone.app.auth.dto.LoginRequest;
import com.hevyclone.app.auth.dto.RegisterRequest;
import com.hevyclone.app.auth.service.AuthService;
import com.hevyclone.app.user.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.hamcrest.Matchers.containsString;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void authenticateUser_ShouldReturnJwtResponse_WhenCredentialsAreValid() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test@example.com");
        loginRequest.setPassword("password123");

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        String token = "jwt-token-123";

        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(token);
        when(authService.getUserByEmail("test@example.com")).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.username").value("testuser"));

        verify(authService).authenticateUser(any(LoginRequest.class));
        verify(authService).getUserByEmail("test@example.com");
    }

    @Test
    void authenticateUser_ShouldReturnUnauthorized_WhenCredentialsAreInvalid() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test@example.com");
        loginRequest.setPassword("wrongpassword");

        when(authService.authenticateUser(any(LoginRequest.class)))
                .thenThrow(new AuthenticationException("Invalid credentials") {});

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(containsString("Erro de autenticação")));

        verify(authService).authenticateUser(any(LoginRequest.class));
        verify(authService, never()).getUserByEmail(anyString());
    }

    @Test
    void authenticateUser_ShouldReturnBadRequest_WhenRuntimeExceptionOccurs() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test@example.com");
        loginRequest.setPassword("password123");

        when(authService.authenticateUser(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Server error"));

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Erro no servidor")));

        verify(authService).authenticateUser(any(LoginRequest.class));
    }

    @Test
    void registerUser_ShouldReturnSuccessMessage_WhenRegistrationIsSuccessful() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");

        User user = new User();
        user.setId(2L);
        user.setUsername("newuser");
        user.setEmail("newuser@example.com");

        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(user);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Usuário registrado com sucesso")))
                .andExpect(content().string(containsString("ID: 2")));

        verify(authService).registerUser(any(RegisterRequest.class));
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenRegistrationFails() throws Exception {
        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("existinguser");
        registerRequest.setEmail("existing@example.com");
        registerRequest.setPassword("password123");

        when(authService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email já existe"));

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email já existe"));

        verify(authService).registerUser(any(RegisterRequest.class));
    }

    @Test
    void authenticateUser_DirectCall_ShouldReturnJwtResponse() {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("test@example.com");
        loginRequest.setPassword("password123");

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        String token = "jwt-token-123";

        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(token);
        when(authService.getUserByEmail("test@example.com")).thenReturn(user);

        // When
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof JwtResponse);
        
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertEquals(token, jwtResponse.getToken());
        assertEquals(user, jwtResponse.getUser());
    }

    @Test
    void registerUser_DirectCall_ShouldReturnSuccessMessage() {
        // Given
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPassword("password123");

        User user = new User();
        user.setId(2L);
        user.setUsername("newuser");

        when(authService.registerUser(any(RegisterRequest.class))).thenReturn(user);

        // When
        ResponseEntity<?> response = authController.registerUser(registerRequest);

        // Then
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Usuário registrado com sucesso"));
        assertTrue(response.getBody().toString().contains("ID: 2"));
    }
} 