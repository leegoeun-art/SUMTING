package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.MeResponseDto;
import org.example.sumting.dto.ModifyHeartPingDto;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.dto.couples.RequestCouplesDto;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.enums.Gender;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.service.CoupleService;
import org.example.sumting.service.HeartpingService;
import org.example.sumting.service.LoadHeartpingService;
import org.example.sumting.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Acontroller {
    private final ProfileService profileService;
    private final CoupleService coupleService;
    private final HeartpingService heartpingService;
    private final LoadHeartpingService loadHeartpingService;
    private final UserProfileRepository userProfileRepository;

    @GetMapping("/me")
    public ResponseEntity<MeResponseDto> me(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long kakaoId = ((Number) oAuth2User.getAttributes().get("id")).longValue();

        return userProfileRepository.findByUserId(kakaoId)
                .map(p -> {
                    String gender = p.getGender() == Gender.M ? "male" : p.getGender() == Gender.F ? "female" : null;
                    List<String> keywords = Stream.of(p.getMyKw1(), p.getMyKw2(), p.getMyKw3())
                            .filter(Objects::nonNull).toList();
                    List<String> idealKeywords = Stream.of(p.getYourKw1(), p.getYourKw2(), p.getYourKw3())
                            .filter(Objects::nonNull).toList();
                    return ResponseEntity.ok(new MeResponseDto(
                            String.valueOf(kakaoId), p.getNickName(), "default",
                            p.getDepartment(), p.getAge(), p.getHeight(),
                            gender, keywords, idealKeywords
                    ));
                })
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/profile")
    public void profile(@RequestBody ProfileDto profileDto) {
        profileService.saveProfile(profileDto);
    }

    @GetMapping("/couples")
    public List<ResponseCouplesDto> couples(@RequestBody RequestCouplesDto requestCouplesDto) {
        return coupleService.loadCouples(requestCouplesDto);
    }

    @PostMapping("/heartPing")
    public void heartping(@RequestBody HeartPingDto heartPingDto){
        heartpingService.saveHeartPing(heartPingDto);
    }

    @GetMapping("/receiveHeartPing")
    public List<ProfileDto> receiveHeartPing(@RequestBody String nickname){
        return loadHeartpingService.loadReceive(nickname);
    }

    @GetMapping("/sendHeartPing")
    public List<ProfileDto> SendHeartPing(@RequestBody String nickname){
        return loadHeartpingService.loadSend(nickname) ;
    }

    @PostMapping("/modifyHeartPing")
    public void ModifyHeartPing(@RequestBody ModifyHeartPingDto modifyHeartPingDto){

    }
}
