package org.example.sumting.repository;

import org.example.sumting.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u.heart FROM User u WHERE u.id = :id")
    Integer findHeartById(@Param("id") Long id);

    Optional<User> findByUuid(String uuid);
}
