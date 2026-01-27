package com.emplacement_service.controller;


import com.emplacement_service.EmplacementServiceApplication;
import com.emplacement_service.entities.Emplacement;
import com.emplacement_service.service.EmplacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {


    @Autowired
    EmplacementService emplacementService;

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Créer le répertoire s'il n'existe pas
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom de fichier unique
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Retourner l'URL de l'image
            String imageUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(imageUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'upload de l'image");
        }
    }
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Optional<Emplacement> emplacement = emplacementService.getEmplacementById(id);
        if (emplacement.isPresent() && emplacement.get().getImageData() != null) {
            byte[] imageData = emplacement.get().getImageData();
            String imageType = emplacement.get().getImageType();
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf(imageType))
                    .body(imageData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
