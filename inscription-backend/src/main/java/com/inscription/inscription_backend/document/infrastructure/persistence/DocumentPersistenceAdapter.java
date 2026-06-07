package com.inscription.inscription_backend.document.infrastructure.persistence;

import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import com.inscription.inscription_backend.document.domain.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DocumentPersistenceAdapter implements DocumentRepository {

    private final DocumentJpaRepository jpaRepository;

    @Override
    public FichierDocument sauvegarder(FichierDocument document) {
        return jpaRepository.save(document);
    }

    @Override
    public Optional<FichierDocument> trouverParId(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<FichierDocument> trouverParDossierId(UUID dossierId) {
        return jpaRepository.findByDossierId(dossierId);
    }

    @Override
    public Optional<FichierDocument> trouverParDossierIdEtType(UUID dossierId, TypeDocument type) {
        return jpaRepository.findByDossierIdAndType(dossierId, type);
    }

    @Override
    public void supprimer(UUID id) {
        jpaRepository.deleteById(id);
    }
}