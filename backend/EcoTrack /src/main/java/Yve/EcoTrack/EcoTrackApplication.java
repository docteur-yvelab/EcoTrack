package Yve.EcoTrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
// @ComponentScan(basePackages = "Yve.EcoTrack");
public class EcoTrackApplication {

	public static void main(String[] args) {

		SpringApplication.run(EcoTrackApplication.class, args);
	}

}
