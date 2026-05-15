package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.ModifyHeartPingDto;
import org.example.sumting.dto.ProfileDto;
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


    // 상대방에게 하트핑(좋아요)을 전송하고 Likes 엔티티를 저장한다.
    @PostMapping("/heartPing")
    public void heartping(@RequestBody HeartPingDto heartPingDto){
        heartpingService.saveHeartPing(heartPingDto);
    }

    // 현재 로그인한 사용자가 받은 하트핑 목록을 조회한다.
    @GetMapping("/receiveHeartPing")
    public List<ProfileDto> receiveHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return loadHeartpingService.loadReceive(userId);
    }

    // 현재 로그인한 사용자가 보낸 하트핑 목록을 조회한다.
    @GetMapping("/sendHeartPing")
    public List<ProfileDto> sendHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return loadHeartpingService.loadSend(userId);
    }

    // 상대방의 하트핑을 승인하고 MATCHED 상태로 전환된다
    @PostMapping("approveHeartPing")
    public void approveHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User, @RequestBody Long senderId) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        heartpingService.approveHeartPing(userId, senderId);
    }

    // 상대방의 하트핑을 승인하고 REJECTED 상태로 전환된다
    @PostMapping("rejectHeartPing")
    public void rejectHeartPing(@AuthenticationPrincipal OAuth2User oAuth2User, @RequestBody Long senderId) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        heartpingService.rejectHeartPing(userId, senderId);
    }

    // 받은 하트핑의 수락/거절 상태를 변경한다. (미구현)
    @PostMapping("/modifyHeartPing")
    public void ModifyHeartPing(@RequestBody ModifyHeartPingDto modifyHeartPingDto){

    }
}
