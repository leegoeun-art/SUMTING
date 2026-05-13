package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.entity.User;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.enums.Gender;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    private static final String[] ADJECTIVES = {
        "귀여운", "멋진", "따뜻한", "활발한", "설레는", "반짝이는", "다정한", "씩씩한"
    };
    private static final String[] NOUNS = {
        "수뭉", "팅이", "별님", "달님", "봄이", "구름", "햇살", "새벽"
    };

    private String generateNickname() {
        Random rng = new Random();
        String candidate;
        do {
            String adj  = ADJECTIVES[rng.nextInt(ADJECTIVES.length)];
            String noun = NOUNS[rng.nextInt(NOUNS.length)];
            int    num  = 1000 + rng.nextInt(9000);
            candidate = adj + noun + num;
        } while (userProfileRepository.existsByNickName(candidate));
        return candidate;
    }

    public void saveProfile(ProfileDto dto) {
        User user = userRepository.findById(Long.parseLong(dto.getUser_id()))
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUser_id()));

        Gender gender = dto.isGender() ? Gender.M : Gender.F;

        UserProfile userProfile = UserProfile.builder()
                .user(user)
                .gender(gender)
                .department(dto.getDepartment())
                .nickName(generateNickname())
                .age(dto.getAge())
                .height(dto.getHeight())
                .myKw1(dto.getMy_kw1())
                .myKw2(dto.getMy_kw2())
                .myKw3(dto.getMy_kw3())
                .yourKw1(dto.getYour_kw1())
                .yourKw2(dto.getYour_kw2())
                .yourKw3(dto.getYour_kw3())
                .build();

        userProfileRepository.save(userProfile);
    }
}