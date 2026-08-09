package camping.campbackoffice.service;

import camping.campbackoffice.dtos.DashboardStatsDTO;
import camping.campbackoffice.dtos.EmplacementDTO;
import camping.campbackoffice.dtos.EmplacementStatsDTO;
import camping.campbackoffice.dtos.ReservationDTO;
import camping.campbackoffice.dtos.RevenueStatsDTO;
import camping.campbackoffice.feign.EmplacementServiceClient;
import camping.campbackoffice.feign.ReservationServiceClient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class BackofficeStatisticsService {

    private static final long REFERENCE_WINDOW_DAYS = 30;

    private final EmplacementServiceClient emplacementClient;
    private final ReservationServiceClient reservationClient;

    public BackofficeStatisticsService(EmplacementServiceClient emplacementClient,
                                       ReservationServiceClient reservationClient) {
        this.emplacementClient = emplacementClient;
        this.reservationClient = reservationClient;
    }

    public DashboardStatsDTO getDashboardStats() {
        List<EmplacementDTO> emplacements = emplacementClient.getAllEmplacements();
        List<ReservationDTO> reservations = reservationClient.getAllReservations();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalEmplacements(emplacements.size());
        stats.setTotalReservations(reservations.size());
        stats.setRevenueTotal(calculateTotalRevenue(reservations));
        stats.setReservationsEnAttente(countReservationsByStatus(reservations, "EN_ATTENTE"));
        stats.setTauxOccupation(calculateOccupancyRate(emplacements, reservations));
        stats.setEmplacementsDisponibles(countAvailableEmplacements(emplacements));

        return stats;
    }

    public RevenueStatsDTO getRevenueStats(String period) {
        List<ReservationDTO> confirmedReservations = reservationClient.getAllReservations().stream()
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
        stats.setTauxOccupation(calculateEmplacementOccupancyRate(reservations));
        stats.setReservationMoyenne(calculateAverageReservationDuration(reservations));

        return stats;
    }

    private double calculateTotalRevenue(List<ReservationDTO> reservations) {
        return reservations.stream()
                .mapToDouble(r -> r.getPrixTotal() != null ? r.getPrixTotal() : 0.0)
                .sum();
    }

    private int countReservationsByStatus(List<ReservationDTO> reservations, String status) {
        return (int) reservations.stream()
                .filter(r -> status.equals(r.getStatut()))
                .count();
    }

    private int countAvailableEmplacements(List<EmplacementDTO> emplacements) {
        return (int) emplacements.stream()
                .filter(e -> Boolean.TRUE.equals(e.getDisponible()))
                .count();
    }

    private double calculateOccupancyRate(List<EmplacementDTO> emplacements, List<ReservationDTO> reservations) {
        if (emplacements.isEmpty()) {
            return 0.0;
        }
        long reservedNights = countReservedNights(reservations);
        long capacityNights = (long) emplacements.size() * REFERENCE_WINDOW_DAYS;
        return Math.min(100.0, (reservedNights * 100.0) / capacityNights);
    }

    private double calculateEmplacementOccupancyRate(List<ReservationDTO> reservations) {
        long reservedNights = countReservedNights(reservations);
        return Math.min(100.0, (reservedNights * 100.0) / REFERENCE_WINDOW_DAYS);
    }

    private long countReservedNights(List<ReservationDTO> reservations) {
        return reservations.stream()
                .filter(r -> r.getDateDebut() != null && r.getDateFin() != null)
                .mapToLong(r -> Math.max(1, ChronoUnit.DAYS.between(toLocalDate(r.getDateDebut()), toLocalDate(r.getDateFin()))))
                .sum();
    }

    private double calculateAverageReservationDuration(List<ReservationDTO> reservations) {
        return reservations.stream()
                .filter(r -> r.getDateDebut() != null && r.getDateFin() != null)
                .mapToLong(r -> Math.max(1, ChronoUnit.DAYS.between(toLocalDate(r.getDateDebut()), toLocalDate(r.getDateFin()))))
                .average()
                .orElse(0.0);
    }

    private LocalDate toLocalDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (RuntimeException ignored) {
            return OffsetDateTime.parse(value).toLocalDate();
        }
    }

    private Map<String, Double> generateRevenueByPeriod(List<ReservationDTO> reservations, String period) {
        Map<String, Double> revenueData = new TreeMap<>();
        DateTimeFormatter formatter = switch (period) {
            case "weekly" -> DateTimeFormatter.ISO_WEEK_DATE;
            case "monthly" -> DateTimeFormatter.ofPattern("yyyy-MM");
            default -> DateTimeFormatter.ofPattern("yyyy-MM-dd");
        };

        for (ReservationDTO reservation : reservations) {
            LocalDate date = reservation.getDateDebut() != null ? toLocalDate(reservation.getDateDebut()) : LocalDate.now();
            String key = date.format(formatter);
            double amount = reservation.getPrixTotal() != null ? reservation.getPrixTotal() : 0.0;
            revenueData.merge(key, amount, Double::sum);
        }
        return revenueData;
    }
}
