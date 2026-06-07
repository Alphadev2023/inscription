package com.inscription.inscription_backend.inscription.infrastructure.persistence;

import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import com.inscription.inscription_backend.inscription.domain.repository.DossierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DossierPersistenceAdapter implements DossierRepository {

    private final DossierJpaRepository jpaRepository;

    @Override
    public DossierInscription sauvegarder(DossierInscription dossier) {
        return jpaRepository.save(dossier);
    }

    @Override
    public Optional<DossierInscription> trouverParId(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<DossierInscription> trouverParUtilisateurId(UUID utilisateurId) {
        return jpaRepository.findByUtilisateurId(utilisateurId);
    }

    @Override
    public List<DossierInscription> trouverParStatut(StatutDossier statut) {
        return jpaRepository.findByStatut(statut);
    }

    @Override
    public List<DossierInscription> trouverTous() {
        return jpaRepository.findAll();
    }

    @Override
    public boolean existeParUtilisateurId(UUID utilisateurId) {
        return jpaRepository.existsByUtilisateurId(utilisateurId);
    }
}