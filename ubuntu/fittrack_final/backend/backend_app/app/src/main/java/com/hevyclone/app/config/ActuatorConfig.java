package com.hevyclone.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.actuate.web.exchanges.HttpExchangeRepository;
import org.springframework.boot.actuate.web.exchanges.InMemoryHttpExchangeRepository;

/**
 * Configuração do Spring Actuator para monitoramento e healthchecks
 */
@Configuration
public class ActuatorConfig {

    /**
     * Configura o repositório de trocas HTTP para o Actuator
     * 
     * @return repositório de trocas HTTP em memória
     */
    @Bean
    public HttpExchangeRepository httpTraceRepository() {
        return new InMemoryHttpExchangeRepository();
    }
}
