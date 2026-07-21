package com.inscription.inscription_backend.paiement.infrastructure;

import com.inscription.inscription_backend.paiement.application.ReceiptPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
public class RecuController {

    private final PaiementRepository paiementRepository;
    private final ReceiptPdfService receiptPdfService;

    public RecuController(PaiementRepository paiementRepository, ReceiptPdfService receiptPdfService) {
        this.paiementRepository = paiementRepository;
        this.receiptPdfService = receiptPdfService;
    }

    @GetMapping("/{id}/recu")
    public ResponseEntity<byte[]> telechargerRecu(@PathVariable UUID id) {
        var paiement = paiementRepository.findById(id).orElseThrow();

        // TODO: recuperer le vrai nom etudiant et intitule inscription via les autres modules
        byte[] pdf = receiptPdfService.genererRecu(paiement, "Nom Etudiant", "Intitule inscription");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=recu-" + paiement.getNumeroRecu() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}