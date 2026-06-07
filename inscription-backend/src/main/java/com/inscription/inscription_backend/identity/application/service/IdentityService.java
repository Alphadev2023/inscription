package com.inscription.inscription_backend.identity.application.service;

import com.inscription.inscription_backend.identity.application.command.ConnecterUtilisateurCommand;
import com.inscription.inscription_backend.identity.application.command.CreerUtilisateurCommand;
import com.inscription.inscription_backend.identity.domain.model.Email;
import com.inscription.inscription_backend.identity.domain.model.MotDePasse;
import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import com.inscription.inscription_backend.identity.infrastructure.web.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse inscrire(CreerUtilisateurCommand command) {
        if (utilisateurRepository.existeParEmail(command.email())) {
            throw new IllegalStateException("Email déjà utilisé : " + command.email());
        }

        String hash = passwordEncoder.encode(command.motDePasse());

        Utilisateur utilisateur = Utilisateur.creer(
                Email.de(command.email()),
                MotDePasse.depuisHash(hash),
                command.role()
        );

        utilisateurRepository.sauvegarder(utilisateur);

        String token = jwtService.genererToken(
                utilisateur.getId(),
                utilisateur.getEmail().getValeur(),
                utilisateur.getRole().name()
        );

        String refreshToken = jwtService.genererRefreshToken(utilisateur.getId());

        return new AuthResponse(token, refreshToken, utilisateur.getRole().name());
    }

    @Transactional(readOnly = true)
    public AuthResponse connecter(ConnecterUtilisateurCommand command) {
        Utilisateur utilisateur = utilisateurRepository
                .trouverParEmail(command.email())
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

        if (!utilisateur.isActif()) {
            throw new IllegalStateException("Compte désactivé");
        }

        if (!passwordEncoder.matches(command.motDePasse(), utilisateur.getMotDePasse().getHashValeur())) {
            throw new BadCredentialsException("Identifiants invalides");
        }

        String token = jwtService.genererToken(
                utilisateur.getId(),
                utilisateur.getEmail().getValeur(),
                utilisateur.getRole().name()
        );

        String refreshToken = jwtService.genererRefreshToken(utilisateur.getId());

        return new AuthResponse(token, refreshToken, utilisateur.getRole().name());
    }
}