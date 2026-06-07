package com.inscription.inscription_backend.identity.infrastructure.web.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String role
) {}