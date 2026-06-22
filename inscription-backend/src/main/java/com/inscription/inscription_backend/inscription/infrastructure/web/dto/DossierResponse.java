package com.inscription.inscription_backend.inscription.infrastructure.web.dto;

import com.inscription.inscription_backend.document.domain.model.FichierDocument;
import com.inscription.inscription_backend.document.domain.model.StatutValidation;
import com.inscription.inscription_backend.document.domain.model.TypeDocument;
import com.inscription.inscription_backend.document.domain.repository.DocumentRepository;
import com.inscription.inscription_backend.inscription.domain.model.Candidat;
import com.inscription.inscription_backend.inscription.domain.model.DossierInscription;
import com.inscription.inscription_backend.inscription.domain.model.StatutDossier;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DossierResponse(
        UUID id,
        UUID utilisateurId,
        String nomCandidat,
        String prenomCandidat,
        StatutDossier statut,
        int scoreCompletude,
        int etapeActuelle,
        LocalDateTime creeLe,
        LocalDateTime soumisLe,
        LocalDateTime traiteLe,
        String raisonRejet,
        CandidatDto candidat,
        List<DocumentDto> documents
) {
    public record CandidatDto(
            UUID id, String nom, String prenom, String dateNaissance,
            String nationalite, String telephone, String adresse,
            String sexe, String typePiece, String numeroIdentite
    ) {}

    public record DocumentDto(
            UUID id, String type, String nomFichierOriginal,
            String cheminStockage, String mimeType, Long taille,
            String statut, String raisonRejet
    ) {}

    public static DossierResponse depuis(DossierInscription d) {
        return depuis(d, List.of());
    }

    public static DossierResponse depuis(DossierInscription d, List<FichierDocument> docs) {
        Candidat c = d.getCandidat();
        CandidatDto candidatDto = c == null ? null : new CandidatDto(
                c.getId(),
                c.getNom(), c.getPrenom(),
                c.getDateNaissance() != null ? c.getDateNaissance().toString() : null,
                c.getNationalite(), c.getTelephone(), c.getAdresse(),
                c.getSexe() != null ? c.getSexe().name() : null,
                c.getTypePiece() != null ? c.getTypePiece().name() : null,
                c.getNumeroIdentite()
        );

        List<DocumentDto> documentDtos = docs.stream()
                .map(doc -> new DocumentDto(
                        doc.getId(),
                        doc.getType().name(),
                        doc.getNomFichierOriginal(),
                        doc.getCheminStockage(),
                        doc.getMimeType(),
                        doc.getTaille(),
                        doc.getStatut().name(),
                        doc.getRaisonRejet()
                ))
                .toList();

        return new DossierResponse(
                d.getId(),
                d.getUtilisateurId(),
                c != null ? c.getNom() : "",
                c != null ? c.getPrenom() : "",
                d.getStatut(),
                d.getScoreCompletude().getValeur(),
                d.getEtapeActuelle(),
                d.getCreeLe(),
                d.getSoumisLe(),
                d.getTraiteLe(),
                d.getRaisonRejet(),
                candidatDto,
                documentDtos
        );
    }
}