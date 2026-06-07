package com.inscription.inscription_backend.document.application.service;

import com.inscription.inscription_backend.document.application.command.UploadDocumentCommand;
import com.inscription.inscription_backend.document.application.command.ValiderDocumentCommand;
import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.repository.DocumentRepository;
import com.inscription.inscription_backend.document.domain.service.DocumentValidationService;
import com.inscription.inscription_backend.document.infrastructure.storage.LocalStorageAdapter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentValidationService validationService;
    private final LocalStorageAdapter storageAdapter;

    @Transactional
    public FichierDocument uploaderDocument(UploadDocumentCommand cmd) {
        // 1. Valider le fichier (taille, format, type)
        validationService.validerFichier(cmd.fichier(), cmd.type());

        // 2. Stocker le fichier
        String nomStockage = storageAdapter.stocker(cmd.fichier(), cmd.dossierId());
        String chemin = storageAdapter.getChemin(nomStockage);

        // 3. Supprimer l'ancien fichier du même type si existant
        documentRepository.trouverParDossierIdEtType(cmd.dossierId(), cmd.type())
                .ifPresent(ancien -> {
                    storageAdapter.supprimer(ancien.getNomFichierStockage());
                    documentRepository.supprimer(ancien.getId());
                });

        // 4. Créer l'entité
        FichierDocument document = FichierDocument.creer(
                cmd.dossierId(),
                cmd.type(),
                cmd.fichier().getOriginalFilename(),
                nomStockage,
                chemin,
                cmd.fichier().getContentType(),
                cmd.fichier().getSize()
        );

        return documentRepository.sauvegarder(document);
    }

    @Transactional
    public FichierDocument validerDocument(ValiderDocumentCommand cmd) {
        FichierDocument document = trouverOuEchouer(cmd.documentId());

        if (cmd.approuve()) {
            document.valider();
        } else {
            if (cmd.raisonRejet() == null || cmd.raisonRejet().isBlank()) {
                throw new IllegalArgumentException("Raison de rejet obligatoire");
            }
            document.rejeter(cmd.raisonRejet());
        }

        return documentRepository.sauvegarder(document);
    }

    @Transactional(readOnly = true)
    public List<FichierDocument> listerParDossier(UUID dossierId) {
        return documentRepository.trouverParDossierId(dossierId);
    }

    @Transactional(readOnly = true)
    public FichierDocument trouverParId(UUID id) {
        return trouverOuEchouer(id);
    }

    private FichierDocument trouverOuEchouer(UUID id) {
        return documentRepository.trouverParId(id)
                .orElseThrow(() -> new IllegalStateException("Document introuvable : " + id));
    }
    public byte[] lireFichier(FichierDocument document) {
        return storageAdapter.lire(
                document.getDossierId().toString(),
                document.getNomFichierStockage()
        );
    }
}