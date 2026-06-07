// CreerDossierCommand.java
package com.inscription.inscription_backend.inscription.application.command;

import com.inscription.inscription_backend.inscription.domain.model.Sexe;
import com.inscription.inscription_backend.inscription.domain.model.TypePieceIdentite;
import java.time.LocalDate;
import java.util.UUID;

public record CreerDossierCommand(
        UUID utilisateurId,
        String nom,
        String prenom,
        LocalDate dateNaissance,
        String nationalite,
        String telephone,
        Sexe sexe,
        TypePieceIdentite typePiece
) {}