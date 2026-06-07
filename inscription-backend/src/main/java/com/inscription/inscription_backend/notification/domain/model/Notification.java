package com.inscription.inscription_backend.notification.domain.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
public class Notification {

    @Id
    private UUID id;

    @Column(name = "utilisateur_id", nullable = false)
    private UUID utilisateurId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;

    private String destinataire;  // email
    private String sujet;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    private boolean envoye;
    private LocalDateTime envoyeLe;
    private LocalDateTime creeLe;
    private String erreur;

    protected Notification() {}

    public static Notification creer(UUID utilisateurId, TypeNotification type,
                                     String destinataire, String sujet, String contenu) {
        Notification n = new Notification();
        n.id = UUID.randomUUID();
        n.utilisateurId = utilisateurId;
        n.type = type;
        n.destinataire = destinataire;
        n.sujet = sujet;
        n.contenu = contenu;
        n.envoye = false;
        n.creeLe = LocalDateTime.now();
        return n;
    }

    public void marquerEnvoye() {
        this.envoye = true;
        this.envoyeLe = LocalDateTime.now();
    }

    public void marquerEchec(String erreur) {
        this.envoye = false;
        this.erreur = erreur;
    }
}