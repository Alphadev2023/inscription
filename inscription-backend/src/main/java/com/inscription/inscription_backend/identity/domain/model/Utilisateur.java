package com.inscription.inscription_backend.identity.domain.model;

import com.inscription.inscription_backend.identity.domain.event.UtilisateurCreeEvent;
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.domain.AbstractAggregateRoot;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "utilisateurs")
@Getter
public class Utilisateur extends AbstractAggregateRoot<Utilisateur> {

    @Id
    private UUID id;

    @Embedded
    @AttributeOverride(name = "valeur", column = @Column(name = "email", unique = true, nullable = false))
    private Email email;

    @Embedded
    @AttributeOverride(name = "hashValeur", column = @Column(name = "mot_de_passe", nullable = false))
    private MotDePasse motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private boolean actif;

    private LocalDateTime creeLe;

    protected Utilisateur() {}

    public static Utilisateur creer(Email email, MotDePasse motDePasse, Role role) {
        Utilisateur u = new Utilisateur();
        u.id = UUID.randomUUID();
        u.email = email;
        u.motDePasse = motDePasse;
        u.role = role;
        u.actif = true;
        u.creeLe = LocalDateTime.now();

        u.registerEvent(new UtilisateurCreeEvent(u.id, email.getValeur(), role));
        return u;
    }

    public void desactiver() {
        this.actif = false;
    }
}