package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ChatMessageDto;
import org.example.sumting.dto.ChatMessageResponseDto;
import org.example.sumting.dto.MatchedPartnerDto;
import org.example.sumting.dto.ReadReceiptDto;
import org.example.sumting.entity.Message;
import org.example.sumting.entity.Report;
import org.example.sumting.entity.User;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
import org.example.sumting.repository.ReportRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.example.sumting.service.FirebasePushService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final MessageRepository messageRepository;
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final ReportRepository reportRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final FirebasePushService firebasePushService;

    @Value("${app.chat.upload-dir:./chat-uploads}")
    private String uploadDir;

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

        ChatMessageResponseDto response = new ChatMessageResponseDto(
            saved.getId(), sender.getUuid(), receiver.getUuid(),
            saved.getContent(), saved.getCreatedAt(), false
        );

        messagingTemplate.convertAndSendToUser(principal.getName(), "/queue/chat", response);
        messagingTemplate.convertAndSendToUser(receiverId.toString(), "/queue/chat", response);

        firebasePushService.sendChatNotification(receiverId, senderId, dto.getContent());
    }

    @GetMapping("/matches")
    @Transactional(readOnly = true)
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
                        long unreadCount = messageRepository.countUnread(myId, partnerId);
                        return new MatchedPartnerDto(p.getUser().getUuid(), p.getNickName(), p.getDepartment(), "default", lastMessage, lastTime, unreadCount);
                    })
                    .orElse(null);
            })
            .filter(Objects::nonNull)
            .toList();
        return ResponseEntity.ok(partners);
    }

    @GetMapping("/messages")
    @Transactional
    public ResponseEntity<List<ChatMessageResponseDto>> getChatMessages(
            @RequestParam String partnerUuid,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User partner = userRepository.findByUuid(partnerUuid).orElse(null);
        if (partner == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        Long partnerId = partner.getId();
        if (!likesRepository.existsMatchBetween(myId, partnerId, LikeStatus.MATCHED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        messageRepository.markAsRead(myId, partnerId);
        messagingTemplate.convertAndSendToUser(partnerId.toString(), "/queue/chat-read", new ReadReceiptDto(myId));
        String myUuid = userRepository.findById(myId).map(User::getUuid).orElse("");
        List<ChatMessageResponseDto> messages = messageRepository.findConversation(myId, partnerId)
            .stream()
            .map(m -> {
                String senderUuid = m.getSenderId().equals(myId) ? myUuid : partnerUuid;
                String receiverUuid = m.getReceiverId().equals(myId) ? myUuid : partnerUuid;
                return new ChatMessageResponseDto(m.getId(), senderUuid, receiverUuid, m.getContent(), m.getCreatedAt(), m.isRead());
            })
            .toList();
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/read")
    @Transactional
    public ResponseEntity<?> markChatAsRead(
            @RequestParam String partnerUuid,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User partner = userRepository.findByUuid(partnerUuid).orElse(null);
        if (partner == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        Long partnerId = partner.getId();
        messageRepository.markAsRead(myId, partnerId);
        messagingTemplate.convertAndSendToUser(partnerId.toString(), "/queue/chat-read", new ReadReceiptDto(myId));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report")
    @Transactional
    public ResponseEntity<?> reportUser(
            @RequestParam String partnerUuid,
            @RequestParam String reason,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User partner = userRepository.findByUuid(partnerUuid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        Long partnerId = partner.getId();
        reportRepository.save(Report.builder()
                .reporterId(myId)
                .reportedId(partnerId)
                .reason(reason)
                .build());
        likesRepository.updateStatusBetween(myId, partnerId, LikeStatus.MATCHED, LikeStatus.EXITED);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/leave")
    @Transactional
    public ResponseEntity<?> leaveChat(
            @RequestParam String partnerUuid,
            @AuthenticationPrincipal OAuth2User oAuth2User) {
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        User partner = userRepository.findByUuid(partnerUuid)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        likesRepository.updateStatusBetween(myId, partner.getId(), LikeStatus.MATCHED, LikeStatus.EXITED);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadChatImage(
            @RequestParam MultipartFile file,
            @AuthenticationPrincipal OAuth2User oAuth2User) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "img";
        int dot = originalName.lastIndexOf('.');
        String ext = dot >= 0 ? originalName.substring(dot) : ".jpg";
        String filename = UUID.randomUUID() + ext;
        Files.copy(file.getInputStream(), dir.resolve(filename));
        return ResponseEntity.ok(Map.of("url", "/api/chat/image/" + filename));
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getChatImage(
            @PathVariable String filename,
            @AuthenticationPrincipal OAuth2User oAuth2User) throws IOException {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return ResponseEntity.badRequest().build();
        }
        Long myId = ((Number) oAuth2User.getAttributes().get("id")).longValue();
        String url = "/api/chat/image/" + filename;
        if (messageRepository.countMessageWithUrlForUser(url, myId) == 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Path filePath = Paths.get(uploadDir).resolve(filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }
        byte[] data = Files.readAllBytes(filePath);
        String ct = Files.probeContentType(filePath);
        return ResponseEntity.ok()
                .header("Content-Type", ct != null ? ct : "image/jpeg")
                .body(data);
    }

    private Long extractKakaoId(Principal principal) {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) principal;
        return ((Number) token.getPrincipal().getAttributes().get("id")).longValue();
    }
}
