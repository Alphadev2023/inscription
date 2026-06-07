package com.inscription.inscription_backend.notification.infrastructure.persistence;

import com.inscription.inscription_backend.notification.domain.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

interface NotificationJpaRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUtilisateurId(UUID utilisateurId);
    List<Notification> findByEnvoyeFalse();
}