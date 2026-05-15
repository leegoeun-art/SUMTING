package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.service.CoupleService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CouplesController {
    private final CoupleService coupleService;

    // 현재 로그인한 사용자의 키워드 기반으로 매칭 후보 목록을 조회한다.
    @GetMapping("/couples")
    public List<ResponseCouplesDto> couples(@AuthenticationPrincipal OAuth2User oAuth2User) {
        Long userId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        return coupleService.loadCouples(userId);
    }
}
