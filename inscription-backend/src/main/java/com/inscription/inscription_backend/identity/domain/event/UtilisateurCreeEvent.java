package com.inscription.inscription_backend.identity.domain.event;

import com.inscription.inscription_backend.identity.domain.model.Role;
import java.time.LocalDateTime;
import java.util.UUID;

public record UtilisateurCreeEvent(
        UUID utilisateurId,
        String email,
        Role role,
        LocalDateTime occurredOn
) {
    public UtilisateurCreeEvent(UUID utilisateurId, String email, Role role) {
        this(utilisateurId, email, role, LocalDateTime.now());
    }
}