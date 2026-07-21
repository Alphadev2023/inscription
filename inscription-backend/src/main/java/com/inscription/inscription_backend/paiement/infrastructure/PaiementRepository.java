package com.inscription.inscription_backend.paiement.infrastructure;

import com.inscription.inscription_backend.paiement.domain.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
    Optional<Paiement> findByStripeSessionId(String stripeSessionId);
}