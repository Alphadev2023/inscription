CREATE TABLE workflows (
                           id               UUID        PRIMARY KEY,
                           dossier_id       UUID        NOT NULL UNIQUE,
                           agent_id         UUID,
                           priorite         VARCHAR(20) NOT NULL DEFAULT 'NORMALE',
                           statut_courant   VARCHAR(30) NOT NULL DEFAULT 'SOUMIS',
                           date_assignation TIMESTAMP,
                           date_echeance    TIMESTAMP,
                           nb_relances      INT         NOT NULL DEFAULT 0
);

CREATE TABLE workflow_transitions (
                                      id                UUID        PRIMARY KEY,
                                      workflow_id       UUID        REFERENCES workflows(id),
                                      dossier_id        UUID        NOT NULL,
                                      statut_precedent  VARCHAR(30),
                                      statut_nouveau    VARCHAR(30),
                                      agent_id          UUID,
                                      commentaire       TEXT,
                                      effectuee_le      TIMESTAMP   NOT NULL
);

CREATE INDEX idx_workflows_dossier    ON workflows(dossier_id);
CREATE INDEX idx_workflows_statut     ON workflows(statut_courant);
CREATE INDEX idx_workflows_priorite   ON workflows(priorite);
CREATE INDEX idx_transitions_workflow ON workflow_transitions(workflow_id);