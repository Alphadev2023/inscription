CREATE TABLE utilisateurs (
                              id          UUID PRIMARY KEY,
                              email       VARCHAR(255) NOT NULL UNIQUE,
                              mot_de_passe VARCHAR(255) NOT NULL,
                              role        VARCHAR(50)  NOT NULL,
                              actif       BOOLEAN      NOT NULL DEFAULT TRUE,
                              cree_le     TIMESTAMP    NOT NULL
);