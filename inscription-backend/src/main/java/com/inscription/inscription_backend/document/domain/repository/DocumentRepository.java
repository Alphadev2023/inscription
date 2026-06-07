package com.inscription.inscription_backend.document.domain.repository;

import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository {
    FichierDocument sauvegarder(FichierDocument document);
    Optional<FichierDocument> trouverParId(UUID id);
    List<FichierDocument> trouverParDossierId(UUID dossierId);
    Optional<FichierDocument> trouverParDossierIdEtType(UUID dossierId, TypeDocument type);
    void supprimer(UUID id);
}