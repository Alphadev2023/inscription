package com.inscription.inscription_backend.document.application.command;

import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

public record UploadDocumentCommand(
        UUID dossierId,
        TypeDocument type,
        MultipartFile fichier
) {}