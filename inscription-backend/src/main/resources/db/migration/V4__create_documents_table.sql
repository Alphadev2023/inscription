CREATE TABLE fichiers_documents (
                                    id                    UUID         PRIMARY KEY,
                                    dossier_id            UUID         NOT NULL,
                                    type                  VARCHAR(50)  NOT NULL,
                                    nom_fichier_original  VARCHAR(255),
                                    nom_fichier_stockage  VARCHAR(255),
                                    chemin_stockage       VARCHAR(500),
                                    mime_type             VARCHAR(100),
                                    taille                BIGINT,
                                    statut                VARCHAR(30)  NOT NULL DEFAULT 'EN_ATTENTE',
                                    raison_rejet          TEXT,
                                    uploade_le            TIMESTAMP    NOT NULL,
                                    valide_le             TIMESTAMP
);

CREATE INDEX idx_documents_dossier_id ON fichiers_documents(dossier_id);
CREATE INDEX idx_documents_statut     ON fichiers_documents(statut);