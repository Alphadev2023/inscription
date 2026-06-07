package com.inscription.inscription_backend.document.infrastructure.web.dto;

import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.StatutValidation;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse(
        UUID id,
        UUID dossierId,
        TypeDocument type,
        String nomFichierOriginal,
        String mimeType,
        Long taille,
        StatutValidation statut,
        String raisonRejet,
        LocalDateTime uploadeLe
) {
    public static DocumentResponse depuis(FichierDocument d) {
        return new DocumentResponse(
                d.getId(),
                d.getDossierId(),
                d.getType(),
                d.getNomFichierOriginal(),
                d.getMimeType(),
                d.getTaille(),
                d.getStatut(),
                d.getRaisonRejet(),
                d.getUploadeLe()
        );
    }
}