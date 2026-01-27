package com.emplacement_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class EmplacementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmplacementServiceApplication.class, args);
	}

}
