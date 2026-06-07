package com.inscription.inscription_backend.identity.infrastructure.persistence;

import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

interface UtilisateurJpaRepository extends JpaRepository<Utilisateur, UUID> {
    Optional<Utilisateur> findByEmail_Valeur(String email);
    boolean existsByEmail_Valeur(String email);
}