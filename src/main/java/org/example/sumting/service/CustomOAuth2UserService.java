package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.entity.User; // 패키지 경로 확인 (entity 또는 domain)
import org.example.sumting.entity.UserProfile;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Spring용 권장

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional // DB 작업이 두 건(User, UserProfile)이므로 원자성 보장
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 카카오로부터 유저 정보 가져오기 (Access Token 기반)
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 카카오의 고유 식별자(id) 추출
        // user-name-attribute를 "id"로 설정했다면 oAuth2User.getName()으로 가능
        Map<String, Object> attributes = oAuth2User.getAttributes();
        Long kakaoId = ((Number) attributes.get("id")).longValue();

        // 3. 신규 유저 가입 처리
        // existsById를 써도 좋지만, findById를 사용하여 엔티티를 들고 있는 것이 추후 확장성에 좋습니다.
        if (!userRepository.existsById(kakaoId)) {
            createSocialUser(kakaoId);
        }

        // 4. 이후 시큐리티 세션에 담길 객체 반환
        return oAuth2User;
    }

    private void createSocialUser(Long kakaoId) {
        // users 테이블 저장
        User newUser = User.builder()
                .id(kakaoId)
                .build();
        userRepository.save(newUser);

        // user_profiles 테이블 저장 (1:1 관계이므로 함께 생성)
        UserProfile newProfile = UserProfile.builder()
                .user(newUser)
                .build();
        userProfileRepository.save(newProfile);
    }
}