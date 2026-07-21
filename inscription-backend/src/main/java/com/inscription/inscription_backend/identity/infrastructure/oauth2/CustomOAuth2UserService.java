package com.inscription.inscription_backend.identity.infrastructure.oauth2;

import com.inscription.inscription_backend.identity.domain.model.Email;
import com.inscription.inscription_backend.identity.domain.model.MotDePasse;
import com.inscription.inscription_backend.identity.domain.model.Role;
import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new OAuth2AuthenticationException("Email introuvable dans le compte Google");
        }

        utilisateurRepository.trouverParEmail(email).orElseGet(() -> {
            String hashAleatoire = passwordEncoder.encode(UUID.randomUUID().toString());
            Utilisateur nouveau = Utilisateur.creer(
                    Email.de(email),
                    MotDePasse.depuisHash(hashAleatoire),
                    Role.CANDIDAT
            );
            return utilisateurRepository.sauvegarder(nouveau);
        });

        return oAuth2User;
    }
}