package com.inscription.inscription_backend.workflow.application.service;

import com.inscription.inscription_backend.workflow.application.command.AssignerAgentCommand;

import com.inscription.inscription_backend.workflow.domain.model.Workflow;
import com.inscription.inscription_backend.workflow.domain.service.WorkflowEngine;
import com.inscription.inscription_backend.workflow.infrastructure.persistence.WorkflowPersistenceAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final WorkflowPersistenceAdapter workflowRepo;
    private final WorkflowEngine workflowEngine;

    @Transactional
    public Workflow creerWorkflow(UUID dossierId, int scoreCompletude) {
        Workflow workflow = Workflow.creer(dossierId, scoreCompletude);
        return workflowRepo.sauvegarder(workflow);
    }

    @Transactional
    public Workflow assignerAgent(AssignerAgentCommand cmd) {
        Workflow workflow = workflowRepo.trouverParDossierId(cmd.dossierId())
                .orElseThrow(() -> new IllegalStateException(
                        "Workflow introuvable pour le dossier : " + cmd.dossierId()));

        UUID agentId = cmd.agentId();

        // Assignation automatique si pas d'agent spécifié
        if (agentId == null) {
            List<UUID> agentsDisponibles = workflowRepo.trouverAgentsDisponibles();
            List<Workflow> workflowsEnCours = workflowRepo.trouverParStatut("EN_COURS");
            agentId = workflowEngine.choisirAgent(agentsDisponibles, workflowsEnCours)
                    .orElseThrow(() -> new IllegalStateException("Aucun agent disponible"));
        }

        workflow.assignerAgent(agentId);
        return workflowRepo.sauvegarder(workflow);
    }

    @Transactional
    public Workflow terminerWorkflow(UUID dossierId, String statut,
                                     UUID agentId, String commentaire) {
        Workflow workflow = workflowRepo.trouverParDossierId(dossierId)
                .orElseThrow(() -> new IllegalStateException(
                        "Workflow introuvable : " + dossierId));
        workflow.terminer(statut, agentId, commentaire);
        return workflowRepo.sauvegarder(workflow);
    }

    @Transactional(readOnly = true)
    public List<Workflow> trouverDossiersEnRetard() {
        return workflowRepo.trouverParStatut("EN_COURS").stream()
                .filter(Workflow::estEnRetard)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Workflow> trouverParPriorite() {
        List<Workflow> workflows = workflowRepo.trouverParStatut("SOUMIS");
        return workflowEngine.trierParPriorite(workflows);
    }

    // ── Scheduler — vérifie les dossiers bloqués toutes les heures ──
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void verifierDossiersBloqués() {
        List<Workflow> enRetard = trouverDossiersEnRetard();
        if (!enRetard.isEmpty()) {
            log.warn("⚠️ {} dossier(s) en retard détecté(s) !", enRetard.size());
            enRetard.forEach(w -> {
                w.incrementerRelances();
                workflowRepo.sauvegarder(w);
                log.warn("Dossier bloqué : {}, priorité : {}", w.getDossierId(), w.getPriorite());
            });
        }
    }
}