package com.hevyclone.app.auth.controller;

import com.hevyclone.app.auth.dto.JwtResponse;
import com.hevyclone.app.auth.dto.LoginRequest;
import com.hevyclone.app.auth.dto.RegisterRequest;
import com.hevyclone.app.auth.service.AuthService;
import com.hevyclone.app.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

// @CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthService authService;

    // Removidos Autowireds desnecessários que já estão no AuthService ou não são usados diretamente aqui
    // @Autowired
    // UserDetailsServiceImpl userDetailsService;
    // @Autowired
    // JwtUtils jwtUtils;
    // @Autowired
    // AuthenticationManager authenticationManager;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("AuthController: Recebida requisição de login para o usuário: {}", loginRequest.getUsername());
        try {
            String jwt = authService.authenticateUser(loginRequest);
            logger.info("AuthController: Autenticação bem-sucedida e token JWT gerado para o usuário: {}", loginRequest.getUsername());
            
            User user = authService.getUserByEmail(loginRequest.getUsername());
            logger.info("AuthController: Usuário {} encontrado para compor a resposta.", user.getUsername());

            return ResponseEntity.ok(new JwtResponse(jwt, user));
        } catch (AuthenticationException e) {
            logger.error("AuthController: Falha na autenticação para o usuário {}: {}", loginRequest.getUsername(), e.getMessage());
            // Retornar 401 explicitamente em caso de falha de autenticação
            return ResponseEntity.status(401).body("Erro de autenticação: " + e.getMessage());
        } catch (RuntimeException e) {
            // Captura outras exceções que podem ocorrer, como usuário não encontrado após autenticação (improvável mas seguro)
            logger.error("AuthController: Erro inesperado durante o login do usuário {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body("Erro no servidor: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("AuthController: Recebida requisição de registro para o usuário: {}", registerRequest.getUsername());
        try {
            User user = authService.registerUser(registerRequest);
            logger.info("AuthController: Usuário {} registrado com sucesso com ID: {}", user.getUsername(), user.getId());
            return ResponseEntity.ok("Usuário registrado com sucesso! ID: " + user.getId());
        } catch (RuntimeException e) {
            logger.error("AuthController: Falha no registro do usuário {}: {}", registerRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

