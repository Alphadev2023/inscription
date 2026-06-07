package com.inscription.inscription_backend.shared.infrastructure.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Structure de réponse d'erreur ────────────────────────
    public record ErrorResponse(
            int status,
            String error,
            String message,
            String path,
            LocalDateTime timestamp
    ) {}

    // ── 400 — Validation des champs ─────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> erreurs = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String champ = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            erreurs.put(champ, message);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("error", "Validation échouée");
        response.put("erreurs", erreurs);
        response.put("path", request.getRequestURI());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.badRequest().body(response);
    }

    // ── 400 — Règles métier violées ──────────────────────────
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request) {

        log.warn("Règle métier violée : {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(
                400,
                "Règle métier violée",
                ex.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }

    // ── 400 — Arguments invalides ────────────────────────────
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {

        log.warn("Argument invalide : {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorResponse(
                400,
                "Argument invalide",
                ex.getMessage(),
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }

    // ── 401 — Identifiants invalides ─────────────────────────
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(
                401,
                "Non autorisé",
                "Email ou mot de passe incorrect",
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }

    // ── 403 — Accès refusé ───────────────────────────────────
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse(
                403,
                "Accès refusé",
                "Vous n'avez pas les droits nécessaires",
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }

    // ── 413 — Fichier trop volumineux ────────────────────────
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSize(
            MaxUploadSizeExceededException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(new ErrorResponse(
                413,
                "Fichier trop volumineux",
                "La taille maximale autorisée est de 5 Mo",
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }

    // ── 500 — Erreur interne ─────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        log.error("Erreur inattendue : {}", ex.getMessage(), ex);
        return ResponseEntity.internalServerError().body(new ErrorResponse(
                500,
                "Erreur interne",
                "Une erreur inattendue s'est produite",
                request.getRequestURI(),
                LocalDateTime.now()
        ));
    }
}