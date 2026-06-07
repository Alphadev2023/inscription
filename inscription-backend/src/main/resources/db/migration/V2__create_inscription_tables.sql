CREATE TABLE candidats (
                           id                        UUID PRIMARY KEY,
                           nom                       VARCHAR(100) NOT NULL,
                           prenom                    VARCHAR(100) NOT NULL,
                           date_naissance            DATE         NOT NULL,
                           nationalite               VARCHAR(100),
                           telephone                 VARCHAR(20),
                           adresse                   VARCHAR(255),
                           sexe                      VARCHAR(20),
                           type_piece                VARCHAR(30),
                           numero_identite           VARCHAR(50),
                           contact_urgence_nom       VARCHAR(100),
                           contact_urgence_telephone VARCHAR(20)
);

CREATE TABLE dossiers_inscription (
                                      id                    UUID PRIMARY KEY,
                                      utilisateur_id        UUID         NOT NULL,
                                      candidat_id           UUID         REFERENCES candidats(id),
                                      statut                VARCHAR(30)  NOT NULL DEFAULT 'BROUILLON',
                                      score_completude      INT          NOT NULL DEFAULT 0,
                                      etape_actuelle        INT          NOT NULL DEFAULT 1,
                                      dernier_etablissement VARCHAR(255),
                                      specialisation        VARCHAR(255),
                                      periode_formation     VARCHAR(100),
                                      agent_assigne_id      UUID,
                                      cree_le               TIMESTAMP    NOT NULL,
                                      soumis_le             TIMESTAMP,
                                      traite_le             TIMESTAMP,
                                      raison_rejet          TEXT
);

CREATE INDEX idx_dossiers_utilisateur ON dossiers_inscription(utilisateur_id);
CREATE INDEX idx_dossiers_statut      ON dossiers_inscription(statut);