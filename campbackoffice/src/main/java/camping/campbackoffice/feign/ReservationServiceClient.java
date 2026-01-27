package camping.campbackoffice.feign;

import camping.campbackoffice.dtos.ReservationDTO;
import camping.campbackoffice.dtos.UpdateStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ReservationServiceClient.java
@FeignClient(name = "reservation-service", path = "/api/reservations")
public interface ReservationServiceClient {

    @GetMapping
    List<ReservationDTO> getAllReservations();

    @GetMapping("/{id}")
    ReservationDTO getReservationById(@PathVariable("id") String id);

    @GetMapping("/emplacement/{emplacementId}")
    List<ReservationDTO> getReservationsByEmplacement(@PathVariable("emplacementId") Long emplacementId);

    @PutMapping("/{id}/status")
    ReservationDTO updateReservationStatus(
            @PathVariable("id") String id,
            @RequestBody UpdateStatusRequest request
    );

    @GetMapping("/statistics/emplacement/{emplacementId}")
    ReservationStatsDTO getReservationStats(@PathVariable("emplacementId") Long emplacementId);

    @GetMapping("/period")
    List<ReservationDTO> getReservationsByPeriod(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    );
}
