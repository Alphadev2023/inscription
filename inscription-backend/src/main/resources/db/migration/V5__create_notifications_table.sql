CREATE TABLE notifications (
                               id              UUID         PRIMARY KEY,
                               utilisateur_id  UUID         NOT NULL,
                               type            VARCHAR(50)  NOT NULL,
                               destinataire    VARCHAR(255),
                               sujet           VARCHAR(255),
                               contenu         TEXT,
                               envoye          BOOLEAN      NOT NULL DEFAULT FALSE,
                               envoye_le       TIMESTAMP,
                               cree_le         TIMESTAMP    NOT NULL,
                               erreur          TEXT
);

CREATE INDEX idx_notifications_utilisateur ON notifications(utilisateur_id);
CREATE INDEX idx_notifications_envoye      ON notifications(envoye);