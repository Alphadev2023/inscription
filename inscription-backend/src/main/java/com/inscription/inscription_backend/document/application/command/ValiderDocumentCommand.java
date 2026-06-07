package com.inscription.inscription_backend.document.application.command;

import java.util.UUID;

public record ValiderDocumentCommand(
        UUID documentId,
        boolean approuve,
        String raisonRejet
) {}