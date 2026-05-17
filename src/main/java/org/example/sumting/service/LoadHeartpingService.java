package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.SentHeartPingDto;
import org.example.sumting.entity.Likes;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoadHeartpingService {

    private final UserProfileRepository userProfileRepository;
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    public Integer loadRemainHeart(Long kakaoId) {
        return userRepository.findHeartById(kakaoId);
    }

    @Transactional(readOnly = true)
    public List<SentHeartPingDto> loadReceive(Long userId) {
        List<Long> blocked = buildBlockedList(userId);
        User me = userRepository.findById(userId).orElseThrow();

        return likesRepository.findAllByReceiver(me).stream()
                .filter(l -> !blocked.contains(l.getSender().getId()))
                .map(likes -> {
                    UserProfile p = userProfileRepository
                            .findByUserId(likes.getSender().getId()).orElseThrow();
                    return new SentHeartPingDto(
                            p.getUser().getUuid(), p.getNickName(),
                            p.getGender().name().equals("M"), p.getDepartment(),
                            p.getAge(), p.getHeight(),
                            p.getMyKw1(), p.getMyKw2(), p.getMyKw3(),
                            p.getYourKw1(), p.getYourKw2(), p.getYourKw3(),
                            likes.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SentHeartPingDto> loadSend(Long userId) {
        List<Long> blocked = buildBlockedList(userId);
        User me = userRepository.findById(userId).orElseThrow();

        return likesRepository.findAllBySender(me).stream()
                .filter(l -> !blocked.contains(l.getReceiver().getId()))
                .map(likes -> {
                    UserProfile p = userProfileRepository
                            .findByUserId(likes.getReceiver().getId()).orElseThrow();
                    return new SentHeartPingDto(
                            p.getUser().getUuid(), p.getNickName(),
                            p.getGender().name().equals("M"), p.getDepartment(),
                            p.getAge(), p.getHeight(),
                            p.getMyKw1(), p.getMyKw2(), p.getMyKw3(),
                            p.getYourKw1(), p.getYourKw2(), p.getYourKw3(),
                            likes.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }

    private List<Long> buildBlockedList(Long userId) {
        List<Long> blocked = new ArrayList<>();
        blocked.addAll(reportRepository.findReportedIdsByReporterId(userId));
        blocked.addAll(reportRepository.findReporterIdsByReportedId(userId));
        return blocked;
    }

}