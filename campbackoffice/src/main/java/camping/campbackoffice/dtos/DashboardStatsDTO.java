package camping.campbackoffice.dtos;

// DashboardStatsDTO.java
public class DashboardStatsDTO {
    private Integer totalEmplacements;
    private Integer totalReservations;
    private Double revenueTotal;
    private Integer reservationsEnAttente;
    private Double tauxOccupation;
    private Integer emplacementsDisponibles;

    public Integer getTotalEmplacements() {
        return totalEmplacements;
    }

    public void setTotalEmplacements(Integer totalEmplacements) {
        this.totalEmplacements = totalEmplacements;
    }

    public Integer getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(Integer totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Double getRevenueTotal() {
        return revenueTotal;
    }

    public void setRevenueTotal(Double revenueTotal) {
        this.revenueTotal = revenueTotal;
    }

    public Integer getReservationsEnAttente() {
        return reservationsEnAttente;
    }

    public void setReservationsEnAttente(Integer reservationsEnAttente) {
        this.reservationsEnAttente = reservationsEnAttente;
    }

    public Double getTauxOccupation() {
        return tauxOccupation;
    }

    public void setTauxOccupation(Double tauxOccupation) {
        this.tauxOccupation = tauxOccupation;
    }

    public Integer getEmplacementsDisponibles() {
        return emplacementsDisponibles;
    }

    public void setEmplacementsDisponibles(Integer emplacementsDisponibles) {
        this.emplacementsDisponibles = emplacementsDisponibles;
    }
// Getters/Setters
}
