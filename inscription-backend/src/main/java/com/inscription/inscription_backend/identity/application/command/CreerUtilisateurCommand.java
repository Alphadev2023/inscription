package com.inscription.inscription_backend.identity.application.command;

import com.inscription.inscription_backend.identity.domain.model.Role;

public record CreerUtilisateurCommand(
        String email,
        String motDePasse,
        Role role
) {}