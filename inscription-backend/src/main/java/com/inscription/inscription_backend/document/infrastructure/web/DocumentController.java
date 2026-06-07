package com.inscription.inscription_backend.document.infrastructure.web;

import com.inscription.inscription_backend.document.application.command.UploadDocumentCommand;
import com.inscription.inscription_backend.document.application.command.ValiderDocumentCommand;
import com.inscription.inscription_backend.document.application.service.DocumentService;
import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import com.inscription.inscription_backend.document.infrastructure.web.dto.DocumentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // ── Candidat ────────────────────────────────────────────

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DocumentResponse> uploader(
            @RequestParam UUID dossierId,
            @RequestParam TypeDocument type,
            @RequestParam("fichier") MultipartFile fichier) {

        var document = documentService.uploaderDocument(
                new UploadDocumentCommand(dossierId, type, fichier)
        );
        return ResponseEntity.ok(DocumentResponse.depuis(document));
    }

    @GetMapping("/dossier/{dossierId}")
    @PreAuthorize("hasAnyRole('CANDIDAT', 'AGENT', 'ADMIN')")
    public ResponseEntity<List<DocumentResponse>> listerParDossier(
            @PathVariable UUID dossierId) {

        return ResponseEntity.ok(
                documentService.listerParDossier(dossierId).stream()
                        .map(DocumentResponse::depuis)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CANDIDAT', 'AGENT', 'ADMIN')")
    public ResponseEntity<DocumentResponse> trouverParId(@PathVariable UUID id) {
        return ResponseEntity.ok(
                DocumentResponse.depuis(documentService.trouverParId(id))
        );
    }

    // ── Agent / Admin ────────────────────────────────────────

    @PostMapping("/{id}/valider")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<DocumentResponse> valider(
            @PathVariable UUID id,
            @RequestParam boolean approuve,
            @RequestParam(required = false) String raisonRejet) {

        var document = documentService.validerDocument(
                new ValiderDocumentCommand(id, approuve, raisonRejet)
        );
        return ResponseEntity.ok(DocumentResponse.depuis(document));
    }

    // ── Téléchargement ───────────────────────────────────────

    @GetMapping("/{id}/telecharger")
    @PreAuthorize("hasAnyRole('CANDIDAT', 'AGENT', 'ADMIN')")
    public ResponseEntity<byte[]> telecharger(@PathVariable UUID id) {
        FichierDocument document = documentService.trouverParId(id);
        byte[] contenu = documentService.lireFichier(document);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getMimeType()))
                .header("Content-Disposition",
                        "attachment; filename=\"" + document.getNomFichierOriginal() + "\"")
                .body(contenu);
    }
}