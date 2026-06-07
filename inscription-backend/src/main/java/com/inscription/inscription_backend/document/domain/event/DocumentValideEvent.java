package com.inscription.inscription_backend.document.domain.event;

import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentValideEvent(
        UUID documentId,
        UUID dossierId,
        TypeDocument type,
        LocalDateTime occurredOn
) {
    public DocumentValideEvent(UUID documentId, UUID dossierId, TypeDocument type) {
        this(documentId, dossierId, type, LocalDateTime.now());
    }
}