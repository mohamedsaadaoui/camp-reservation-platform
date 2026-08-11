package com.emplacement_service.feign;

/**
 * Aggregated reservation statistics exposed by the reservation-service.
 * Contains no client personal data.
 */
public class ReservationStats {
    private long nombreReservationsTotal;
    private long reservationsConfirmees;
    private double chiffreAffaireTotal;

    public ReservationStats() {
    }

    public ReservationStats(long nombreReservationsTotal, long reservationsConfirmees, double chiffreAffaireTotal) {
        this.nombreReservationsTotal = nombreReservationsTotal;
        this.reservationsConfirmees = reservationsConfirmees;
        this.chiffreAffaireTotal = chiffreAffaireTotal;
    }

    public long getNombreReservationsTotal() {
        return nombreReservationsTotal;
    }

    public void setNombreReservationsTotal(long nombreReservationsTotal) {
        this.nombreReservationsTotal = nombreReservationsTotal;
    }

    public long getReservationsConfirmees() {
        return reservationsConfirmees;
    }

    public void setReservationsConfirmees(long reservationsConfirmees) {
        this.reservationsConfirmees = reservationsConfirmees;
    }

    public double getChiffreAffaireTotal() {
        return chiffreAffaireTotal;
    }

    public void setChiffreAffaireTotal(double chiffreAffaireTotal) {
        this.chiffreAffaireTotal = chiffreAffaireTotal;
    }
}
