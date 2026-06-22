package com.inscription.inscription_backend.identity.infrastructure.web;

import com.inscription.inscription_backend.identity.domain.model.Role;
import com.inscription.inscription_backend.identity.domain.repository.UtilisateurRepository;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import com.inscription.inscription_backend.inscription.domain.repository.DossierRepository;
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
    private final DossierRepository dossierRepository;

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

    @GetMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UtilisateurResponse>> listerAgents() {
        List<UtilisateurResponse> agents = utilisateurRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.AGENT)
                .map(u -> new UtilisateurResponse(
                        u.getId().toString(),
                        u.getEmail().getValeur(),
                        u.getRole().name(),
                        u.isActif(),
                        u.getCreeLe().toString()
                ))
                .toList();
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getStats() {
        var dossiers = dossierRepository.trouverTous();
        long total      = dossiers.size();
        long soumis     = dossiers.stream().filter(d -> d.getStatut() == StatutDossier.SOUMIS).count();
        long enCours    = dossiers.stream().filter(d -> d.getStatut() == StatutDossier.EN_COURS).count();
        long valides    = dossiers.stream().filter(d -> d.getStatut() == StatutDossier.VALIDE).count();
        long rejetes    = dossiers.stream().filter(d -> d.getStatut() == StatutDossier.REJETE).count();
        long brouillons = dossiers.stream().filter(d -> d.getStatut() == StatutDossier.BROUILLON).count();
        double tauxValidation = total > 0 ? (valides * 100.0 / total) : 0;
        double tauxRejet      = total > 0 ? (rejetes * 100.0 / total) : 0;
        double scoreMoyen     = dossiers.stream().mapToInt(d -> d.getScoreCompletude().getValeur()).average().orElse(0);
        return ResponseEntity.ok(new DashboardStats(
                total, soumis, enCours, valides, rejetes, brouillons,
                tauxValidation, tauxRejet, scoreMoyen
        ));
    }

    public record UtilisateurResponse(String id, String email, String role, boolean actif, String creeLe) {}

    public record DashboardStats(
            long totalDossiers, long soumis, long enCours,
            long valides, long rejetes, long brouillons,
            double tauxValidation, double tauxRejet, double scoreMoyen
    ) {}
}
