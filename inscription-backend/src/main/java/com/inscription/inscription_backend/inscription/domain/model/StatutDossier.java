package com.inscription.inscription_backend.inscription.domain.model;

public enum StatutDossier {
    BROUILLON,
    SOUMIS,
    EN_COURS,
    VALIDE,
    REJETE,
    RECOURS;

    public boolean peutTransitionnerVers(StatutDossier cible) {
        return switch (this) {
            case BROUILLON -> cible == SOUMIS;
            case SOUMIS    -> cible == EN_COURS;
            case EN_COURS  -> cible == VALIDE || cible == REJETE;
            case REJETE    -> cible == RECOURS;
            default        -> false;
        };
    }
}