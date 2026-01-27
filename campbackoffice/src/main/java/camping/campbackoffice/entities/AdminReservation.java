package camping.campbackoffice.entities;

import com.emplacement_service.entities.Emplacement;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_reservations")
public class AdminReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reservationId;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;

    @ManyToOne
    private Emplacement emplacement;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double prixTotal;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status; // EN_ATTENTE, CONFIRMEE, ANNULEE

    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private String notesAdmin;

    // Getters/Setters
}