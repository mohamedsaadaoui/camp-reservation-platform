package camping.campbackoffice.dtos;


import java.time.LocalDate;
import java.time.LocalDateTime;

// ReservationDTO.java
public class ReservationDTO {
    private String id;
    private Long emplacementId;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double prixTotal;
    private Integer nombrePersonnes;
    private String statut;
    private LocalDateTime dateCreation;
    private String commentaires;

    // Getters/Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getEmplacementId() { return emplacementId; }
    public void setEmplacementId(Long emplacementId) { this.emplacementId = emplacementId; }
    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public Double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(Double prixTotal) { this.prixTotal = prixTotal; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}

