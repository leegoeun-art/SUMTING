package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ProfileDto;
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

    public List<ProfileDto> loadReceive(Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        List<Likes> receivedLikes = likesRepository.findAllByReceiver(me);

        return receivedLikes.stream()
                .map(likes -> {
                    UserProfile senderProfile = userProfileRepository
                            .findByUserId(likes.getSender().getId())
                            .orElseThrow();
                    return toDto(senderProfile);
                })
                .collect(Collectors.toList());
    }



    public List<ProfileDto> loadSend(Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        List<Likes> sentLikes = likesRepository.findAllBySender(me);

        return sentLikes.stream()
                .map(likes -> toDto(
                        userProfileRepository.findByUserId(likes.getReceiver().getId()).orElseThrow()
                ))
                .collect(Collectors.toList());
    }

    private ProfileDto toDto(UserProfile profile) {
        return new ProfileDto(
                String.valueOf(profile.getUserId()),
                profile.getNickName(),
                profile.getGender().name().equals("M"),
                profile.getDepartment(),
                profile.getAge(),
                profile.getHeight(),
                profile.getMyKw1(),
                profile.getMyKw2(),
                profile.getMyKw3(),
                profile.getYourKw1(),
                profile.getYourKw2(),
                profile.getYourKw3()
        );
    }
}