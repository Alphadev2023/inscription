package com.inscription.inscription_backend.shared.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public abstract class DomainEvent {
    private final String eventId = UUID.randomUUID().toString();
    private final LocalDateTime occurredOn = LocalDateTime.now();

    public String getEventId() { return eventId; }
    public LocalDateTime getOccurredOn() { return occurredOn; }
}