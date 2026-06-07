package com.inscription.inscription_backend.notification.application.command;

import com.inscription.inscription_backend.notification.domain.model.TypeNotification;
import java.util.UUID;

public record EnvoyerNotificationCommand(
        UUID utilisateurId,
        TypeNotification type,
        String destinataire,
        String nomCandidat,
        String parametreSupplementaire
) {}