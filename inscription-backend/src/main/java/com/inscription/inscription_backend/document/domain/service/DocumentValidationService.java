package com.inscription.inscription_backend.document.domain.service;

import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentValidationService {

    private static final java.util.Set<String> MIME_TYPES_AUTORISES = java.util.Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png"
    );

    public void validerFichier(MultipartFile fichier, TypeDocument type) {
        // 1. Vérification taille
        if (fichier.getSize() > type.getTailleMaxBytes()) {
            throw new IllegalArgumentException(
                    "Fichier trop volumineux. Max autorisé : " +
                            (type.getTailleMaxBytes() / (1024 * 1024)) + " Mo"
            );
        }

        // 2. Vérification MIME type
        String mimeType = fichier.getContentType();
        if (mimeType == null || !MIME_TYPES_AUTORISES.contains(mimeType)) {
            throw new IllegalArgumentException(
                    "Type de fichier non autorisé : " + mimeType +
                            ". Acceptés : PDF, JPEG, PNG"
            );
        }

        // 3. Vérification cohérence type/format
        if ("application/pdf".equals(mimeType) && !type.acceptePdf()) {
            throw new IllegalArgumentException(
                    "Le type " + type + " n'accepte pas les PDF. Utilisez une image."
            );
        }

        if ((mimeType.startsWith("image/")) && !type.accepteImage() && !type.acceptePdf()) {
            throw new IllegalArgumentException(
                    "Le type " + type + " n'accepte pas les images."
            );
        }

        // 4. Vérification extension
        String nomFichier = fichier.getOriginalFilename();
        if (nomFichier == null || nomFichier.isBlank()) {
            throw new IllegalArgumentException("Nom de fichier invalide");
        }
    }
}