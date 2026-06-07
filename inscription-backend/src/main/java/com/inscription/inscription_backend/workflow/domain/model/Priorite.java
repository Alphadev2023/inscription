package com.inscription.inscription_backend.workflow.domain.model;

public enum Priorite {
    BASSE,
    NORMALE,
    HAUTE,
    URGENTE;

    // Plus le score est élevé, plus la priorité est haute
    public static Priorite calculer(int scoreCompletude, long heuresDepuisSoumission) {
        if (heuresDepuisSoumission > 48) return URGENTE;
        if (heuresDepuisSoumission > 24) return HAUTE;
        if (scoreCompletude >= 90)       return HAUTE;
        if (scoreCompletude >= 80)       return NORMALE;
        return BASSE;
    }
}