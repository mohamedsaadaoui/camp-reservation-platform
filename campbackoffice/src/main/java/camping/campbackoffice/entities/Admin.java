package camping.campbackoffice.entities;

import jakarta.persistence.*;
@Entity
@Table(name = "admin_users")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String email;
    private String nomComplet;

    @Enumerated(EnumType.STRING)
    private AdminRole role; // SUPER_ADMIN, MANAGER, SUPPORT

    private boolean active = true;

    // Getters/Setters
}
