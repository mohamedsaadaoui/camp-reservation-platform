package com.emplacement_service.controller;

import com.emplacement_service.entities.Emplacement;
import com.emplacement_service.feign.Reservation;
import com.emplacement_service.feign.ReservationServiceClient;
import com.emplacement_service.repo.EmplacementRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/emplacements")
@CrossOrigin(origins = "http://localhost:4200") // ✅ important si pas de proxy
public class EmplacementController {

    @Autowired
    private EmplacementRepository emplacementRepository;

    @Autowired
    private ReservationServiceClient reservationClient;

    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping
    public List<Emplacement> getAllEmplacements() {
        return emplacementRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emplacement> getEmplacementById(@PathVariable Long id) {
        return emplacementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/disponibles")
    public List<Emplacement> getEmplacementsDisponibles() {
        return emplacementRepository.findByDisponibleTrue();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Emplacement createEmplacement(@RequestBody Emplacement emplacement) {
        return emplacementRepository.save(emplacement);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEmplacement(@PathVariable Long id, @RequestBody Emplacement details) {
        Optional<Emplacement> existingOpt = emplacementRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Emplacement existing = existingOpt.get();
        existing.setNom(details.getNom());
        existing.setNumero(details.getNumero());
        existing.setType(details.getType());
        existing.setPrix(details.getPrix());
        existing.setDisponible(details.isDisponible());
        existing.setLatitude(details.getLatitude());
        existing.setLongitude(details.getLongitude());
        existing.setDescription(details.getDescription());
        existing.setCapacite(details.getCapacite());
        existing.setSuperficie(details.getSuperficie());
        existing.setEquipements(details.getEquipements());
        return ResponseEntity.ok(emplacementRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmplacement(@PathVariable Long id) {
        if (!emplacementRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        emplacementRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Emplacement> emplacementOpt = emplacementRepository.findById(id);
        if (emplacementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier vide");
        }
        try {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            Emplacement emplacement = emplacementOpt.get();
            emplacement.setImageUrl("/uploads/" + fileName);
            emplacementRepository.save(emplacement);
            return ResponseEntity.ok(emplacement.getImageUrl());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload de l'image");
        }
    }

    @PostMapping("/reserver")
    public ResponseEntity<?> reserverEmplacement(@RequestBody Reservation reservation) {
        try {
            Reservation res = reservationClient.createReservation(reservation);
            return ResponseEntity.ok(res);
        } catch (FeignException e) {
            return ResponseEntity.status(e.status()).body(e.getMessage());
        }
    }

    // SCÉNARIO 1: Récupérer un emplacement avec ses réservations
    @GetMapping("/{id}/with-reservations")
    public ResponseEntity<?> getEmplacementWithReservations(@PathVariable Long id) {
        try {
            Optional<Emplacement> emplacementOpt = emplacementRepository.findById(id);
            if (emplacementOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Emplacement emplacement = emplacementOpt.get();
            List<Reservation> reservations = reservationClient.getReservationsByEmplacement(id.toString());

            Map<String, Object> response = new HashMap<>();
            response.put("emplacement", emplacement);
            response.put("reservations", reservations);
            response.put("nombreReservations", reservations.size());
            response.put("message", "Communication Feign réussie - Scénario 1");

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }

    // SCÉNARIO 2: Vérifier la disponibilité d'un emplacement
    @GetMapping("/{id}/disponible")
    public ResponseEntity<?> verifierDisponibilite(@PathVariable Long id,
                                                   @RequestParam String dateDebut,
                                                   @RequestParam String dateFin) {
        try {
            Optional<Emplacement> emplacementOpt = emplacementRepository.findById(id);
            if (emplacementOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Boolean disponible = reservationClient.verifierDisponibilite(
                    id.toString(), dateDebut, dateFin);

            Emplacement emplacement = emplacementOpt.get();

            Map<String, Object> response = new HashMap<>();
            response.put("emplacement", emplacement.getNom());
            response.put("dateDebut", dateDebut);
            response.put("dateFin", dateFin);
            response.put("disponible", disponible);
            response.put("message", "Communication Feign réussie - Scénario 2");

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }

    // SCÉNARIO 3: Statistiques avancées d'un emplacement
    @GetMapping("/{id}/statistiques")
    public ResponseEntity<?> getStatistiquesEmplacement(@PathVariable Long id) {
        try {
            Optional<Emplacement> emplacementOpt = emplacementRepository.findById(id);
            if (emplacementOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Emplacement emplacement = emplacementOpt.get();
            List<Reservation> reservations = reservationClient.getReservationsByEmplacement(id.toString());

            // Calcul des statistiques
            double chiffreAffaireTotal = reservations.stream()
                    .mapToDouble(Reservation::getPrixTotal)
                    .sum();

            long reservationsConfirmees = reservations.stream()
                    .filter(r -> "CONFIRMEE".equals(r.getStatut()))
                    .count();

            Map<String, Object> response = new HashMap<>();
            response.put("emplacement", emplacement);
            response.put("nombreReservationsTotal", reservations.size());
            response.put("reservationsConfirmees", reservationsConfirmees);
            response.put("chiffreAffaireTotal", chiffreAffaireTotal);
            response.put("tauxOccupation", calculerTauxOccupation(reservations.size()));
            response.put("message", "Communication Feign réussie - Scénario 3");

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }


    // SCÉNARIO 5: Test de communication simple entre services
    @GetMapping("/test-communication")
    public ResponseEntity<?> testCommunication() {
        try {
            // Récupérer toutes les réservations via Feign
            List<Reservation> toutesReservations = reservationClient.getAllReservations();

            // Récupérer tous les emplacements
            List<Emplacement> tousEmplacements = emplacementRepository.findAll();

            Map<String, Object> response = new HashMap<>();
            response.put("nombreEmplacements", tousEmplacements.size());
            response.put("nombreReservations", toutesReservations.size());
            response.put("servicesCommuniquants", List.of("emplacement-service", "reservation-service"));
            response.put("message", "Test de communication Feign réussi - Tous les services répondent");
            response.put("exempleReservation", toutesReservations.isEmpty() ? null : toutesReservations.get(0));

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }
    // Méthodes utilitaires
    private double calculerPrixSejour(Double prixParNuit, String dateDebut, String dateFin) {
        // Implémentation simplifiée du calcul de prix
        try {
            java.time.LocalDate debut = java.time.LocalDate.parse(dateDebut);
            java.time.LocalDate fin = java.time.LocalDate.parse(dateFin);
            long nombreNuits = java.time.temporal.ChronoUnit.DAYS.between(debut, fin);
            return prixParNuit * Math.max(1, nombreNuits);
        } catch (Exception e) {
            return prixParNuit * 3; // Par défaut 3 nuits
        }
    }

    private double calculerTauxOccupation(int nombreReservations) {
        // Implémentation simplifiée - à adapter selon votre logique métier
        return Math.min(100, (nombreReservations / 10.0) * 100);
    }

}