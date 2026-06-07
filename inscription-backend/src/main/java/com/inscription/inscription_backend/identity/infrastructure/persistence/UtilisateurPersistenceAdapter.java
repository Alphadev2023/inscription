package com.inscription.inscription_backend.identity.infrastructure.persistence;

import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UtilisateurPersistenceAdapter implements UtilisateurRepository {

    private final UtilisateurJpaRepository jpaRepository;

    @Override
    public Utilisateur sauvegarder(Utilisateur utilisateur) {
        return jpaRepository.save(utilisateur);
    }

    @Override
    public Optional<Utilisateur> trouverParEmail(String email) {
        return jpaRepository.findByEmail_Valeur(email);
    }

    @Override
    public Optional<Utilisateur> trouverParId(UUID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public boolean existeParEmail(String email) {
        return jpaRepository.existsByEmail_Valeur(email);
    }
}