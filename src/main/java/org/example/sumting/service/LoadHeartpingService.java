package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.SentHeartPingDto;
import org.example.sumting.entity.Likes;
import org.example.sumting.entity.User;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoadHeartpingService {

    private final UserProfileRepository userProfileRepository;
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;

    public Integer loadRemainHeart(Long kakaoId) {
        return userRepository.findHeartById(kakaoId);
    }

    public List<SentHeartPingDto> loadReceive(Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        List<Likes> receivedLikes = likesRepository.findAllByReceiver(me);

        return receivedLikes.stream()
                .map(likes -> {
                    UserProfile p = userProfileRepository
                            .findByUserId(likes.getSender().getId()).orElseThrow();
                    return new SentHeartPingDto(
                            String.valueOf(p.getUserId()), p.getNickName(),
                            p.getGender().name().equals("M"), p.getDepartment(),
                            p.getAge(), p.getHeight(),
                            p.getMyKw1(), p.getMyKw2(), p.getMyKw3(),
                            p.getYourKw1(), p.getYourKw2(), p.getYourKw3(),
                            likes.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }



    public List<SentHeartPingDto> loadSend(Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        List<Likes> sentLikes = likesRepository.findAllBySender(me);

        return sentLikes.stream()
                .map(likes -> {
                    UserProfile p = userProfileRepository
                            .findByUserId(likes.getReceiver().getId()).orElseThrow();
                    return new SentHeartPingDto(
                            String.valueOf(p.getUserId()), p.getNickName(),
                            p.getGender().name().equals("M"), p.getDepartment(),
                            p.getAge(), p.getHeight(),
                            p.getMyKw1(), p.getMyKw2(), p.getMyKw3(),
                            p.getYourKw1(), p.getYourKw2(), p.getYourKw3(),
                            likes.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }

}