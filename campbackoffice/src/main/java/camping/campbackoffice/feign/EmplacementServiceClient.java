package camping.campbackoffice.feign;

import camping.campbackoffice.dtos.EmplacementDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// EmplacementServiceClient.java
@FeignClient(name = "emplacement-service", path = "/api/emplacements")
public interface EmplacementServiceClient {

    @GetMapping
    List<EmplacementDTO> getAllEmplacements();

    @GetMapping("/{id}")
    EmplacementDTO getEmplacementById(@PathVariable("id") Long id);

    @PostMapping
    EmplacementDTO createEmplacement(@RequestBody EmplacementDTO emplacement);

    @PutMapping("/{id}")
    EmplacementDTO updateEmplacement(@PathVariable("id") Long id, @RequestBody EmplacementDTO emplacement);

    @DeleteMapping("/{id}")
    void deleteEmplacement(@PathVariable("id") Long id);

    @PostMapping("/{id}/upload-image")
    String uploadEmplacementImage(@PathVariable("id") Long id, @RequestPart("file") MultipartFile file);

    @GetMapping("/disponibles")
    List<EmplacementDTO> getAvailableEmplacements();

    @GetMapping("/{id}/disponible")
    Boolean checkAvailability(
            @PathVariable("id") Long emplacementId,
            @RequestParam("dateDebut") String dateDebut,
            @RequestParam("dateFin") String dateFin
    );
}