package com.emplacement_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "RESERVATION-SERVICE")
public interface ReservationServiceClient {

    @PostMapping("/api/reservations")
    Reservation createReservation(@RequestBody Reservation reservation);

    @GetMapping("/api/reservations/emplacement/{emplacementId}/disponible")
    Boolean verifierDisponibilite(@PathVariable String emplacementId,
                                  @RequestParam String dateDebut,
                                  @RequestParam String dateFin);

    @GetMapping("/api/reservations/emplacement/{emplacementId}/stats")
    ReservationStats getReservationsStats(@PathVariable String emplacementId);
}
