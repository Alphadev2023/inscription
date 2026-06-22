package com.inscription.inscription_backend.inscription.domain.model;

import com.inscription.inscription_backend.inscription.domain.event.DossierRejeteEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierSoumisEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierValideEvent;
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.domain.AbstractAggregateRoot;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dossiers_inscription")
@Getter
public class DossierInscription extends AbstractAggregateRoot<DossierInscription> {

    @Id
    private UUID id;

    // Référence vers l'utilisateur du module identity (pas de join cross-module)
    @Column(name = "utilisateur_id", nullable = false)
    private UUID utilisateurId;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "candidat_id")
    private Candidat candidat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDossier statut;

    @Embedded
    @AttributeOverride(name = "valeur", column = @Column(name = "score_completude"))
    private ScoreCompletude scoreCompletude;

    private int etapeActuelle; // 1 à 5

    // Parcours académique
    private String dernierEtablissement;
    private String specialisation;
    private String periodeFormation;

    // Agent assigné (module workflow)
    private UUID agentAssigneId;

    private LocalDateTime creeLe;
    private LocalDateTime soumisLe;
    private LocalDateTime traiteLe;
    private String raisonRejet;

    protected DossierInscription() {}

    // ── Factory method ──────────────────────────────────────
    public static DossierInscription creer(UUID utilisateurId, Candidat candidat) {
        DossierInscription d = new DossierInscription();
        d.id = UUID.randomUUID();
        d.utilisateurId = utilisateurId;
        d.candidat = candidat;
        d.statut = StatutDossier.BROUILLON;
        d.scoreCompletude = ScoreCompletude.de(0);
        d.etapeActuelle = 1;
        d.creeLe = LocalDateTime.now();
        return d;
    }

    // ── Comportements métier ────────────────────────────────
    public void soumettre() {
        if (!statut.peutTransitionnerVers(StatutDossier.SOUMIS)) {
            throw new IllegalStateException(
                    "Impossible de soumettre un dossier en statut : " + statut
            );
        }
        if (!scoreCompletude.estSuffisantPourSoumission()) {
            throw new IllegalStateException(
                    "Dossier incomplet (" + scoreCompletude.getValeur() + "%). Minimum 80% requis."
            );
        }
        this.statut = StatutDossier.SOUMIS;
        this.soumisLe = LocalDateTime.now();
        this.etapeActuelle = 5;

        registerEvent(new DossierSoumisEvent(
                this.id, this.utilisateurId,
                this.candidat.getNom(), this.candidat.getPrenom(),
                this.soumisLe
        ));
    }

    public void mettreEnCours(UUID agentId) {
        if (!statut.peutTransitionnerVers(StatutDossier.EN_COURS)) {
            throw new IllegalStateException("Transition invalide vers EN_COURS");
        }
        this.statut = StatutDossier.EN_COURS;
        this.agentAssigneId = agentId;
    }

    public void valider() {
        if (!statut.peutTransitionnerVers(StatutDossier.VALIDE)) {
            throw new IllegalStateException("Transition invalide vers VALIDE");
        }
        this.statut = StatutDossier.VALIDE;
        this.traiteLe = LocalDateTime.now();

        registerEvent(new DossierValideEvent(
                this.id, this.utilisateurId,
                this.candidat.getNom(), this.candidat.getPrenom()
        ));
    }

    public void rejeter(String raison) {
        if (!statut.peutTransitionnerVers(StatutDossier.REJETE)) {
            throw new IllegalStateException("Transition invalide vers REJETE");
        }
        this.statut = StatutDossier.REJETE;
        this.raisonRejet = raison;
        this.traiteLe = LocalDateTime.now();

        registerEvent(new DossierRejeteEvent(
                this.id, this.utilisateurId,
                this.candidat.getNom(), raison
        ));
    }

    public void mettreAJourEtape(int etape) {
        if (etape < 1 || etape > 5) {
            throw new IllegalArgumentException("Étape invalide : " + etape);
        }
        this.etapeActuelle = etape;
    }

    public void mettreAJourScore(int score) {
        this.scoreCompletude = ScoreCompletude.de(score);
    }

    public void mettreAJourParcoursAcademique(String etablissement,
                                              String specialisation,
                                              String periode) {
        this.dernierEtablissement = etablissement;
        this.specialisation = specialisation;
        this.periodeFormation = periode;
    }
}
