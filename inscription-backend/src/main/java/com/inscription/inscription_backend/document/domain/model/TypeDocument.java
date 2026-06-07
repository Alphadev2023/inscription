package com.inscription.inscription_backend.document.domain.model;

public enum TypeDocument {
    DIPLOME_BAC,
    DIPLOME_SUPERIEUR,
    CNI_RECTO,
    CNI_VERSO,
    ACTE_NAISSANCE,
    PHOTO_IDENTITE;

    public long getTailleMaxBytes() {
        return switch (this) {
            case PHOTO_IDENTITE -> 2 * 1024 * 1024L;  // 2 Mo
            default             -> 5 * 1024 * 1024L;  // 5 Mo
        };
    }

    public boolean acceptePdf() {
        return this != PHOTO_IDENTITE && this != CNI_RECTO && this != CNI_VERSO;
    }

    public boolean accepteImage() {
        return this == PHOTO_IDENTITE || this == CNI_RECTO || this == CNI_VERSO;
    }
}