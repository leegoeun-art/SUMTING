package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ChatMessageDto;
import org.example.sumting.dto.ChatMessageResponseDto;
import org.example.sumting.entity.Message;
import org.example.sumting.entity.User;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
import org.example.sumting.repository.UserRepository;
import org.example.sumting.service.FirebasePushService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageRepository messageRepository;
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FirebasePushService firebasePushService;

    @MessageMapping("/chat.send")
    @Transactional
    public void send(@Payload ChatMessageDto dto, Principal principal) {
        Long senderId = extractKakaoId(principal);
        User receiver = userRepository.findByUuid(dto.getReceiverUuid())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Long receiverId = receiver.getId();

        if (!likesRepository.existsMatchBetween(senderId, receiverId, LikeStatus.MATCHED)) {
            return;
        }

        Message saved = messageRepository.save(
            Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(dto.getContent())
                .build()
        );

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
        String senderUuid = sender.getUuid();
        String receiverUuid = receiver.getUuid();

        ChatMessageResponseDto response = new ChatMessageResponseDto(
            saved.getId(), senderUuid, receiverUuid,
            saved.getContent(), saved.getCreatedAt(), false
        );

        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/chat", response);
        messagingTemplate.convertAndSendToUser(receiverId.toString(), "/queue/chat", response);

        firebasePushService.sendChatNotification(receiverId, senderId, dto.getContent());
    }

    private Long extractKakaoId(Principal principal) {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) principal;
        return ((Number) token.getPrincipal().getAttributes().get("id")).longValue();
    }
}
