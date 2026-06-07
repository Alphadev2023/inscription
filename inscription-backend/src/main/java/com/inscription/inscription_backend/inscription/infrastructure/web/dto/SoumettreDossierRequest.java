package com.inscription.inscription_backend.inscription.infrastructure.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SoumettreDossierRequest(
        @NotNull UUID dossierId,
        @Min(80) int scoreCompletude  // minimum 80% pour soumettre
) {}