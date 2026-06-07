package com.inscription.inscription_backend.identity.domain.repository;

import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import java.util.Optional;
import java.util.UUID;

public interface UtilisateurRepository {
    Utilisateur sauvegarder(Utilisateur utilisateur);
    Optional<Utilisateur> trouverParEmail(String email);
    Optional<Utilisateur> trouverParId(UUID id);
    boolean existeParEmail(String email);
}