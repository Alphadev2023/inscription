package com.inscription.inscription_backend.document.domain.model;

import com.inscription.inscription_backend.document.domain.event.DocumentValideEvent;
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.domain.AbstractAggregateRoot;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fichiers_documents")
@Getter
public class FichierDocument extends AbstractAggregateRoot<FichierDocument> {

    @Id
    private UUID id;

    @Column(name = "dossier_id", nullable = false)
    private UUID dossierId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDocument type;

    private String nomFichierOriginal;
    private String nomFichierStockage;
    private String cheminStockage;
    private String mimeType;
    private Long taille;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutValidation statut;

    private String raisonRejet;
    private LocalDateTime uploadeLe;
    private LocalDateTime valideLe;

    protected FichierDocument() {}

    public static FichierDocument creer(UUID dossierId, TypeDocument type,
                                        String nomOriginal, String nomStockage,
                                        String chemin, String mimeType, Long taille) {
        FichierDocument f = new FichierDocument();
        f.id = UUID.randomUUID();
        f.dossierId = dossierId;
        f.type = type;
        f.nomFichierOriginal = nomOriginal;
        f.nomFichierStockage = nomStockage;
        f.cheminStockage = chemin;
        f.mimeType = mimeType;
        f.taille = taille;
        f.statut = StatutValidation.EN_ATTENTE;
        f.uploadeLe = LocalDateTime.now();
        return f;
    }

    public void valider() {
        this.statut = StatutValidation.VALIDE;
        this.valideLe = LocalDateTime.now();
        registerEvent(new DocumentValideEvent(this.id, this.dossierId, this.type));
    }

    public void rejeter(String raison) {
        this.statut = StatutValidation.REJETE;
        this.raisonRejet = raison;
    }

    public void marquerSuspect() {
        this.statut = StatutValidation.SUSPECT;
    }
}