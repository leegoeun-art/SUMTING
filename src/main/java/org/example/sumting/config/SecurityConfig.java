package org.example.sumting.config;

import lombok.RequiredArgsConstructor;
import org.example.sumting.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 설정 (개발 단계나 API 중심일 경우 보통 disable)
                .csrf(csrf -> csrf.disable())

                // 2. HTTP 요청에 대한 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login/**", "/oauth2/**").permitAll() // 로그인 관련 경로는 모두 허용
                        .anyRequest().authenticated() // 그 외 요청은 인증 필요
                )

                // 3. OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 우리가 만든 서비스 등록
                        )
                        .defaultSuccessUrl("/main", true) // 로그인 성공 시 이동할 페이지 (컨트롤러에 해당 경로가 있어야 함)
                )

                // 4. 로그아웃 설정
                .logout(logout -> logout
                        .logoutSuccessUrl("/")
                );

        return http.build();
    }
}