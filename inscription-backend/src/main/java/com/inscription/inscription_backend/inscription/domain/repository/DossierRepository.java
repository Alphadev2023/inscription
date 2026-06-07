package com.inscription.inscription_backend.inscription.domain.repository;

import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DossierRepository {
    DossierInscription sauvegarder(DossierInscription dossier);
    Optional<DossierInscription> trouverParId(UUID id);
    Optional<DossierInscription> trouverParUtilisateurId(UUID utilisateurId);
    List<DossierInscription> trouverParStatut(StatutDossier statut);
    List<DossierInscription> trouverTous();
    boolean existeParUtilisateurId(UUID utilisateurId);
}