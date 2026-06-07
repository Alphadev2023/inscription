package com.inscription.inscription_backend.workflow.infrastructure.web;

import com.inscription.inscription_backend.workflow.application.command.AssignerAgentCommand;
import com.inscription.inscription_backend.workflow.application.service.WorkflowService;
import com.inscription.inscription_backend.workflow.domain.model.Workflow;
import com.inscription.inscription_backend.workflow.infrastructure.web.dto.WorkflowStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping("/en-retard")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<List<Workflow>> dossiersEnRetard() {
        return ResponseEntity.ok(workflowService.trouverDossiersEnRetard());
    }

    @GetMapping("/priorites")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<List<Workflow>> parPriorite() {
        return ResponseEntity.ok(workflowService.trouverParPriorite());
    }

    @PostMapping("/assigner")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Workflow> assignerAgent(
            @RequestParam UUID dossierId,
            @RequestParam(required = false) UUID agentId) {

        return ResponseEntity.ok(
                workflowService.assignerAgent(new AssignerAgentCommand(dossierId, agentId))
        );
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkflowStatsResponse> stats() {
        long enCours   = workflowService.trouverParPriorite().size();
        long enRetard  = workflowService.trouverDossiersEnRetard().size();

        return ResponseEntity.ok(new WorkflowStatsResponse(
                0L, enCours, 0L, 0L, enRetard, 0L
        ));
    }
}