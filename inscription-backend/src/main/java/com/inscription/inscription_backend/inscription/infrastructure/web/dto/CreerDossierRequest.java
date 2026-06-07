// CreerDossierRequest.java
package com.inscription.inscription_backend.inscription.infrastructure.web.dto;

import com.inscription.inscription_backend.inscription.domain.model.Sexe;
import com.inscription.inscription_backend.inscription.domain.model.TypePieceIdentite;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record CreerDossierRequest(
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotNull @Past LocalDate dateNaissance,
        @NotBlank String nationalite,
        @NotBlank String telephone,
        @NotNull Sexe sexe,
        @NotNull TypePieceIdentite typePiece
) {}