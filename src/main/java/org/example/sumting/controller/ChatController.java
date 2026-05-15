package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ChatMessageDto;
import org.example.sumting.dto.ChatMessageResponseDto;
import org.example.sumting.entity.Message;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
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
    private final SimpMessagingTemplate messagingTemplate;

    // 클라이언트가 /app/chat.send로 메시지를 전송하면 호출된다.
    // 두 사용자가 MATCHED 상태인지 확인 후 메시지를 저장하고, 발신자와 수신자 모두에게 실시간으로 전달한다.
    @MessageMapping("/chat.send")
    @Transactional
    public void send(@Payload ChatMessageDto dto, Principal principal) {
        Long senderId = extractKakaoId(principal);
        Long receiverId = dto.getReceiverId();

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

        ChatMessageResponseDto response = new ChatMessageResponseDto(
            saved.getId(), saved.getSenderId(), saved.getReceiverId(),
            saved.getContent(), saved.getCreatedAt()
        );

        // 수신자와 발신자 모두에게 전송
        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/chat", response);
        messagingTemplate.convertAndSendToUser(receiverId.toString(), "/queue/chat", response);
    }

    private Long extractKakaoId(Principal principal) {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) principal;
        return ((Number) token.getPrincipal().getAttributes().get("id")).longValue();
    }
}
