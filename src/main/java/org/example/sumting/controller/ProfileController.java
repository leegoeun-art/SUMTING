package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.MeResponseDto;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.enums.Gender;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.service.LoadHeartpingService;
import org.example.sumting.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final LoadHeartpingService loadHeartpingService;
    private final UserProfileRepository userProfileRepository;


    // 현재 로그인한 사용자의 프로필 정보를 반환한다. 프로필이 없으면 204 No Content를 반환한다.
    @GetMapping("/me")
    public ResponseEntity<MeResponseDto> me(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long kakaoId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        int remainHeart = loadHeartpingService.loadRemainHeart(kakaoId);

        return userProfileRepository.findByUserId(kakaoId)
                .map(p -> {
                    String gender = p.getGender() == Gender.M ? "male" : p.getGender() == Gender.F ? "female" : null;
                    List<String> keywords = Stream.of(p.getMyKw1(), p.getMyKw2(), p.getMyKw3())
                            .filter(Objects::nonNull).toList();
                    List<String> idealKeywords = Stream.of(p.getYourKw1(), p.getYourKw2(), p.getYourKw3())
                            .filter(Objects::nonNull).toList();
                    return ResponseEntity.ok(new MeResponseDto(
                            String.valueOf(kakaoId), p.getNickName(), remainHeart, "default",
                            p.getDepartment(), p.getAge(), p.getHeight(),
                            gender, keywords, idealKeywords
                    ));
                })
                .orElse(ResponseEntity.noContent().build());
    }

    // 사용자 프로필(닉네임, 학과, 나이, 키, 성별, 키워드 등)을 저장하고 닉네임을 반환한다.
    @PostMapping("/profile")
    public Map<String, String> profile(@RequestBody ProfileDto profileDto) {
        String nickname = profileService.saveProfile(profileDto);
        return Map.of("nickname", nickname);
    }
}
