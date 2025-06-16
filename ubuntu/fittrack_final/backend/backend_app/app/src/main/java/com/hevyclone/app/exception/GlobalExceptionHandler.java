package com.hevyclone.app.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * Manipulador global de exceções para padronizar respostas de erro
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Trata exceções de validação de argumentos de método
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST,
                "Erro de validação",
                ((ServletWebRequest) request).getRequest().getRequestURI());
        apiError.setDebugMessage(errors.toString());
        
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata exceções de entidade não encontrada
     */
    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(
            EntityNotFoundException ex,
            WebRequest request) {
        
        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    /**
     * Trata exceções de violação de restrição
     */
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException ex,
            WebRequest request) {
        
        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST,
                "Erro de validação",
                ex);
        apiError.setPath(((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata exceções de violação de integridade de dados
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    protected ResponseEntity<Object> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            WebRequest request) {
        
        ApiError apiError = new ApiError(
                HttpStatus.CONFLICT,
                "Violação de integridade de dados",
                ex);
        apiError.setPath(((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.CONFLICT);
    }

    /**
     * Trata exceções de autenticação
     */
    @ExceptionHandler({AuthenticationException.class, BadCredentialsException.class})
    protected ResponseEntity<Object> handleAuthentication(
            Exception ex,
            WebRequest request) {
        
        ApiError apiError = new ApiError(
                HttpStatus.UNAUTHORIZED,
                "Falha na autenticação: " + ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Trata exceções de acesso negado
     */
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<Object> handleAccessDenied(
            AccessDeniedException ex,
            WebRequest request) {
        
        ApiError apiError = new ApiError(
                HttpStatus.FORBIDDEN,
                "Acesso negado: " + ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    /**
     * Trata todas as outras exceções não capturadas
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAllExceptions(
            Exception ex,
            WebRequest request) {
        
        log.error("Erro não tratado", ex);
        
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro interno no servidor",
                ((ServletWebRequest) request).getRequest().getRequestURI());
        
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
