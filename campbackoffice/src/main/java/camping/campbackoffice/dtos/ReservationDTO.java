package camping.campbackoffice.dtos;

public class ReservationDTO {
    private String id;
    private Long emplacementId;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;
    private String dateDebut;
    private String dateFin;
    private Double prixTotal;
    private Integer nombrePersonnes;
    private String statut;
    private String dateCreation;
    private String commentaires;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getEmplacementId() { return emplacementId; }
    public void setEmplacementId(Long emplacementId) { this.emplacementId = emplacementId; }
    public String getClientNom() { return clientNom; }
    public void setClientNom(String clientNom) { this.clientNom = clientNom; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public String getClientTelephone() { return clientTelephone; }
    public void setClientTelephone(String clientTelephone) { this.clientTelephone = clientTelephone; }
    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }
    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }
    public Double getPrixTotal() { return prixTotal; }
    public void setPrixTotal(Double prixTotal) { this.prixTotal = prixTotal; }
    public Integer getNombrePersonnes() { return nombrePersonnes; }
    public void setNombrePersonnes(Integer nombrePersonnes) { this.nombrePersonnes = nombrePersonnes; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getDateCreation() { return dateCreation; }
    public void setDateCreation(String dateCreation) { this.dateCreation = dateCreation; }
    public String getCommentaires() { return commentaires; }
    public void setCommentaires(String commentaires) { this.commentaires = commentaires; }
}
