// DossierResponse.java
package com.inscription.inscription_backend.inscription.infrastructure.web.dto;

import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;

import java.time.LocalDateTime;
import java.util.UUID;

public record DossierResponse(
        UUID id,
        UUID utilisateurId,
        String nomCandidat,
        String prenomCandidat,
        StatutDossier statut,
        int scoreCompletude,
        int etapeActuelle,
        LocalDateTime creeLe,
        LocalDateTime soumisLe
) {
    public static DossierResponse depuis(DossierInscription d) {
        return new DossierResponse(
                d.getId(),
                d.getUtilisateurId(),
                d.getCandidat().getNom(),
                d.getCandidat().getPrenom(),
                d.getStatut(),
                d.getScoreCompletude().getValeur(),
                d.getEtapeActuelle(),
                d.getCreeLe(),
                d.getSoumisLe()
        );
    }
}