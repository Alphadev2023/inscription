package com.inscription.inscription_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling   // ← ajoute cette annotation
public class InscriptionBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(InscriptionBackendApplication.class, args);
	}
}