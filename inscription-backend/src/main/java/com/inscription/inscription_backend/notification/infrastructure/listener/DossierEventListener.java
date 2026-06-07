package com.inscription.inscription_backend.notification.infrastructure.listener;

import com.inscription.inscription_backend.document.domain.event.DocumentValideEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierRejeteEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierSoumisEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierValideEvent;
import com.inscription.inscription_backend.notification.domain.port.NotificationPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DossierEventListener {

    private final NotificationPort notificationPort;

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierSoumis(DossierSoumisEvent event) {
        log.info("Event reçu : DossierSoumis pour {}", event.nomCandidat());
        try {
            notificationPort.envoyerConfirmationSoumission(
                    event.utilisateurId(),           // ← UUID utilisateur
                    "candidat@inscription.com",
                    event.nomCandidat() + " " + event.prenomCandidat()
            );
        } catch (Exception e) {
            log.warn("Notification soumission - erreur : {}", e.getMessage());
        }
    }

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierValide(DossierValideEvent event) {
        log.info("Event reçu : DossierValide pour {}", event.nomCandidat());
        try {
            notificationPort.envoyerDossierValide(
                    event.utilisateurId(),
                    "candidat@inscription.com",
                    event.nomCandidat() + " " + event.prenomCandidat()
            );
        } catch (Exception e) {
            log.warn("Notification validé - erreur : {}", e.getMessage());
        }
    }

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierRejete(DossierRejeteEvent event) {
        log.info("Event reçu : DossierRejete pour {}", event.nomCandidat());
        try {
            notificationPort.envoyerDossierRejete(
                    event.utilisateurId(),
                    "candidat@inscription.com",
                    event.nomCandidat(),
                    event.raisonRejet()
            );
        } catch (Exception e) {
            log.warn("Notification rejeté - erreur : {}", e.getMessage());
        }
    }

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDocumentValide(DocumentValideEvent event) {
        log.info("Event reçu : DocumentValide type {}", event.type());
        try {
            notificationPort.envoyerDocumentValide(
                    "candidat@inscription.com",
                    "Candidat",
                    event.type().name()
            );
        } catch (Exception e) {
            log.warn("Notification document - erreur : {}", e.getMessage());
        }
    }
}