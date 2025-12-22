package Yve.EcoTrack.data;

import Yve.EcoTrack.model.Bike;
import Yve.EcoTrack.model.BikeStatus;
import Yve.EcoTrack.repository.BikeRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BikeRepository bikeRepository;

    public DataInitializer(BikeRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        Random random = new Random();

        System.out.println("🚀 Initialisation de 20 vélos de test...");

        for (int i = 1; i <= 20; i++) {
            Bike bike = new Bike();
            bike.setSerialNumber("YDE-" + (1000 + i));
            bike.setModel(i % 2 == 0 ? "Yéti-Bike" : "City-Express");
            bike.setBatteryLevel(random.nextInt(101));

            // Coordonnées autour de Yaoundé ( Bastos, Tsinga, Mvan)
            bike.setLatitude(3.848 + (random.nextDouble() - 0.5) * 0.05);
            bike.setLongitude(11.502 + (random.nextDouble() - 0.5) * 0.05);

            bike.setStatus(BikeStatus.values()[random.nextInt(BikeStatus.values().length)]);
            bikeRepository.save(bike);
        }

        System.out.println("✅ " + bikeRepository.count() + " vélos insérés en base H2.");
    }
}
