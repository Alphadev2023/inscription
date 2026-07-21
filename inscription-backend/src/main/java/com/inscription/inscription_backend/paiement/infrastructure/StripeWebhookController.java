package com.inscription.inscription_backend.paiement.infrastructure;

import com.inscription.inscription_backend.paiement.domain.Paiement;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/paiements/webhook")
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    private final PaiementRepository paiementRepository;

    public StripeWebhookController(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Signature invalide");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject().orElseThrow();

            Optional<Paiement> paiementOpt = paiementRepository.findByStripeSessionId(session.getId());
            paiementOpt.ifPresent(p -> {
                p.marquerPaye(session.getPaymentIntent());
                paiementRepository.save(p);
                // TODO: publier un event de domaine PaiementValideEvent
            });
        }

        return ResponseEntity.ok("ok");
    }
}