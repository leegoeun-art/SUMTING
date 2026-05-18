package org.example.sumting.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import org.example.sumting.entity.User;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FirebasePushService {

    private final UserRepository userRepository;

    @Transactional
    public void registerFcmToken(String fcmToken, Long kakaoUserId) {
        userRepository.findById(kakaoUserId)
                .ifPresent(user -> user.updateFcmToken(fcmToken));
    }

    public void sendChatNotification(Long receiverId, Long senderId, String content) {
        User user = userRepository.findById(receiverId).orElse(null);
        if (user == null || user.getFcmToken() == null) return;

        String preview = content.startsWith("/api/chat/image/")
                ? "사진이 전송되었습니다"
                : (content.length() > 40 ? content.substring(0, 40) + "…" : content);

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .putData("type", "chat")
                .putData("title", "새 메시지가 도착했어요 💬")
                .putData("body", preview)
                .putData("senderId", senderId.toString())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            // 알림 실패해도 채팅은 정상 동작
        }
    }

    public void sendHeartpingNotification(Long receiverId) {
        User user = userRepository.findById(receiverId).orElse(null);
        if (user == null || user.getFcmToken() == null) return;

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .putData("type", "heartping")
                .putData("title", "누군가 하트핑을 보냈어요 💛")
                .putData("body", "지금 확인해보세요!")
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            // 알림 실패해도 하트핑은 정상 동작
        }
    }

    public void sendMatchNotification(Long kakaoUserId) {
        User user = userRepository.findById(kakaoUserId).orElse(null);
        if (user == null || user.getFcmToken() == null) return;

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .putData("type", "match")
                .putData("title", "매칭 성공!")
                .putData("body", "서로 마음이 통했어요! 지금 채팅을 시작해보세요.")
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            throw new RuntimeException("FCM 전송 실패: " + e.getMessage(), e);
        }
    }
}
