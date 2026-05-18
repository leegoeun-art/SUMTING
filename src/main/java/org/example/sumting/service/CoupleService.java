package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.entity.User;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.ReportRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CoupleService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final LikesRepository likesRepository;
    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<ResponseCouplesDto> loadCouples(Long userId) {
        UserProfile myProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> myKws = Stream.of(myProfile.getMyKw1(), myProfile.getMyKw2(), myProfile.getMyKw3())
                .filter(Objects::nonNull)
                .toList();

        if (myKws.isEmpty()) return List.of();

        User me = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 내가 보낸/받은 하트핑 상태를 한 번에 조회 (N+1 방지)
        Map<Long, String> outgoing = likesRepository.findAllBySender(me)
                .stream()
                .collect(Collectors.toMap(
                        l -> l.getReceiver().getId(),
                        l -> l.getStatus().name().toLowerCase()
                ));
        Map<Long, String> incoming = likesRepository.findAllByReceiver(me)
                .stream()
                .collect(Collectors.toMap(
                        l -> l.getSender().getId(),
                        l -> l.getStatus().name().toLowerCase()
                ));

        List<Long> excluded = new ArrayList<>();
        excluded.addAll(reportRepository.findReportedIdsByReporterId(userId));
        excluded.addAll(reportRepository.findReporterIdsByReportedId(userId));
        if (excluded.isEmpty()) excluded.add(-1L);

        return userProfileRepository.findMatchingCouples(userId, myProfile.getGender(), myKws, excluded)
                .stream()
                .map(up -> {
                    Long partnerId = up.getUserId();
                    String out = outgoing.get(partnerId);
                    String in  = incoming.get(partnerId);
                    String status;
                    if ("matched".equals(out) || "matched".equals(in)) {
                        status = "matched";
                    } else if ("exited".equals(out) || "exited".equals(in)) {
                        status = "exited";
                    } else if ("rejected".equals(out) || "rejected".equals(in)) {
                        status = "rejected";
                    } else if ("pending".equals(in)) {
                        status = "received";
                    } else if ("pending".equals(out)) {
                        status = "pending";
                    } else {
                        status = "none";
                    }
                    return new ResponseCouplesDto(
                            up.getUser().getUuid(),
                            up.getNickName(),
                            up.getDepartment(),
                            up.getAge(),
                            up.getHeight(),
                            up.getMyKw1(),
                            up.getMyKw2(),
                            up.getMyKw3(),
                            up.getYourKw1(),
                            up.getYourKw2(),
                            up.getYourKw3(),
                            status);
                })
                .toList();
    }
}

/*
  매칭 로직 흐름:
  1. user_id로 내 프로필 조회 → myKw1/2/3, gender 추출
  2. gender != 내 성별 조건으로 반대 성별 필터링
  3. 상대방의 yourKw1/2/3 중 하나라도 내 myKw 목록에 포함되면 매칭 → userId, department, myKw1/2/3 반환

*/
