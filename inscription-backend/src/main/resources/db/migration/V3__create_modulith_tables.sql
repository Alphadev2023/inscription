-- Table requise par Spring Modulith pour les événements de domaine
CREATE TABLE event_publication (
                                   id               UUID         NOT NULL,
                                   listener_id      TEXT         NOT NULL,
                                   event_type       TEXT         NOT NULL,
                                   serialized_event TEXT         NOT NULL,
                                   publication_date TIMESTAMP    NOT NULL,
                                   completion_date  TIMESTAMP,
                                   PRIMARY KEY (id)
);

CREATE INDEX idx_event_publication_completion_date
    ON event_publication (completion_date);