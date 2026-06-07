// RejeterDossierCommand.java
package com.inscription.inscription_backend.inscription.application.command;

import java.util.UUID;

public record RejeterDossierCommand(UUID dossierId, String raison) {}