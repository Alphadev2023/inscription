package com.inscription.inscription_backend.inscription.infrastructure.web;

import com.inscription.inscription_backend.document.domain.repository.DocumentRepository;
import com.inscription.inscription_backend.inscription.application.command.*;
import com.inscription.inscription_backend.inscription.application.service.DossierService;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;
import com.inscription.inscription_backend.inscription.infrastructure.web.dto.CreerDossierRequest;
import com.inscription.inscription_backend.inscription.infrastructure.web.dto.DossierResponse;
import com.inscription.inscription_backend.inscription.infrastructure.web.dto.DossierSummaryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;
    private final DocumentRepository documentRepository;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DossierResponse> creer(
            @Valid @RequestBody CreerDossierRequest request,
            @AuthenticationPrincipal String utilisateurId) {

        var dossier = dossierService.creerDossier(new CreerDossierCommand(
                UUID.fromString(utilisateurId),
                request.nom(), request.prenom(),
                request.dateNaissance(), request.nationalite(),
                request.telephone(), request.sexe(), request.typePiece()
        ));
        return ResponseEntity.ok(DossierResponse.depuis(dossier));
    }

    @GetMapping("/mon-dossier")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DossierResponse> monDossier(
            @AuthenticationPrincipal String utilisateurId) {
        var dossier = dossierService.trouverParUtilisateur(UUID.fromString(utilisateurId));
        var docs = documentRepository.trouverParDossierId(dossier.getId());
        return ResponseEntity.ok(DossierResponse.depuis(dossier, docs));
    }

    @PostMapping("/{id}/soumettre")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DossierResponse> soumettre(@PathVariable UUID id) {
        var dossier = dossierService.soumettreDossier(new SoumettreDossierCommand(id));
        return ResponseEntity.ok(DossierResponse.depuis(dossier));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<List<DossierSummaryResponse>> listerTous(
            @RequestParam(required = false) StatutDossier statut) {
        var dossiers = statut != null
                ? dossierService.trouverParStatut(statut)
                : dossierService.trouverTous();
        return ResponseEntity.ok(dossiers.stream()
                .map(DossierSummaryResponse::depuis)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<DossierResponse> trouverParId(@PathVariable UUID id) {
        var dossier = dossierService.trouverParId(id);
        var docs = documentRepository.trouverParDossierId(id);
        return ResponseEntity.ok(DossierResponse.depuis(dossier, docs));
    }

    @PostMapping("/{id}/valider")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<DossierResponse> valider(
            @PathVariable UUID id,
            @AuthenticationPrincipal String agentId) {
        var dossier = dossierService.validerDossier(
                new ValiderDossierCommand(id, UUID.fromString(agentId)));
        return ResponseEntity.ok(DossierResponse.depuis(dossier));
    }

    @PostMapping("/{id}/rejeter")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<DossierResponse> rejeter(
            @PathVariable UUID id,
            @RequestParam String raison) {
        var dossier = dossierService.rejeterDossier(new RejeterDossierCommand(id, raison));
        return ResponseEntity.ok(DossierResponse.depuis(dossier));
    }

    @PutMapping("/{id}/score")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<DossierResponse> mettreAJourScore(
            @PathVariable UUID id,
            @RequestParam int score) {
        var dossier = dossierService.mettreAJourScore(id, score);
        return ResponseEntity.ok(DossierResponse.depuis(dossier));
    }
}