package Yve.EcoTrack.repository;

import Yve.EcoTrack.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeRepository extends JpaRepository<Bike,Long> {

    //tout y est déja !!!!
}
