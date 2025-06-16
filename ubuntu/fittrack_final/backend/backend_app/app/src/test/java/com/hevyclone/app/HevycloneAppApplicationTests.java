package com.hevyclone.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class HevycloneAppApplicationTests {

	@Test
	void contextLoads() {
		// Este teste verifica se o contexto da aplicação carrega corretamente
		// Se chegou até aqui, significa que a aplicação foi iniciada com sucesso
	}

	@Test
	void applicationStartsSuccessfully() {
		// Teste adicional para verificar se a aplicação inicia sem erros
		// O fato do Spring conseguir carregar o contexto já é um bom indicador
	}
}
