package com.inscription.inscription_backend.identity.infrastructure.web;

import com.inscription.inscription_backend.identity.application.command.ConnecterUtilisateurCommand;
import com.inscription.inscription_backend.identity.application.command.CreerUtilisateurCommand;
import com.inscription.inscription_backend.identity.application.service.IdentityService;
import com.inscription.inscription_backend.identity.domain.model.Role;
import com.inscription.inscription_backend.identity.infrastructure.web.dto.AuthResponse;
import com.inscription.inscription_backend.identity.infrastructure.web.dto.LoginRequest;
import com.inscription.inscription_backend.identity.infrastructure.web.dto.RegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IdentityService identityService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        Role role = request.role() != null
                ? Role.valueOf(request.role().toUpperCase())
                : Role.CANDIDAT;

        AuthResponse response = identityService.inscrire(
                new CreerUtilisateurCommand(request.email(), request.motDePasse(), role)
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = identityService.connecter(
                new ConnecterUtilisateurCommand(request.email(), request.motDePasse())
        );
        return ResponseEntity.ok(response);
    }
}