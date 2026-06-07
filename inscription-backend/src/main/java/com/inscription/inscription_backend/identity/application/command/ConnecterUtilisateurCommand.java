package com.inscription.inscription_backend.identity.application.command;

public record ConnecterUtilisateurCommand(
        String email,
        String motDePasse
) {}