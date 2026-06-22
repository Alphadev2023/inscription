package com.inscription.inscription_backend.notification.application.service;

import com.inscription.inscription_backend.notification.application.command.EnvoyerNotificationCommand;
import com.inscription.inscription_backend.notification.domain.model.Notification;
import com.inscription.inscription_backend.notification.domain.model.TypeNotification;
import com.inscription.inscription_backend.notification.domain.port.NotificationPort;
import com.inscription.inscription_backend.notification.infrastructure.email.EmailAdapter;
import com.inscription.inscription_backend.notification.infrastructure.email.template.EmailTemplateService;
import com.inscription.inscription_backend.notification.infrastructure.persistence.NotificationPersistenceAdapter;
import com.inscription.inscription_backend.notification.infrastructure.web.dto.WsNotificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService implements NotificationPort {

    private final EmailAdapter emailAdapter;
    private final EmailTemplateService templateService;
    private final NotificationPersistenceAdapter notificationRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void envoyerConfirmationSoumission(UUID utilisateurId, String email, String nomCandidat) {
        envoyer(new EnvoyerNotificationCommand(
                utilisateurId, TypeNotification.DOSSIER_SOUMIS, email, nomCandidat, null
        ));
    }

    @Override
    @Transactional
    public void envoyerDossierValide(UUID utilisateurId, String email, String nomCandidat) {
        envoyer(new EnvoyerNotificationCommand(
                utilisateurId, TypeNotification.DOSSIER_VALIDE, email, nomCandidat, null
        ));
    }

    @Override
    @Transactional
    public void envoyerDossierRejete(UUID utilisateurId, String email, String nomCandidat, String raison) {
        envoyer(new EnvoyerNotificationCommand(
                utilisateurId, TypeNotification.DOSSIER_REJETE, email, nomCandidat, raison
        ));
    }

    @Override
    @Transactional
    public void envoyerDocumentValide(String email, String nomCandidat, String typeDocument) {
        envoyer(new EnvoyerNotificationCommand(
                null, TypeNotification.DOCUMENT_VALIDE, email, nomCandidat, typeDocument
        ));
    }

    @Override
    @Transactional
    public void envoyerDocumentRejete(String email, String nomCandidat, String typeDocument, String raison) {
        envoyer(new EnvoyerNotificationCommand(
                null, TypeNotification.DOCUMENT_REJETE, email, nomCandidat, typeDocument + "|" + raison
        ));
    }

    @Transactional
    public void envoyer(EnvoyerNotificationCommand cmd) {
        String sujet   = templateService.getSujet(cmd.type(), cmd.nomCandidat());
        String contenu = templateService.getContenu(cmd.type(), cmd.nomCandidat(), cmd.parametreSupplementaire());

        Notification notification = Notification.creer(
                cmd.utilisateurId() != null ? cmd.utilisateurId() : UUID.randomUUID(),
                cmd.type(), cmd.destinataire(), sujet, contenu
        );

        try {
            emailAdapter.envoyer(cmd.destinataire(), sujet, contenu);
            notification.marquerEnvoye();
            log.info("Email envoyÃƒÂ© ÃƒÂ  {} pour {}", cmd.destinataire(), cmd.type());
        } catch (Exception e) {
            notification.marquerEchec(e.getMessage());
            log.error("Ãƒâ€°chec envoi email ÃƒÂ  {} : {}", cmd.destinataire(), e.getMessage());
        }

        notificationRepo.sauvegarder(notification);

        if (cmd.utilisateurId() != null) {
            try {
                messagingTemplate.convertAndSendToUser(
                        cmd.utilisateurId().toString(),
                        "/queue/notifications",
                        new WsNotificationDto(cmd.type().name(), sujet, LocalDateTime.now().toString())
                );
                log.info("WebSocket envoyÃƒÂ© ÃƒÂ  {}", cmd.utilisateurId());
                messagingTemplate.convertAndSend("/topic/notifications", new WsNotificationDto(cmd.type().name(), sujet, LocalDateTime.now().toString()));
            } catch (Exception e) {
                log.warn("Ãƒâ€°chec envoi WebSocket : {}", e.getMessage());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<Notification> trouverParUtilisateur(UUID utilisateurId) {
        return notificationRepo.trouverParUtilisateurId(utilisateurId);
    }
}
