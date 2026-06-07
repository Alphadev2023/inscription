package com.inscription.inscription_backend.notification.domain.port;

import java.util.UUID;

public interface NotificationPort {
    void envoyerConfirmationSoumission(UUID utilisateurId, String email, String nomCandidat);
    void envoyerDossierValide(UUID utilisateurId, String email, String nomCandidat);
    void envoyerDossierRejete(UUID utilisateurId, String email, String nomCandidat, String raison);
    void envoyerDocumentValide(String email, String nomCandidat, String typeDocument);
    void envoyerDocumentRejete(String email, String nomCandidat, String typeDocument, String raison);
}