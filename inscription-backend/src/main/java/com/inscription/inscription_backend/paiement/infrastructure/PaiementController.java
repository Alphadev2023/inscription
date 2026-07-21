package com.inscription.inscription_backend.paiement.infrastructure;

import com.inscription.inscription_backend.paiement.application.StripeCheckoutService;
import com.inscription.inscription_backend.paiement.domain.Paiement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final StripeCheckoutService checkoutService;
    private final PaiementRepository paiementRepository;

    public PaiementController(StripeCheckoutService checkoutService, PaiementRepository paiementRepository) {
        this.checkoutService = checkoutService;
        this.paiementRepository = paiementRepository;
    }

    public record CreerPaiementRequest(UUID inscriptionId, BigDecimal montant, String libelle) {}

    public record PaiementResponse(
            UUID id,
            UUID inscriptionId,
            BigDecimal montant,
            String devise,
            String statut,
            String numeroRecu,
            String dateCreation,
            String datePaiement
    ) {
        static PaiementResponse from(Paiement p) {
            return new PaiementResponse(
                    p.getId(),
                    p.getInscriptionId(),
                    p.getMontant(),
                    p.getDevise(),
                    p.getStatut().name(),
                    p.getNumeroRecu(),
                    p.getDateCreation() != null ? p.getDateCreation().toString() : null,
                    p.getDatePaiement() != null ? p.getDatePaiement().toString() : null
            );
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> creerCheckout(@RequestBody CreerPaiementRequest req) throws Exception {
        String url = checkoutService.creerSessionPaiement(req.inscriptionId(), req.montant(), req.libelle());
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/by-session/{sessionId}")
    public ResponseEntity<PaiementResponse> getBySessionId(@PathVariable String sessionId) {
        Paiement paiement = paiementRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paiement introuvable pour cette session"));
        return ResponseEntity.ok(PaiementResponse.from(paiement));
    }
}