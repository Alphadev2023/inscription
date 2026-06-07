package com.inscription.inscription_backend.inscription.domain.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record DossierValideEvent(
        UUID dossierId,
        UUID utilisateurId,
        String nomCandidat,
        String prenomCandidat
) {}