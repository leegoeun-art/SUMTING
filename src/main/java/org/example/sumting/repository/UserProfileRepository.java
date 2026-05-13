package org.example.sumting.repository;

import org.example.sumting.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByNickName(String nickName);

    boolean existsByNickName(String nickName);

    @Query("SELECT up FROM UserProfile up WHERE up.nickName LIKE %:keyword%")
    java.util.List<UserProfile> searchByNickName(@Param("keyword") String keyword);
}