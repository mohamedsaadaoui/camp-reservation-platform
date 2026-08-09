package com.emplacement_service.controller;

import com.emplacement_service.entities.Utilisateur;
import com.emplacement_service.repo.UtilisateurRepository;
import com.emplacement_service.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UtilisateurRepository utilisateurRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()
                || request.password() == null || request.password().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Nom d'utilisateur requis et mot de passe d'au moins 6 caractères"));
        }
        if (utilisateurRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Nom d'utilisateur déjà pris"));
        }
        Utilisateur user = new Utilisateur(request.username(), passwordEncoder.encode(request.password()), "USER");
        utilisateurRepository.save(user);
        return ResponseEntity.ok(authResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return utilisateurRepository.findByUsername(request.username())
                .filter(user -> passwordEncoder.matches(request.password(), user.getPassword()))
                .map(user -> ResponseEntity.ok(authResponse(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Identifiants invalides")));
    }

    private Map<String, Object> authResponse(Utilisateur user) {
        return Map.of(
                "token", jwtUtil.generateToken(user.getUsername(), user.getRole()),
                "username", user.getUsername(),
                "role", user.getRole());
    }

    record RegisterRequest(String username, String password) {
    }

    record LoginRequest(String username, String password) {
    }
}
