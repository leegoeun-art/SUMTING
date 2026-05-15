package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ChatMessageResponseDto;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.MatchedPartnerDto;
import org.example.sumting.dto.MeResponseDto;
import org.example.sumting.dto.ModifyHeartPingDto;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.dto.couples.RequestCouplesDto;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.entity.Likes;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.enums.Gender;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.service.CoupleService;
import org.example.sumting.service.HeartpingService;
import org.example.sumting.service.LoadHeartpingService;
import org.example.sumting.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
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
    private final LikesRepository likesRepository;
    private final MessageRepository messageRepository;

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
    public Map<String, String> profile(@RequestBody ProfileDto profileDto) {
        String nickname = profileService.saveProfile(profileDto);
        return Map.of("nickname", nickname);
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

    @GetMapping("/chat/messages")
    public ResponseEntity<List<ChatMessageResponseDto>> getChatMessages(
            @RequestParam Long partnerId,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        if (!likesRepository.existsMatchBetween(myId, partnerId, LikeStatus.MATCHED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<ChatMessageResponseDto> messages = messageRepository.findConversation(myId, partnerId)
            .stream()
            .map(m -> new ChatMessageResponseDto(m.getId(), m.getSenderId(), m.getReceiverId(), m.getContent(), m.getCreatedAt()))
            .toList();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/chat/matches")
    public ResponseEntity<List<MatchedPartnerDto>> getMatches(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        List<MatchedPartnerDto> partners = likesRepository.findAllMatchedByUserId(myId, LikeStatus.MATCHED)
            .stream()
            .map(l -> {
                Long partnerId = l.getSender().getId().equals(myId) ? l.getReceiver().getId() : l.getSender().getId();
                return userProfileRepository.findByUserId(partnerId)
                    .map(p -> new MatchedPartnerDto(String.valueOf(partnerId), p.getNickName(), p.getDepartment(), "default"))
                    .orElse(null);
            })
            .filter(Objects::nonNull)
            .toList();
        return ResponseEntity.ok(partners);
    }
}
