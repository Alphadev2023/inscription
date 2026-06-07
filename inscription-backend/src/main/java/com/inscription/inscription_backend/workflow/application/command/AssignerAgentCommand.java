package com.inscription.inscription_backend.workflow.application.command;

import java.util.UUID;

public record AssignerAgentCommand(
        UUID dossierId,
        UUID agentId  // null = assignation automatique
) {}