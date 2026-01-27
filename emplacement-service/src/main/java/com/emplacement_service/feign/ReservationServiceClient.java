package com.emplacement_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "RESERVATION-SERVICE")
public interface ReservationServiceClient {

    @GetMapping("/api/reservations/emplacement/{emplacementId}")
    List<Reservation> getReservationsByEmplacement(@PathVariable String emplacementId);

    @PostMapping("/api/reservations")
    Reservation createReservation(@RequestBody Reservation reservation);

    // NOUVEAUX SCÉNARIOS POUR LA COMMUNICATION FEIGN
    @GetMapping("/api/reservations/emplacement/{emplacementId}/disponible")
    Boolean verifierDisponibilite(@PathVariable String emplacementId,
                                  @RequestParam String dateDebut,
                                  @RequestParam String dateFin);

    @GetMapping("/api/reservations")
    List<Reservation> getAllReservations();

    @GetMapping("/api/reservations/{id}")
    Reservation getReservationById(@PathVariable String id);
}

