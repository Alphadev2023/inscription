-- V__create_paiement.sql
CREATE TABLE paiement (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          inscription_id UUID NOT NULL,
                          montant NUMERIC(10, 2) NOT NULL,
                          devise VARCHAR(3) NOT NULL DEFAULT 'XOF',
                          statut VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
                          stripe_session_id VARCHAR(255),
                          stripe_payment_intent_id VARCHAR(255),
                          numero_recu VARCHAR(50) UNIQUE,
                          date_creation TIMESTAMP NOT NULL DEFAULT now(),
                          date_paiement TIMESTAMP,
                          CONSTRAINT chk_statut CHECK (statut IN ('EN_ATTENTE', 'PAYE', 'ECHEC', 'REMBOURSE'))
);

CREATE INDEX idx_paiement_inscription ON paiement(inscription_id);
CREATE INDEX idx_paiement_stripe_session ON paiement(stripe_session_id);