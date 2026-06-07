package com.inscription.inscription_backend.inscription.domain.event;

import java.util.UUID;

public record DossierRejeteEvent(
        UUID dossierId,
        UUID utilisateurId,
        String nomCandidat,
        String raisonRejet
) {}