package com.inscription.inscription_backend.identity.infrastructure.web;

import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;

    @GetMapping("/utilisateurs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UtilisateurResponse>> listerUtilisateurs() {
        List<UtilisateurResponse> users = utilisateurRepository.findAll()
                .stream()
                .map(u -> new UtilisateurResponse(
                        u.getId().toString(),
                        u.getEmail().getValeur(),
                        u.getRole().name(),
                        u.isActif(),
                        u.getCreeLe().toString()
                ))
                .toList();
        return ResponseEntity.ok(users);
    }

    public record UtilisateurResponse(
            String id,
            String email,
            String role,
            boolean actif,
            String creeLe
    ) {}
}