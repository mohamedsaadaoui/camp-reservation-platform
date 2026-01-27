package camping.campbackoffice.dtos;
// EmplacementStatsDTO.java
public class EmplacementStatsDTO {
    private EmplacementDTO emplacement;
    private Integer nombreReservations;
    private Double chiffreAffaire;
    private Double tauxOccupation;
    private Double reservationMoyenne; // Durée moyenne

    // Getters/Setters

    public EmplacementDTO getEmplacement() {
        return emplacement;
    }

    public void setEmplacement(EmplacementDTO emplacement) {
        this.emplacement = emplacement;
    }

    public Integer getNombreReservations() {
        return nombreReservations;
    }

    public void setNombreReservations(Integer nombreReservations) {
        this.nombreReservations = nombreReservations;
    }

    public Double getChiffreAffaire() {
        return chiffreAffaire;
    }

    public void setChiffreAffaire(Double chiffreAffaire) {
        this.chiffreAffaire = chiffreAffaire;
    }

    public Double getTauxOccupation() {
        return tauxOccupation;
    }

    public void setTauxOccupation(Double tauxOccupation) {
        this.tauxOccupation = tauxOccupation;
    }

    public Double getReservationMoyenne() {
        return reservationMoyenne;
    }

    public void setReservationMoyenne(Double reservationMoyenne) {
        this.reservationMoyenne = reservationMoyenne;
    }
}