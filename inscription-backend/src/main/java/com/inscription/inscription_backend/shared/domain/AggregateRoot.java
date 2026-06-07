package com.inscription.inscription_backend.shared.domain;

import org.springframework.data.domain.AbstractAggregateRoot;
import java.util.UUID;

public abstract class AggregateRoot<ID> extends AbstractAggregateRoot<AggregateRoot<ID>> {

    public abstract ID getId();

    protected void enregistrerEvenement(Object event) {
        registerEvent(event);
    }
}