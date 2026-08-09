package camping.campbackoffice.controller;

import camping.campbackoffice.dtos.DashboardStatsDTO;
import camping.campbackoffice.dtos.EmplacementDTO;
import camping.campbackoffice.dtos.EmplacementStatsDTO;
import camping.campbackoffice.dtos.ReservationDTO;
import camping.campbackoffice.dtos.ReservationDetailsDTO;
import camping.campbackoffice.dtos.RevenueStatsDTO;
import camping.campbackoffice.dtos.UpdateStatusRequest;
import camping.campbackoffice.feign.EmplacementServiceClient;
import camping.campbackoffice.feign.ReservationServiceClient;
import camping.campbackoffice.service.BackofficeStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

// BackofficeController.java
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class BackofficeController {

    private final EmplacementServiceClient emplacementClient;
    private final ReservationServiceClient reservationClient;
    private final BackofficeStatisticsService statisticsService;

    public BackofficeController(EmplacementServiceClient emplacementClient,
                                ReservationServiceClient reservationClient,
                                BackofficeStatisticsService statisticsService) {
        this.emplacementClient = emplacementClient;
        this.reservationClient = reservationClient;
        this.statisticsService = statisticsService;
    }

    // === DASHBOARD ===
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(statisticsService.getDashboardStats());
    }

    // === GESTION DES RÉSERVATIONS ===
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getAllReservations(
            @RequestParam(required = false) String status) {

        List<ReservationDTO> reservations = reservationClient.getAllReservations();

        if (status != null && !status.isEmpty()) {
            reservations = reservations.stream()
                    .filter(r -> status.equals(r.getStatut()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations/{id}")
    public ResponseEntity<ReservationDetailsDTO> getReservationDetails(@PathVariable String id) {
        ReservationDTO reservation = reservationClient.getReservationById(id);
        EmplacementDTO emplacement = emplacementClient.getEmplacementById(reservation.getEmplacementId());

        ReservationDetailsDTO details = new ReservationDetailsDTO();
        details.setReservation(reservation);
        details.setEmplacement(emplacement);

        return ResponseEntity.ok(details);
    }

    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {

        return ResponseEntity.ok(reservationClient.updateReservationStatus(id, request));
    }

    // === GESTION DES EMPLACEMENTS ===
    @GetMapping("/emplacements")
    public ResponseEntity<List<EmplacementDTO>> getAllEmplacements() {
        return ResponseEntity.ok(emplacementClient.getAllEmplacements());
    }

    @GetMapping("/emplacements/{id}")
    public ResponseEntity<EmplacementDTO> getEmplacementById(@PathVariable Long id) {
        return ResponseEntity.ok(emplacementClient.getEmplacementById(id));
    }

    @PostMapping("/emplacements")
    public ResponseEntity<EmplacementDTO> createEmplacement(@RequestBody EmplacementDTO emplacement) {
        return ResponseEntity.ok(emplacementClient.createEmplacement(emplacement));
    }

    @PutMapping("/emplacements/{id}")
    public ResponseEntity<EmplacementDTO> updateEmplacement(
            @PathVariable Long id,
            @RequestBody EmplacementDTO emplacement) {

        return ResponseEntity.ok(emplacementClient.updateEmplacement(id, emplacement));
    }

    @DeleteMapping("/emplacements/{id}")
    public ResponseEntity<Void> deleteEmplacement(@PathVariable Long id) {
        emplacementClient.deleteEmplacement(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/emplacements/{id}/images")
    public ResponseEntity<String> uploadEmplacementImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(emplacementClient.uploadEmplacementImage(id, file));
    }

    // === STATISTIQUES AVANCÉES ===
    @GetMapping("/statistics/revenue")
    public ResponseEntity<RevenueStatsDTO> getRevenueStatistics(
            @RequestParam String period) { // daily, weekly, monthly

        return ResponseEntity.ok(statisticsService.getRevenueStats(period));
    }

    @GetMapping("/emplacements/{id}/statistics")
    public ResponseEntity<EmplacementStatsDTO> getEmplacementStatistics(@PathVariable Long id) {
        return ResponseEntity.ok(statisticsService.getEmplacementStats(id));
    }
}