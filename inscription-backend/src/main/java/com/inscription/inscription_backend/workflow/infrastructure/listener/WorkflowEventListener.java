package com.inscription.inscription_backend.workflow.infrastructure.listener;

import com.inscription.inscription_backend.inscription.domain.event.DossierRejeteEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierSoumisEvent;
import com.inscription.inscription_backend.inscription.domain.event.DossierValideEvent;
import com.inscription.inscription_backend.workflow.application.command.AssignerAgentCommand;
import com.inscription.inscription_backend.workflow.application.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class WorkflowEventListener {

    private final WorkflowService workflowService;

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierSoumis(DossierSoumisEvent event) {
        log.info("Workflow : création pour dossier {}", event.dossierId());
        try {
            workflowService.creerWorkflow(event.dossierId(), 80);
            workflowService.assignerAgent(
                    new AssignerAgentCommand(event.dossierId(), null)
            );
        } catch (Exception e) {
            log.warn("Workflow soumis - erreur non bloquante : {}", e.getMessage());
        }
    }

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierValide(DossierValideEvent event) {
        log.info("Workflow : clôture VALIDE pour dossier {}", event.dossierId());
        try {
            workflowService.terminerWorkflow(
                    event.dossierId(), "VALIDE", null, "Dossier validé"
            );
        } catch (Exception e) {
            log.warn("Workflow valide - erreur non bloquante : {}", e.getMessage());
        }
    }

    @ApplicationModuleListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void surDossierRejete(DossierRejeteEvent event) {
        log.info("Workflow : clôture REJETE pour dossier {}", event.dossierId());
        try {
            workflowService.terminerWorkflow(
                    event.dossierId(), "REJETE", null, event.raisonRejet()
            );
        } catch (Exception e) {
            log.warn("Workflow rejeté - erreur non bloquante : {}", e.getMessage());
        }
    }
}