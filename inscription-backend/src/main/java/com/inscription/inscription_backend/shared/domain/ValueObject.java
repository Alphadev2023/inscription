package com.inscription.inscription_backend.shared.domain;

public abstract class ValueObject {
    // Les Value Objects sont comparés par valeur
    @Override
    public abstract boolean equals(Object o);

    @Override
    public abstract int hashCode();
}