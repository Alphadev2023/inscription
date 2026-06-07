package com.inscription.inscription_backend.workflow.domain.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workflow_transitions")
@Getter
public class Transition {

    @Id
    private UUID id;

    @Column(name = "dossier_id", nullable = false)
    private UUID dossierId;

    private String statutPrecedent;
    private String statutNouveau;
    private UUID agentId;
    private String commentaire;
    private LocalDateTime effectueeLe;

    protected Transition() {}

    public static Transition creer(UUID dossierId, String statutPrecedent,
                                   String statutNouveau, UUID agentId,
                                   String commentaire) {
        Transition t = new Transition();
        t.id = UUID.randomUUID();
        t.dossierId = dossierId;
        t.statutPrecedent = statutPrecedent;
        t.statutNouveau = statutNouveau;
        t.agentId = agentId;
        t.commentaire = commentaire;
        t.effectueeLe = LocalDateTime.now();
        return t;
    }
}