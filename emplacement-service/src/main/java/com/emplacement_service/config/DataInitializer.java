package com.emplacement_service.config;

import com.emplacement_service.entities.Utilisateur;
import com.emplacement_service.repo.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${admin.username}") String adminUsername,
                           @Value("${admin.password}") String adminPassword) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminPassword == null || adminPassword.isBlank() || adminPassword.length() < 8
                || "admin123".equals(adminPassword)) {
            throw new IllegalStateException(
                    "ADMIN_PASSWORD must be set to a strong password (at least 8 characters, " +
                    "not the default 'admin123').");
        }
        if (!utilisateurRepository.existsByUsername(adminUsername)) {
            utilisateurRepository.save(new Utilisateur(adminUsername, passwordEncoder.encode(adminPassword), "ADMIN"));
        }
    }
}
