package camping.campbackoffice.service;

import camping.campbackoffice.dtos.*;

import camping.campbackoffice.feign.EmplacementServiceClient;
import com.emplacement_service.feign.ReservationServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// BackofficeStatisticsService.java
@Service
public class BackofficeStatisticsService {

    @Autowired
    private EmplacementServiceClient emplacementClient;

    @Autowired
    private ReservationServiceClient reservationClient;

    public DashboardStatsDTO getDashboardStats() {
        List<EmplacementDTO> emplacements = emplacementClient.getAllEmplacements();
        List<ReservationDTO> reservations = reservationClient.getAllReservations();

        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Calcul des statistiques
        stats.setTotalEmplacements(emplacements.size());
        stats.setTotalReservations(reservations.size());
        stats.setRevenueTotal(calculateTotalRevenue(reservations));
        stats.setReservationsEnAttente(countReservationsByStatus(reservations, "EN_ATTENTE"));
        stats.setTauxOccupation(calculateOccupancyRate(emplacements, reservations));
        stats.setEmplacementsDisponibles(countAvailableEmplacements(emplacements));

        return stats;
    }

    public RevenueStatsDTO getRevenueStats(String period) {
        List<ReservationDTO> reservations = reservationClient.getAllReservations();
        List<ReservationDTO> confirmedReservations = reservations.stream()
                .filter(r -> "CONFIRMEE".equals(r.getStatut()))
                .collect(Collectors.toList());

        RevenueStatsDTO revenueStats = new RevenueStatsDTO();
        revenueStats.setPeriod(period);
        revenueStats.setTotalRevenue(calculateTotalRevenue(confirmedReservations));
        revenueStats.setRevenueData(generateRevenueByPeriod(confirmedReservations, period));

        return revenueStats;
    }

    public EmplacementStatsDTO getEmplacementStats(Long emplacementId) {
        EmplacementDTO emplacement = emplacementClient.getEmplacementById(emplacementId);
        List<ReservationDTO> reservations = reservationClient.getReservationsByEmplacement(emplacementId);

        EmplacementStatsDTO stats = new EmplacementStatsDTO();
        stats.setEmplacement(emplacement);
        stats.setNombreReservations(reservations.size());
        stats.setChiffreAffaire(calculateTotalRevenue(reservations));
        stats.setTauxOccupation(calculateEmplacementOccupancyRate(emplacementId, reservations));
        stats.setReservationMoyenne(calculateAverageReservationDuration(reservations));

        return stats;
    }

    // Méthodes utilitaires
    private Double calculateTotalRevenue(List<ReservationDTO> reservations) {
        return reservations.stream()
                .mapToDouble(ReservationDTO::getPrixTotal)
                .sum();
    }

    private long countReservationsByStatus(List<ReservationDTO> reservations, String status) {
        return reservations.stream()
                .filter(r -> status.equals(r.getStatut()))
                .count();
    }

    private double calculateOccupancyRate(List<EmplacementDTO> emplacements, List<ReservationDTO> reservations) {
        // Implémentation du calcul du taux d'occupation
        return 75.5; // Exemple
    }

    // Autres méthodes de calcul...
}
