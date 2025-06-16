package com.hevyclone.app.auth.service;

import com.hevyclone.app.auth.dto.LoginRequest;
import com.hevyclone.app.auth.dto.RegisterRequest;
import com.hevyclone.app.auth.security.JwtUtils;
import com.hevyclone.app.user.model.User;
import com.hevyclone.app.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public String authenticateUser(LoginRequest loginRequest) {
        logger.debug("Tentando autenticar o usuário: {}", loginRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            logger.debug("Autenticação bem-sucedida para o usuário: {}", loginRequest.getUsername());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            logger.debug("Token JWT gerado para o usuário: {}", loginRequest.getUsername());
            return jwt;
        } catch (AuthenticationException e) {
            logger.error("Falha na autenticação para o usuário {}: {}", loginRequest.getUsername(), e.getMessage());
            throw e; // Re-lança a exceção para ser tratada pelo Spring Security
        }
    }

    public User registerUser(RegisterRequest registerRequest) {
        logger.debug("Tentando registrar o usuário: {}", registerRequest.getUsername());
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            logger.warn("Falha no registro: Nome de usuário {} já está em uso", registerRequest.getUsername());
            throw new RuntimeException("Erro: Nome de usuário já está em uso!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Falha no registro: E-mail {} já está em uso", registerRequest.getEmail());
            throw new RuntimeException("Erro: E-mail já está em uso!");
        }

        User user = new User(registerRequest.getUsername(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()));
        logger.debug("Senha codificada para o usuário {}: {}", registerRequest.getUsername(), user.getPassword());

        User savedUser = userRepository.save(user);
        logger.info("Usuário {} registrado com sucesso com ID: {}", savedUser.getUsername(), savedUser.getId());
        return savedUser;
    }

    public User getUserByEmail(String email) {
        logger.debug("Buscando usuário pelo email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuário não encontrado com o email: {}", email);
                    return new RuntimeException("Usuário não encontrado com o email: " + email);
                });
    }
    
}

