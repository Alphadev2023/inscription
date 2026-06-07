package com.inscription.inscription_backend.notification.infrastructure.persistence;

import com.inscription.inscription_backend.notification.domain.model.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationPersistenceAdapter {

    private final NotificationJpaRepository jpaRepository;

    public Notification sauvegarder(Notification notification) {
        return jpaRepository.save(notification);
    }

    public List<Notification> trouverParUtilisateurId(UUID utilisateurId) {
        return jpaRepository.findByUtilisateurId(utilisateurId);
    }

    public List<Notification> trouverNonEnvoyes() {
        return jpaRepository.findByEnvoyeFalse();
    }
}