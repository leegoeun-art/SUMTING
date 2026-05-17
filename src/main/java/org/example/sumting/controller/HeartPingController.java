package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.SentHeartPingDto;
import org.example.sumting.entity.User;
import org.example.sumting.repository.UserRepository;
import org.example.sumting.service.HeartpingService;
import org.example.sumting.service.LoadHeartpingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HeartPingController {

    private final HeartpingService heartpingService;
    private final LoadHeartpingService loadHeartpingService;
    private final UserRepository userRepository;

    // 상대방에게 하트핑(좋아요)을 전송한다. senderId는 서버 세션에서 추출한다.
    @PostMapping("/heartPing")
    public void heartping(@AuthenticationPrincipal OAuth2User oAuth2User,
                          @RequestBody HeartPingDto heartPingDto) {
        Long senderId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User receiver = userRepository.findByUuid(heartPingDto.getReceiverUuid())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        heartpingService.saveHeartPing(senderId, receiver.getId());
    }

    // 현재 로그인한 사용자가 받은 하트핑 목록을 조회한다.
    @GetMapping("/receiveHeartPing")
    public List<SentHeartPingDto> receiveHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return loadHeartpingService.loadReceive(userId);
    }

    // 현재 로그인한 사용자가 보낸 하트핑 목록을 조회한다.
    @GetMapping("/sendHeartPing")
    public List<SentHeartPingDto> sendHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return loadHeartpingService.loadSend(userId);
    }

    // 받은 하트핑을 수락하고 MATCHED 상태로 전환한다.
    @PostMapping("approveHeartPing")
    public void approveHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User,
                                 @RequestBody String senderUuid) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User sender = userRepository.findByUuid(senderUuid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        heartpingService.approveHeartPing(myId, sender.getId());
    }

    // 받은 하트핑을 거절하고 REJECTED 상태로 전환한다.
    @PostMapping("rejectHeartPing")
    public void rejectHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User,
                                @RequestBody String senderUuid) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User sender = userRepository.findByUuid(senderUuid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        heartpingService.rejectHeartPing(myId, sender.getId());
    }
}
