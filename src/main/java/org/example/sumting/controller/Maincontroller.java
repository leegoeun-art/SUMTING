package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ChatMessageResponseDto;
import org.example.sumting.dto.MatchedPartnerDto;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.entity.Report;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
import org.example.sumting.repository.ReportRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.service.CoupleService;
import org.example.sumting.service.HeartpingService;
import org.example.sumting.service.FirebasePushService;
import org.example.sumting.service.LoadHeartpingService;
import org.example.sumting.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.example.sumting.entity.Message;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Maincontroller {
    private final ProfileService profileService;
    private final CoupleService coupleService;
    private final HeartpingService heartpingService;
    private final LoadHeartpingService loadHeartpingService;
    private final FirebasePushService firebasePushService;
    private final UserProfileRepository userProfileRepository;
    private final LikesRepository likesRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;

    /*
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

    // 현재 로그인한 사용자의 키워드 기반으로 매칭 후보 목록을 조회한다.
    @GetMapping("/couples")
    public List<ResponseCouplesDto> couples(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return coupleService.loadCouples(userId);
    }

    // 상대방에게 하트핑(좋아요)을 전송하고 Likes 엔티티를 저장한다.
    @PostMapping("/heartPing")
    public void heartping(@RequestBody HeartPingDto heartPingDto){
        heartpingService.saveHeartPing(heartPingDto);
    }

    // 현재 로그인한 사용자가 받은 하트핑 목록을 조회한다.
    @GetMapping("/receiveHeartPing")
    public List<ProfileDto> receiveHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        System.out.println("userId: " + userId);
        return loadHeartpingService.loadReceive(userId);
    }

    // 현재 로그인한 사용자가 보낸 하트핑 목록을 조회한다.
    @GetMapping("/sendHeartPing")
    public List<ProfileDto> sendHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        System.out.println("userId: " + userId);
        return loadHeartpingService.loadSend(userId);
    }

    // 받은 하트핑의 수락/거절 상태를 변경한다. (미구현)
    @PostMapping("/modifyHeartPing")
    public void ModifyHeartPing(@RequestBody ModifyHeartPingDto modifyHeartPingDto){

    }

     */

    // [테스트용] 현재 로그인한 사용자에게 매칭 푸시 알림을 직접 전송한다.
    @PostMapping("/push/test")
    public ResponseEntity<?> testPush(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long kakaoId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        firebasePushService.sendMatchNotification(kakaoId);
        return ResponseEntity.ok().build();
    }

    // FCM 토큰을 DB에 저장한다.
    @PostMapping("/push/register")
    public ResponseEntity<?> registerPushToken(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long kakaoId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        firebasePushService.registerFcmToken(body.get("fcmToken"), kakaoId);
        return ResponseEntity.ok().build();
    }

    // 매칭된 특정 상대방과의 채팅 메시지 전체 목록을 조회한다. 매칭 상태가 아니면 403을 반환한다.
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

    // 상대방을 신고하고 차단한다. 신고 사유를 저장하고 likes 상태를 EXITED로 변경한다.
    @PostMapping("/chat/report")
    @Transactional
    public ResponseEntity<?> reportUser(
            @RequestParam Long partnerId,
            @RequestParam String reason,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        reportRepository.save(Report.builder()
                .reporterId(myId)
                .reportedId(partnerId)
                .reason(reason)
                .build());
        likesRepository.updateStatusBetween(myId, partnerId, LikeStatus.MATCHED, LikeStatus.EXITED);
        return ResponseEntity.ok().build();
    }

    // 채팅방을 나가면 두 유저 사이의 likes 상태를 EXITED로 변경한다.
    @PostMapping("/chat/leave")
    @Transactional
    public ResponseEntity<?> leaveChat(
            @RequestParam Long partnerId,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        likesRepository.updateStatusBetween(myId, partnerId, LikeStatus.MATCHED, LikeStatus.EXITED);
        return ResponseEntity.ok().build();
    }

    // 현재 사용자와 MATCHED 상태인 모든 상대방 목록을 조회한다.
    @GetMapping("/chat/matches")
    public ResponseEntity<List<MatchedPartnerDto>> getMatches(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        List<MatchedPartnerDto> partners = likesRepository.findAllMatchedByUserId(myId, LikeStatus.MATCHED)
            .stream()
            .map(l -> {
                Long partnerId = l.getSender().getId().equals(myId) ? l.getReceiver().getId() : l.getSender().getId();
                return userProfileRepository.findByUserId(partnerId)
                    .map(p -> {
                        List<Message> msgs = messageRepository.findLastMessage(myId, partnerId, PageRequest.of(0, 1));
                        String lastMessage = msgs.isEmpty() ? null : msgs.get(0).getContent();
                        String lastTime = msgs.isEmpty() ? null : msgs.get(0).getCreatedAt().toString();
                        return new MatchedPartnerDto(String.valueOf(partnerId), p.getNickName(), p.getDepartment(), "default", lastMessage, lastTime);
                    })
                    .orElse(null);
            })
            .filter(Objects::nonNull)
            .toList();
        return ResponseEntity.ok(partners);
    }
}
