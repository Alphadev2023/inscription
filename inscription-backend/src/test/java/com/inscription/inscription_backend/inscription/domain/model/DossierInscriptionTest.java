package com.inscription.inscription_backend.inscription.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.util.UUID;

class DossierInscriptionTest {

    private DossierInscription dossier;
    private UUID utilisateurId;

    @BeforeEach
    void setUp() {
        utilisateurId = UUID.randomUUID();
        Candidat candidat = Candidat.creer(
                UUID.randomUUID(), "Diallo", "Ibrahima",
                LocalDate.of(2000, 1, 1), "Guinéenne",
                "+224620000000", Sexe.MASCULIN, TypePieceIdentite.CNI
        );
        dossier = DossierInscription.creer(utilisateurId, candidat);
    }

    @Test
    @DisplayName("Un nouveau dossier est en statut BROUILLON")
    void nouveauDossierEstBrouillon() {
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.BROUILLON);
    }

    @Test
    @DisplayName("Un dossier BROUILLON avec score >= 80 peut être soumis")
    void soumettreAvecScoreSuffisant() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.SOUMIS);
        assertThat(dossier.getSoumisLe()).isNotNull();
    }

    @Test
    @DisplayName("Un dossier avec score < 80 ne peut pas être soumis")
    void soumettreAvecScoreInsuffisant() {
        dossier.mettreAJourScore(50);
        assertThatThrownBy(() -> dossier.soumettre())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("incomplet");
    }

    @Test
    @DisplayName("Un dossier SOUMIS peut être validé")
    void validerDossierSoumis() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        dossier.mettreEnCours(UUID.randomUUID());
        dossier.valider();
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.VALIDE);
        assertThat(dossier.getTraiteLe()).isNotNull();
    }

    @Test
    @DisplayName("Un dossier SOUMIS peut être rejeté")
    void rejeterDossierSoumis() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        dossier.mettreEnCours(UUID.randomUUID()); // ← ajoute
        dossier.rejeter("Documents manquants");
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.REJETE);
        assertThat(dossier.getRaisonRejet()).isEqualTo("Documents manquants");
    }

    @Test
    @DisplayName("Un dossier VALIDE ne peut pas être soumis à nouveau")
    void dossierValideNePeutPasEtreSoumis() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        dossier.mettreEnCours(UUID.randomUUID());
        dossier.valider();
        assertThatThrownBy(() -> dossier.soumettre())
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Mise à jour du score")
    void mettreAJourScore() {
        dossier.mettreAJourScore(75);
        assertThat(dossier.getScoreCompletude().getValeur()).isEqualTo(75);
    }

    @Test
    @DisplayName("Score invalide lance une exception")
    void scoreInvalide() {
        assertThatThrownBy(() -> dossier.mettreAJourScore(150))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Workflow complet : BROUILLON → SOUMIS → EN_COURS → VALIDE")
    void workflowCompletValide() {
        dossier.mettreAJourScore(85);
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.BROUILLON);

        dossier.soumettre();
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.SOUMIS);

        dossier.mettreEnCours(UUID.randomUUID());
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.EN_COURS);

        dossier.valider();
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.VALIDE);
    }

    @Test
    @DisplayName("Workflow complet : BROUILLON → SOUMIS → EN_COURS → REJETE")
    void workflowCompletRejete() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        dossier.mettreEnCours(UUID.randomUUID());
        dossier.rejeter("Documents invalides");
        assertThat(dossier.getStatut()).isEqualTo(StatutDossier.REJETE);
    }

    @Test
    @DisplayName("Transition invalide BROUILLON → VALIDE lance une exception")
    void transitionInvalide() {
        assertThatThrownBy(() -> dossier.valider())
                .isInstanceOf(IllegalStateException.class);
    }
}