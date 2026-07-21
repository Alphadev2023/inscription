package com.inscription.inscription_backend.identity.infrastructure.oauth2;

import com.inscription.inscription_backend.identity.application.service.JwtService;
import com.inscription.inscription_backend.identity.domain.model.Utilisateur;
import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Utilisateur utilisateur = utilisateurRepository.trouverParEmail(email)
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable apres authentification Google"));

        String token = jwtService.genererToken(
                utilisateur.getId(),
                utilisateur.getEmail().getValeur(),
                utilisateur.getRole().name()
        );
        String refreshToken = jwtService.genererRefreshToken(utilisateur.getId());

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("refreshToken", refreshToken)
                .queryParam("role", utilisateur.getRole().name())
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}