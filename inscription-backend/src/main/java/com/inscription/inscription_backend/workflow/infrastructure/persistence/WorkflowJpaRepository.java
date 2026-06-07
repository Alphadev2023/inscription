package com.inscription.inscription_backend.workflow.infrastructure.persistence;

import com.inscription.inscription_backend.workflow.domain.model.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface WorkflowJpaRepository extends JpaRepository<Workflow, UUID> {
    Optional<Workflow> findByDossierId(UUID dossierId);
    List<Workflow> findByStatutCourant(String statut);

    @Query("SELECT DISTINCT w.agentId FROM Workflow w WHERE w.agentId IS NOT NULL")
    List<UUID> findAgentsDisponibles();
}