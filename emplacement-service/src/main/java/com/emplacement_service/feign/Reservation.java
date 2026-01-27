package com.emplacement_service.feign;


import java.util.Date;

public class Reservation {
    private String id;
    private String emplacementId;
    private String clientNom;
    private String clientEmail;
    private Date dateDebut;
    private Date dateFin;
    private Double prixTotal;
    private String statut;

    // Constructeurs
    public Reservation() {}

    public Reservation(String id, String emplacementId, String clientNom, String clientEmail,
                       Date dateDebut, Date dateFin, Double prixTotal, String statut) {
        this.id = id;
        this.emplacementId = emplacementId;
        this.clientNom = clientNom;
        this.clientEmail = clientEmail;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.prixTotal = prixTotal;
        this.statut = statut;
    }

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmplacementId() { return emplacementId; }
    public void setEmplacementId(String emplacementId) { this.emplacementId = emplacementId; }

    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public Date getDateDebut() { return dateDebut; }
    public void setDateDebut(Date dateDebut) { this.dateDebut = dateDebut; }

    public Date getDateFin() { return dateFin; }
    public void setDateFin(Date dateFin) { this.dateFin = dateFin; }

    public Double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(Double prixTotal) { this.prixTotal = prixTotal; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    @Override
    public String toString() {
        return "Reservation{" +
                "id='" + id + '\'' +
                ", emplacementId='" + emplacementId + '\'' +
                ", clientNom='" + clientNom + '\'' +
                ", clientEmail='" + clientEmail + '\'' +
                ", dateDebut=" + dateDebut +
                ", dateFin=" + dateFin +
                ", prixTotal=" + prixTotal +
                ", statut='" + statut + '\'' +
                '}';
    }
}
