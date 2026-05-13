package org.example.sumting.repository;

import org.example.sumting.entity.User;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.enums.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    // nickname 으로 유저 프로필을 조회. 없으면 Optional.empty() 반환
    Optional<UserProfile> findByNickName(String nickName);

    // nickname 으로 유저 프로필을 조회. 없으면 Optional.empty() 반환
    Optional<UserProfile> findByUserId(Long userId);

    // nickname 으로 user_id 조회
    User findUserIdByNickName(String nickName);

    // 해당 nickname를 가진 유저가 존재하는지 여부만 반환 (중복 닉네임 검사에 사용)
    boolean existsByNickName(String nickname);

    // 닉네임에 keyword가 포함된 유저 목록 반환 (부분 일치 검색)
    @Query("SELECT up FROM UserProfile up WHERE up.nickName LIKE %:keyword%")
    List<UserProfile> searchByNickName(@Param("keyword") String keyword);

    // 본인(userId)을 제외하고, 반대 성별이면서 상대방이 원하는 키워드(yourKw1~3)가
    // 내 키워드(myKws)와 하나라도 일치하는 유저 목록 반환 (커플 매칭 후보 조회)
    @Query("SELECT up FROM UserProfile up WHERE up.userId != :userId AND up.gender != :gender " +
           "AND (up.yourKw1 IN :myKws OR up.yourKw2 IN :myKws OR up.yourKw3 IN :myKws)")
    List<UserProfile> findMatchingCouples(@Param("userId") Long userId,
                                          @Param("gender") Gender gender,
                                          @Param("myKws") List<String> myKws);
}