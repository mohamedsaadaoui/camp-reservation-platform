package camping.campbackoffice.dtos;

// ReservationDetailsDTO.java
public class ReservationDetailsDTO {
    private ReservationDTO reservation;
    private EmplacementDTO emplacement;

    // Getters/Setters

    public ReservationDTO getReservation() {
        return reservation;
    }

    public void setReservation(ReservationDTO reservation) {
        this.reservation = reservation;
    }

    public EmplacementDTO getEmplacement() {
        return emplacement;
    }

    public void setEmplacement(EmplacementDTO emplacement) {
        this.emplacement = emplacement;
    }
}
