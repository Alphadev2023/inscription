package com.inscription.inscription_backend.document.infrastructure.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class LocalStorageAdapter {

    @Value("${app.upload.path:./uploads}")
    private String uploadPath;

    public String stocker(MultipartFile fichier, UUID dossierId) {
        try {
            Path dossierPath = Paths.get(uploadPath, dossierId.toString());
            Files.createDirectories(dossierPath);

            String extension = obtenirExtension(fichier.getOriginalFilename());
            String nomStockage = UUID.randomUUID() + "." + extension;
            Path destination = dossierPath.resolve(nomStockage);

            Files.copy(fichier.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return nomStockage;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du stockage du fichier", e);
        }
    }

    public String getChemin(String nomStockage) {
        return uploadPath + "/" + nomStockage;
    }

    public void supprimer(String nomFichierStockage) {
        try {
            Path fichierPath = Paths.get(uploadPath).resolve(nomFichierStockage);
            Files.deleteIfExists(fichierPath);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la suppression du fichier", e);
        }
    }

    public byte[] lire(String dossierId, String nomFichierStockage) {
        try {
            Path fichierPath = Paths.get(uploadPath, dossierId, nomFichierStockage);
            return Files.readAllBytes(fichierPath);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier", e);
        }
    }

    private String obtenirExtension(String nomFichier) {
        if (nomFichier == null || !nomFichier.contains(".")) return "bin";
        return nomFichier.substring(nomFichier.lastIndexOf('.') + 1).toLowerCase();
    }
}