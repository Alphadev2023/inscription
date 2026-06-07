package com.inscription.inscription_backend.identity.domain.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Email {

    private String valeur;

    protected Email() {}

    public static Email de(String valeur) {
        if (valeur == null || !valeur.matches("^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$")) {
            throw new IllegalArgumentException("Email invalide : " + valeur);
        }
        Email e = new Email();
        e.valeur = valeur.toLowerCase().trim();
        return e;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email)) return false;
        return valeur.equals(((Email) o).valeur);
    }

    @Override
    public int hashCode() { return valeur.hashCode(); }
}