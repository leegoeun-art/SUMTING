package org.example.sumting.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
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

        String preview = content.length() > 40 ? content.substring(0, 40) + "…" : content;

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .setNotification(Notification.builder()
                        .setTitle("새 메시지가 도착했어요 💬")
                        .setBody(preview)
                        .build())
                .putData("type", "chat")
                .putData("senderId", senderId.toString())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            // 알림 실패해도 채팅은 정상 동작
        }
    }

    public void sendMatchNotification(Long kakaoUserId) {
        User user = userRepository.findById(kakaoUserId).orElse(null);
        if (user == null || user.getFcmToken() == null) return;

        Message message = Message.builder()
                .setToken(user.getFcmToken())
                .setNotification(Notification.builder()
                        .setTitle("매칭 성공!")
                        .setBody("서로 마음이 통했어요! 지금 채팅을 시작해보세요.")
                        .build())
                .build();

        try {
            FirebaseMessaging.getInstance().send(message);
        } catch (FirebaseMessagingException e) {
            throw new RuntimeException("FCM 전송 실패: " + e.getMessage(), e);
        }
    }
}
