package com.inscription.inscription_backend.workflow.infrastructure.web.dto;

public record WorkflowStatsResponse(
        long totalSoumis,
        long enCours,
        long valides,
        long rejetes,
        long enRetard,
        long urgents
) {}