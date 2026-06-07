package com.inscription.inscription_backend.inscription.infrastructure.persistence;

import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface DossierJpaRepository extends JpaRepository<DossierInscription, UUID> {
    Optional<DossierInscription> findByUtilisateurId(UUID utilisateurId);
    List<DossierInscription> findByStatut(StatutDossier statut);
    boolean existsByUtilisateurId(UUID utilisateurId);
}