package com.inscription.inscription_backend.inscription.infrastructure.web.dto;

import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;

import java.time.LocalDateTime;
import java.util.UUID;

public record DossierSummaryResponse(
        UUID id,
        String nomCandidat,
        String prenomCandidat,
        StatutDossier statut,
        int scoreCompletude,
        int etapeActuelle,
        LocalDateTime creeLe
) {
    // Version allégée de DossierResponse pour les listes (dashboard admin)
    public static DossierSummaryResponse depuis(DossierInscription d) {
        return new DossierSummaryResponse(
                d.getId(),
                d.getCandidat().getNom(),
                d.getCandidat().getPrenom(),
                d.getStatut(),
                d.getScoreCompletude().getValeur(),
                d.getEtapeActuelle(),
                d.getCreeLe()
        );
    }
}