package Yve.EcoTrack.controller;

import Yve.EcoTrack.model.Bike;
import Yve.EcoTrack.repository.BikeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/bikes")
// Note: Assure-toi que le port correspond à ton frontend (5173 pour Vite)
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})

public class BikeController {

    private final BikeRepository bikeRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BikeController(BikeRepository bikeRepository, SimpMessagingTemplate messagingTemplate) {
        this.bikeRepository = bikeRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // --- 1. CRUD DE BASE ---

    @GetMapping
    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    @PostMapping
    public Bike createBike(@RequestBody Bike bike) {
        return bikeRepository.save(bike);
    }

    @PutMapping("/{id}/battery")
    public Bike updateBattery(@PathVariable Long id, @RequestBody int newLevel) {
        Bike bike = bikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vélo introuvable"));
        bike.setBatteryLevel(newLevel);
        Bike updatedBike = bikeRepository.save(bike);

        // Notification temps réel via WebSocket
        messagingTemplate.convertAndSend("/topic/bikes", updatedBike);
        return updatedBike;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBike(@PathVariable Long id) {
        return bikeRepository.findById(id)
                .map(bike -> {
                    bikeRepository.delete(bike);
                    // Notification de suppression via WebSocket
                    messagingTemplate.convertAndSend("/topic/bikes/delete", id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 2. GESTION DE L'UPLOAD D'IMAGES ---

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Création du dossier 'uploads' s'il n'existe pas
            String uploadDirectory = "uploads/";
            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Génération d'un nom de fichier unique
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDirectory).resolve(fileName);

            // Copie du fichier sur le serveur
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Retourne l'URL complète pour accéder à l'image
            // Assure-toi que Spring est configuré pour servir ce dossier (WebConfig)
            String fileUrl = "http://localhost:8081/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'upload du fichier: " + e.getMessage());
        }
    }
}