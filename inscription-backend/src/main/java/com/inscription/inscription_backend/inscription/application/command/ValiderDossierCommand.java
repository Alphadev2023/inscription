// ValiderDossierCommand.java
package com.inscription.inscription_backend.inscription.application.command;

import java.util.UUID;

public record ValiderDossierCommand(UUID dossierId, UUID agentId) {}