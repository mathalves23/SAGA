// src/main/java/com/hevyclone/app/HevycloneAppApplication.java
package com.hevyclone.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;  // <<<

@EnableScheduling  // <<< habilita @Scheduled
@SpringBootApplication(
)
public class HevycloneAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(HevycloneAppApplication.class, args);
	}
}
