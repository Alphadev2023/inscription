package com.inscription.inscription_backend.notification.infrastructure.web.dto;

public record WsNotificationDto(
        String type,
        String message,
        String date
) {}