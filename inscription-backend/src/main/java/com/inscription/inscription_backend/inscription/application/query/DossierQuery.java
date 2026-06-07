package com.inscription.inscription_backend.inscription.application.query;

import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import java.util.UUID;

public record DossierQuery(
        UUID dossierId,
        UUID utilisateurId,
        StatutDossier statut
) {
    // Query pour trouver par ID
    public static DossierQuery parId(UUID dossierId) {
        return new DossierQuery(dossierId, null, null);
    }

    // Query pour trouver par utilisateur
    public static DossierQuery parUtilisateur(UUID utilisateurId) {
        return new DossierQuery(null, utilisateurId, null);
    }

    // Query pour filtrer par statut
    public static DossierQuery parStatut(StatutDossier statut) {
        return new DossierQuery(null, null, statut);
    }
}