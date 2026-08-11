package com.emplacement_service.controller;

import com.emplacement_service.entities.Emplacement;
import com.emplacement_service.feign.Reservation;
import com.emplacement_service.feign.ReservationServiceClient;
import com.emplacement_service.feign.ReservationStats;
import com.emplacement_service.service.EmplacementService;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/emplacements")
@CrossOrigin(origins = "http://localhost:4200")
public class EmplacementController {

    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

    @Autowired
    private EmplacementService emplacementService;

    @Autowired
    private ReservationServiceClient reservationClient;

    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping
    public List<Emplacement> getAllEmplacements() {
        return emplacementService.getAllEmplacements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Emplacement> getEmplacementById(@PathVariable Long id) {
        return emplacementService.getEmplacementById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/disponibles")
    public List<Emplacement> getEmplacementsDisponibles() {
        return emplacementService.getAvailableEmplacements();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Emplacement> createEmplacement(@Valid @RequestBody Emplacement emplacement) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(emplacementService.saveEmplacement(emplacement));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateEmplacement(@PathVariable Long id, @Valid @RequestBody Emplacement details) {
        if (!emplacementService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(emplacementService.updateEmplacement(id, details));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmplacement(@PathVariable Long id) {
        if (!emplacementService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        emplacementService.deleteEmplacement(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Emplacement> emplacementOpt = emplacementService.getEmplacementById(id);
        if (emplacementOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier vide");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Seules les images sont autorisées");
        }
        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            return ResponseEntity.badRequest().body("Image trop volumineuse (maximum 5 Mo)");
        }
        try {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);
            String safeName = Paths.get(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image")
                    .getFileName().toString();
            String fileName = UUID.randomUUID() + "_" + safeName;
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

            Emplacement emplacement = emplacementOpt.get();
            emplacement.setImageUrl("/uploads/" + fileName);
            emplacementService.saveEmplacement(emplacement);
            return ResponseEntity.ok(emplacement.getImageUrl());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload de l'image");
        }
    }

    // Création d'une réservation via le reservation-service (Feign).
    // Le prix total est recalculé côté serveur à partir de l'emplacement,
    // le prix envoyé par le client n'est jamais utilisé.
    @PostMapping("/reserver")
    public ResponseEntity<?> reserverEmplacement(@RequestBody Reservation reservation) {
        try {
            Long emplacementId = Long.parseLong(reservation.getEmplacementId());
            Optional<Emplacement> emplacementOpt = emplacementService.getEmplacementById(emplacementId);
            if (emplacementOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            if (reservation.getDateDebut() == null || reservation.getDateFin() == null
                    || !reservation.getDateFin().after(reservation.getDateDebut())) {
                return ResponseEntity.badRequest().body("La date de fin doit être après la date de début");
            }
            Emplacement emplacement = emplacementOpt.get();
            long nights = ChronoUnit.DAYS.between(
                    toLocalDate(reservation.getDateDebut()),
                    toLocalDate(reservation.getDateFin()));
            reservation.setPrixTotal(emplacement.getPrix() * Math.max(1, nights));

            Reservation res = reservationClient.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Identifiant d'emplacement invalide");
        } catch (FeignException e) {
            return ResponseEntity.status(e.status()).body(e.getMessage());
        }
    }

    // Vérifier la disponibilité d'un emplacement pour une période
    @GetMapping("/{id}/disponible")
    public ResponseEntity<?> verifierDisponibilite(@PathVariable Long id,
                                                   @RequestParam String dateDebut,
                                                   @RequestParam String dateFin) {
        try {
            if (!emplacementService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            Boolean disponible = reservationClient.verifierDisponibilite(
                    id.toString(), dateDebut, dateFin);

            Map<String, Object> response = new HashMap<>();
            response.put("emplacement", emplacementService.getEmplacementById(id).map(Emplacement::getNom).orElse(null));
            response.put("dateDebut", dateDebut);
            response.put("dateFin", dateFin);
            response.put("disponible", disponible);

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }

    // Statistiques agrégées d'un emplacement (aucune donnée personnelle exposée)
    @GetMapping("/{id}/statistiques")
    public ResponseEntity<?> getStatistiquesEmplacement(@PathVariable Long id) {
        try {
            Optional<Emplacement> emplacementOpt = emplacementService.getEmplacementById(id);
            if (emplacementOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ReservationStats stats = reservationClient.getReservationsStats(id.toString());

            Map<String, Object> response = new HashMap<>();
            response.put("emplacement", emplacementOpt.get());
            response.put("nombreReservationsTotal", stats.getNombreReservationsTotal());
            response.put("reservationsConfirmees", stats.getReservationsConfirmees());
            response.put("chiffreAffaireTotal", stats.getChiffreAffaireTotal());
            response.put("tauxOccupation", calculerTauxOccupation(stats.getNombreReservationsTotal()));

            return ResponseEntity.ok(response);
        } catch (FeignException e) {
            return ResponseEntity.status(500).body("Erreur communication Feign: " + e.getMessage());
        }
    }

    private LocalDate toLocalDate(java.util.Date date) {
        return date.toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
    }

    private double calculerTauxOccupation(long nombreReservations) {
        return Math.min(100, (nombreReservations / 10.0) * 100);
    }
}
