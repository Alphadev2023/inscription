package com.inscription.inscription_backend.inscription.domain.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class ScoreCompletude {

    private int valeur; // 0 à 100

    protected ScoreCompletude() {}

    public static ScoreCompletude de(int valeur) {
        if (valeur < 0 || valeur > 100) {
            throw new IllegalArgumentException("Score invalide : " + valeur);
        }
        ScoreCompletude s = new ScoreCompletude();
        s.valeur = valeur;
        return s;
    }

    public boolean estComplet() {
        return valeur == 100;
    }

    public boolean estSuffisantPourSoumission() {
        return valeur >= 80;
    }
}