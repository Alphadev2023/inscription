package com.inscription.inscription_backend.notification.infrastructure.email.template;

import com.inscription.inscription_backend.notification.domain.model.TypeNotification;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    public String getSujet(TypeNotification type, String nomCandidat) {
        return switch (type) {
            case DOSSIER_SOUMIS    -> "Votre dossier a été soumis avec succès";
            case DOSSIER_VALIDE    -> "Félicitations ! Votre dossier a été validé";
            case DOSSIER_REJETE    -> "Votre dossier a été rejeté";
            case DOCUMENT_VALIDE   -> "Document validé";
            case DOCUMENT_REJETE   -> "Document rejeté";
            case RAPPEL_COMPLETION -> "Rappel : Complétez votre dossier";
            default                -> "Notification - Plateforme d'Inscription";
        };
    }

    public String getContenu(TypeNotification type, String nomCandidat, String param) {
        return switch (type) {
            case DOSSIER_SOUMIS    -> templateSoumis(nomCandidat);
            case DOSSIER_VALIDE    -> templateValide(nomCandidat);
            case DOSSIER_REJETE    -> templateRejete(nomCandidat, param);
            case DOCUMENT_VALIDE   -> templateDocumentValide(nomCandidat, param);
            case DOCUMENT_REJETE   -> templateDocumentRejete(nomCandidat, param);
            case RAPPEL_COMPLETION -> templateRappel(nomCandidat);
            default                -> "<p>Bonjour " + nomCandidat + ",</p><p>Notification reçue.</p>";
        };
    }

    private String templateSoumis(String nom) {
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Dossier soumis avec succès</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Votre dossier d'inscription a bien été reçu et est en cours d'examen.</p>
                    <p>Notre équipe vous contactera sous <strong>24 à 48 heures</strong>.</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom);
    }

    private String templateValide(String nom) {
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #2196F3; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Dossier validé !</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Nous avons le plaisir de vous informer que votre dossier d'inscription
                       a été <strong>accepté</strong>.</p>
                    <p>Bienvenue dans notre établissement !</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom);
    }

    private String templateRejete(String nom, String raison) {
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #f44336; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Dossier rejeté</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Nous avons le regret de vous informer que votre dossier a été <strong>rejeté</strong>.</p>
                    <div style="background: #fff3f3; padding: 15px; border-left: 4px solid #f44336; margin: 15px 0;">
                        <strong>Motif :</strong> %s
                    </div>
                    <p>Vous pouvez soumettre un recours depuis votre espace candidat.</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom, raison != null ? raison : "Non précisé");
    }

    private String templateDocumentValide(String nom, String typeDoc) {
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Document validé</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Votre document <strong>%s</strong> a été validé par notre équipe.</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom, typeDoc != null ? typeDoc : "");
    }

    private String templateDocumentRejete(String nom, String param) {
        String typeDoc = "";
        String raison = "";
        if (param != null && param.contains("|")) {
            String[] parts = param.split("\\|", 2);
            typeDoc = parts[0];
            raison = parts[1];
        }
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #f44336; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Document rejeté</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Votre document <strong>%s</strong> a été rejeté.</p>
                    <div style="background: #fff3f3; padding: 15px; border-left: 4px solid #f44336; margin: 15px 0;">
                        <strong>Motif :</strong> %s
                    </div>
                    <p>Veuillez soumettre un nouveau document corrigé.</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom, typeDoc, raison);
    }

    private String templateRappel(String nom) {
        return """
            <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <div style="background: #FF9800; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                    <h2>Rappel : Dossier incomplet</h2>
                </div>
                <div style="padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                    <p>Bonjour <strong>%s</strong>,</p>
                    <p>Votre dossier d'inscription n'est pas encore complet.</p>
                    <p>Connectez-vous pour finaliser votre dossier avant la date limite.</p>
                    <hr/>
                    <p style="color: #888; font-size: 12px;">Plateforme d'Inscription en Ligne</p>
                </div>
            </body></html>
            """.formatted(nom);
    }
}