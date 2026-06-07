package com.inscription.inscription_backend.identity.domain.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class MotDePasse {

    private String hashValeur;

    protected MotDePasse() {}

    public static MotDePasse depuisHash(String hash) {
        MotDePasse mp = new MotDePasse();
        mp.hashValeur = hash;
        return mp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MotDePasse)) return false;
        return hashValeur.equals(((MotDePasse) o).hashValeur);
    }

    @Override
    public int hashCode() { return hashValeur.hashCode(); }
}