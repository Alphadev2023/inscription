package com.inscription.inscription_backend.workflow.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.domain.AbstractAggregateRoot;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "workflows")
@Getter
public class Workflow extends AbstractAggregateRoot<Workflow> {

    @Id
    private UUID id;

    @Column(name = "dossier_id", nullable = false, unique = true)
    private UUID dossierId;

    @Column(name = "agent_id")
    private UUID agentId;

    @Enumerated(EnumType.STRING)
    private Priorite priorite;

    private String statutCourant;
    private LocalDateTime dateAssignation;
    private LocalDateTime dateEcheance;
    private int nbRelances;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workflow_id")
    private List<Transition> transitions = new ArrayList<>();

    protected Workflow() {}

    public static Workflow creer(UUID dossierId, int scoreCompletude) {
        Workflow w = new Workflow();
        w.id = UUID.randomUUID();
        w.dossierId = dossierId;
        w.statutCourant = "SOUMIS";
        w.priorite = Priorite.calculer(scoreCompletude, 0);
        w.dateEcheance = LocalDateTime.now().plusHours(48);
        w.nbRelances = 0;
        return w;
    }

    public void assignerAgent(UUID agentId) {
        String ancien = this.statutCourant;
        this.agentId = agentId;
        this.statutCourant = "EN_COURS";
        this.dateAssignation = LocalDateTime.now();

        this.transitions.add(Transition.creer(
                this.dossierId, ancien, "EN_COURS", agentId, "Assignation automatique"
        ));
    }

    public void terminer(String nouveauStatut, UUID agentId, String commentaire) {
        String ancien = this.statutCourant;
        this.statutCourant = nouveauStatut;

        this.transitions.add(Transition.creer(
                this.dossierId, ancien, nouveauStatut, agentId, commentaire
        ));
    }

    public void incrementerRelances() {
        this.nbRelances++;
    }

    public boolean estEnRetard() {
        return LocalDateTime.now().isAfter(this.dateEcheance);
    }

    public void recalculerPriorite(int scoreCompletude) {
        long heures = java.time.Duration.between(
                dateEcheance.minusHours(48), LocalDateTime.now()
        ).toHours();
        this.priorite = Priorite.calculer(scoreCompletude, heures);
    }
}