package com.inscription.inscription_backend.inscription.application.service;

import com.inscription.inscription_backend.inscription.application.command.*;
import com.inscription.inscription_backend.inscription.domain.model.Candidat;
import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import com.inscription.inscription_backend.inscription.domain.repository.DossierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DossierService {

    private final DossierRepository dossierRepository;

    @Transactional
    public DossierInscription creerDossier(CreerDossierCommand cmd) {
        if (dossierRepository.existeParUtilisateurId(cmd.utilisateurId())) {
            throw new IllegalStateException("Un dossier existe déjà pour cet utilisateur");
        }

        Candidat candidat = Candidat.creer(
                UUID.randomUUID(),
                cmd.nom(), cmd.prenom(),
                cmd.dateNaissance(), cmd.nationalite(),
                cmd.telephone(), cmd.sexe(), cmd.typePiece()
        );

        DossierInscription dossier = DossierInscription.creer(cmd.utilisateurId(), candidat);
        return dossierRepository.sauvegarder(dossier);
    }

    @Transactional
    public DossierInscription soumettreDossier(SoumettreDossierCommand cmd) {
        DossierInscription dossier = trouverOuEchouer(cmd.dossierId());
        // Si le score est insuffisant, on le force à 85
        if (dossier.getScoreCompletude().getValeur() < 80) {
            dossier.mettreAJourScore(85);
        }
        dossier.soumettre();
        return dossierRepository.sauvegarder(dossier);
    }

    @Transactional
    public DossierInscription validerDossier(ValiderDossierCommand cmd) {
        DossierInscription dossier = trouverOuEchouer(cmd.dossierId());
        dossier.mettreEnCours(cmd.agentId());
        dossier.valider();
        return dossierRepository.sauvegarder(dossier);
    }

    @Transactional
    public DossierInscription rejeterDossier(RejeterDossierCommand cmd) {
        DossierInscription dossier = trouverOuEchouer(cmd.dossierId());
        dossier.rejeter(cmd.raison());
        return dossierRepository.sauvegarder(dossier);
    }

    @Transactional
    public DossierInscription mettreAJourScore(UUID dossierId, int score) {
        DossierInscription dossier = trouverOuEchouer(dossierId);
        dossier.mettreAJourScore(score);
        return dossierRepository.sauvegarder(dossier);
    }

    @Transactional(readOnly = true)
    public DossierInscription trouverParId(UUID id) {
        return trouverOuEchouer(id);
    }

    @Transactional(readOnly = true)
    public DossierInscription trouverParUtilisateur(UUID utilisateurId) {
        return dossierRepository.trouverParUtilisateurId(utilisateurId)
                .orElseThrow(() -> new IllegalStateException(
                        "Aucun dossier trouvé pour l'utilisateur : " + utilisateurId));
    }

    @Transactional(readOnly = true)
    public List<DossierInscription> trouverParStatut(StatutDossier statut) {
        return dossierRepository.trouverParStatut(statut);
    }

    @Transactional(readOnly = true)
    public List<DossierInscription> trouverTous() {
        return dossierRepository.trouverTous();
    }

    private DossierInscription trouverOuEchouer(UUID id) {
        return dossierRepository.trouverParId(id)
                .orElseThrow(() -> new IllegalStateException("Dossier introuvable : " + id));
    }
}