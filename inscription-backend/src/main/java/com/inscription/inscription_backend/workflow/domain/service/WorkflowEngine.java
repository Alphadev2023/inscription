package com.inscription.inscription_backend.workflow.domain.service;

import com.inscription.inscription_backend.workflow.domain.model.Workflow;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkflowEngine {

    // Assigne automatiquement l'agent avec le moins de dossiers
    public Optional<UUID> choisirAgent(List<UUID> agentsDisponibles,
                                       List<Workflow> workflowsEnCours) {
        if (agentsDisponibles.isEmpty()) return Optional.empty();

        return agentsDisponibles.stream()
                .min(Comparator.comparingLong(agentId ->
                        workflowsEnCours.stream()
                                .filter(w -> agentId.equals(w.getAgentId()))
                                .count()
                ));
    }

    // Trie les dossiers par priorité
    public List<Workflow> trierParPriorite(List<Workflow> workflows) {
        return workflows.stream()
                .sorted(Comparator.comparing(Workflow::getPriorite).reversed()
                        .thenComparing(w -> w.estEnRetard() ? 0 : 1))
                .toList();
    }

    // Vérifie si un workflow est bloqué
    public boolean estBloque(Workflow workflow) {
        return workflow.estEnRetard() &&
                "EN_COURS".equals(workflow.getStatutCourant());
    }
}