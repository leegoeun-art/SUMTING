package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CoupleService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public List<ResponseCouplesDto> loadCouples(Long userId) {
        UserProfile myProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> myKws = Stream.of(myProfile.getMyKw1(), myProfile.getMyKw2(), myProfile.getMyKw3())
                .filter(Objects::nonNull)
                .toList();

        if (myKws.isEmpty()) return List.of();

        return userProfileRepository.findMatchingCouples(userId, myProfile.getGender(), myKws)
                .stream()
                .map(up -> new ResponseCouplesDto(
                        String.valueOf(up.getUserId()),
                        up.getNickName(),
                        up.getDepartment(),
                        up.getMyKw1(),
                        up.getMyKw2(),
                        up.getMyKw3()))
                .toList();
    }
}

/*
  매칭 로직 흐름:
  1. user_id로 내 프로필 조회 → myKw1/2/3, gender 추출
  2. gender != 내 성별 조건으로 반대 성별 필터링
  3. 상대방의 yourKw1/2/3 중 하나라도 내 myKw 목록에 포함되면 매칭 → userId, department, myKw1/2/3 반환

*/
