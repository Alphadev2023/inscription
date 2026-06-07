package com.inscription.inscription_backend.inscription.domain.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "candidats")
@Getter
public class Candidat {

    @Id
    private UUID id;

    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String nationalite;
    private String telephone;
    private String adresse;

    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    @Enumerated(EnumType.STRING)
    private TypePieceIdentite typePiece;

    private String numeroIdentite;

    // Personne à contacter en cas d'urgence
    private String contactUrgenceNom;
    private String contactUrgenceTelephone;

    protected Candidat() {}

    public static Candidat creer(UUID id, String nom, String prenom,
                                 LocalDate dateNaissance, String nationalite,
                                 String telephone, Sexe sexe,
                                 TypePieceIdentite typePiece) {
        validerAge(dateNaissance);

        Candidat c = new Candidat();
        c.id = id;
        c.nom = nom.trim();
        c.prenom = prenom.trim();
        c.dateNaissance = dateNaissance;
        c.nationalite = nationalite;
        c.telephone = telephone;
        c.sexe = sexe;
        c.typePiece = typePiece;
        return c;
    }

    private static void validerAge(LocalDate dateNaissance) {
        if (dateNaissance.plusYears(16).isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Le candidat doit avoir au moins 16 ans");
        }
    }

    public void ajouterContactUrgence(String nom, String telephone) {
        this.contactUrgenceNom = nom;
        this.contactUrgenceTelephone = telephone;
    }
}