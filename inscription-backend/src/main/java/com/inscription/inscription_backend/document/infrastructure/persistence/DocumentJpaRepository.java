package com.inscription.inscription_backend.document.infrastructure.persistence;

import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface DocumentJpaRepository extends JpaRepository<FichierDocument, UUID> {
    List<FichierDocument> findByDossierId(UUID dossierId);
    Optional<FichierDocument> findByDossierIdAndType(UUID dossierId, TypeDocument type);
}