package com.inscription.inscription_backend.paiement.application;

import com.inscription.inscription_backend.paiement.domain.Paiement;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptPdfService {

    public byte[] genererRecu(Paiement paiement, String nomEtudiant, String intituleInscription) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            try (PdfWriter writer = new PdfWriter(baos);
                 PdfDocument pdfDoc = new PdfDocument(writer);
                 Document document = new Document(pdfDoc)) {

                document.add(new Paragraph("RECU DE PAIEMENT")
                        .setBold().setFontSize(18).setTextAlignment(TextAlignment.CENTER));

                document.add(new Paragraph("N. " + paiement.getNumeroRecu())
                        .setTextAlignment(TextAlignment.CENTER).setFontSize(10));

                document.add(new Paragraph("\n"));

                Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                        .useAllAvailableWidth();

                table.addCell("Etudiant");
                table.addCell(nomEtudiant);
                table.addCell("Inscription");
                table.addCell(intituleInscription);
                table.addCell("Montant");
                table.addCell(paiement.getMontant() + " " + paiement.getDevise());
                table.addCell("Date de paiement");
                table.addCell(paiement.getDatePaiement().format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                table.addCell("Statut");
                table.addCell(paiement.getStatut().name());

                document.add(table);

                document.add(new Paragraph("\nCe recu fait foi de paiement pour l inscription mentionnee ci-dessus.")
                        .setFontSize(9).setItalic());
            }
        } catch (java.io.IOException e) {
            throw new RuntimeException("Erreur lors de la generation du recu PDF", e);
        }
        return baos.toByteArray();
    }
}