package com.inscription.inscription_backend.paiement.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "paiement")
public class Paiement {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "inscription_id", nullable = false)
    private UUID inscriptionId;

    @Column(nullable = false)
    private BigDecimal montant;

    @Column(nullable = false)
    private String devise = "XOF";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;

    @Column(name = "stripe_session_id")
    private String stripeSessionId;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "numero_recu", unique = true)
    private String numeroRecu;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    protected Paiement() {}

    public Paiement(UUID inscriptionId, BigDecimal montant) {
        this.inscriptionId = inscriptionId;
        this.montant = montant;
    }

    public void marquerPaye(String paymentIntentId) {
        this.statut = StatutPaiement.PAYE;
        this.stripePaymentIntentId = paymentIntentId;
        this.datePaiement = LocalDateTime.now();
        this.numeroRecu = genererNumeroRecu();
    }

    public void marquerEchec() {
        this.statut = StatutPaiement.ECHEC;
    }

    public void attacherSessionStripe(String sessionId) {
        this.stripeSessionId = sessionId;
    }

    private String genererNumeroRecu() {
        return "RECU-" + LocalDateTime.now().getYear() + "-"
                + id.toString().substring(0, 8).toUpperCase();
    }

    public UUID getId() { return id; }
    public UUID getInscriptionId() { return inscriptionId; }
    public BigDecimal getMontant() { return montant; }
    public String getDevise() { return devise; }
    public StatutPaiement getStatut() { return statut; }
    public String getStripeSessionId() { return stripeSessionId; }
    public String getNumeroRecu() { return numeroRecu; }
    public LocalDateTime getDateCreation() { return dateCreation; }
    public LocalDateTime getDatePaiement() { return datePaiement; }
}