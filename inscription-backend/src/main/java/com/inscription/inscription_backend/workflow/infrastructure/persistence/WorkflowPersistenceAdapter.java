package com.inscription.inscription_backend.workflow.infrastructure.persistence;

import com.inscription.inscription_backend.workflow.domain.model.Workflow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WorkflowPersistenceAdapter {

    private final WorkflowJpaRepository jpaRepository;

    public Workflow sauvegarder(Workflow workflow) {
        return jpaRepository.save(workflow);
    }

    public Optional<Workflow> trouverParDossierId(UUID dossierId) {
        return jpaRepository.findByDossierId(dossierId);
    }

    public List<Workflow> trouverParStatut(String statut) {
        return jpaRepository.findByStatutCourant(statut);
    }

    public List<UUID> trouverAgentsDisponibles() {
        return jpaRepository.findAgentsDisponibles();
    }
}