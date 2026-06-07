package com.inscription.inscription_backend.inscription.application.service;

import com.inscription.inscription_backend.inscription.application.command.*;
import com.inscription.inscription_backend.inscription.domain.model.*;
import com.inscription.inscription_backend.inscription.domain.repository.DossierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DossierServiceTest {

    @Mock
    private DossierRepository dossierRepository;

    @InjectMocks
    private DossierService dossierService;

    private UUID utilisateurId;
    private UUID dossierId;
    private DossierInscription dossier;

    @BeforeEach
    void setUp() {
        utilisateurId = UUID.randomUUID();
        dossierId     = UUID.randomUUID();

        Candidat candidat = Candidat.creer(
                UUID.randomUUID(), "Diallo", "Ibrahima",
                LocalDate.of(2000, 1, 1), "Guinéenne",
                "+224620000000", Sexe.MASCULIN, TypePieceIdentite.CNI
        );
        dossier = DossierInscription.creer(utilisateurId, candidat);
    }

    @Test
    @DisplayName("Créer un dossier avec succès")
    void creerDossier() {
        when(dossierRepository.existeParUtilisateurId(utilisateurId)).thenReturn(false);
        when(dossierRepository.sauvegarder(any())).thenReturn(dossier);

        var cmd = new CreerDossierCommand(
                utilisateurId, "Diallo", "Ibrahima",
                LocalDate.of(2000, 1, 1), "Guinéenne",
                "+224620000000", Sexe.MASCULIN, TypePieceIdentite.CNI
        );

        DossierInscription result = dossierService.creerDossier(cmd);

        assertThat(result).isNotNull();
        assertThat(result.getStatut()).isEqualTo(StatutDossier.BROUILLON);
        verify(dossierRepository).sauvegarder(any());
    }

    @Test
    @DisplayName("Ne pas créer deux dossiers pour le même utilisateur")
    void nepasCreerDeuxDossiers() {
        when(dossierRepository.existeParUtilisateurId(utilisateurId)).thenReturn(true);

        var cmd = new CreerDossierCommand(
                utilisateurId, "Diallo", "Ibrahima",
                LocalDate.of(2000, 1, 1), "Guinéenne",
                "+224620000000", Sexe.MASCULIN, TypePieceIdentite.CNI
        );

        assertThatThrownBy(() -> dossierService.creerDossier(cmd))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("existe déjà");
    }

    @Test
    @DisplayName("Soumettre un dossier existant")
    void soumettreDossier() {
        dossier.mettreAJourScore(85);
        when(dossierRepository.trouverParId(dossierId)).thenReturn(Optional.of(dossier));
        when(dossierRepository.sauvegarder(any())).thenReturn(dossier);

        DossierInscription result = dossierService.soumettreDossier(
                new SoumettreDossierCommand(dossierId)
        );

        assertThat(result.getStatut()).isEqualTo(StatutDossier.SOUMIS);
    }

    @Test
    @DisplayName("Valider un dossier soumis")
    void validerDossier() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();

        when(dossierRepository.trouverParId(dossierId)).thenReturn(Optional.of(dossier));
        when(dossierRepository.sauvegarder(any())).thenReturn(dossier);

        UUID agentId = UUID.randomUUID();
        DossierInscription result = dossierService.validerDossier(
                new ValiderDossierCommand(dossierId, agentId)
        );

        assertThat(result.getStatut()).isEqualTo(StatutDossier.VALIDE);
    }

    @Test
    @DisplayName("Rejeter un dossier soumis")
    void rejeterDossier() {
        dossier.mettreAJourScore(85);
        dossier.soumettre();
        dossier.mettreEnCours(UUID.randomUUID()); // ← ajoute

        when(dossierRepository.trouverParId(dossierId)).thenReturn(Optional.of(dossier));
        when(dossierRepository.sauvegarder(any())).thenReturn(dossier);

        DossierInscription result = dossierService.rejeterDossier(
                new RejeterDossierCommand(dossierId, "Documents invalides")
        );

        assertThat(result.getStatut()).isEqualTo(StatutDossier.REJETE);
        assertThat(result.getRaisonRejet()).isEqualTo("Documents invalides");
    }

    @Test
    @DisplayName("Dossier introuvable lance une exception")
    void dossierIntrouvable() {
        when(dossierRepository.trouverParId(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dossierService.trouverParId(UUID.randomUUID()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("introuvable");
    }
}