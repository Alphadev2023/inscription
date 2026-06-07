package com.inscription.inscription_backend.notification.infrastructure.email;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailAdapter {

    private final JavaMailSender mailSender;

    public void envoyer(String destinataire, String sujet, String contenuHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinataire);
            helper.setSubject(sujet);
            helper.setText(contenuHtml, true); // true = HTML
            helper.setFrom("noreply@inscription.com");

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Erreur envoi email à {} : {}", destinataire, e.getMessage());
            throw new RuntimeException("Échec envoi email", e);
        }
    }
}