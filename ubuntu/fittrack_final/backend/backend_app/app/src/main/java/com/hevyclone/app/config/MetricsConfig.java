package com.hevyclone.app.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * Configuração de métricas para monitoramento da aplicação
 */
@Configuration
@EnableAspectJAutoProxy
public class MetricsConfig {

    /**
     * Configura o aspecto de tempo para métricas de performance
     * @param registry Registro de métricas
     * @return TimedAspect configurado
     */
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
