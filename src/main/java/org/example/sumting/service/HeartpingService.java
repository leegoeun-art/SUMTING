package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.entity.Likes;
import org.example.sumting.entity.User;
import org.example.sumting.enums.LikeStatus;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HeartpingService {

    private final LikesRepository likesRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveHeartPing(HeartPingDto heartPingDto) {
        User sender = userRepository.findById(heartPingDto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + heartPingDto.getSenderId()));
        User receiver = userRepository.findById(heartPingDto.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + heartPingDto.getReceiverId()));

        if (likesRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new IllegalStateException("이미 heartping을 보냈습니다.");
        }

        Likes likes = Likes.builder()
                .sender(sender)
                .receiver(receiver)
                .build();
        likesRepository.save(likes);

        // 상대방이 이미 나에게 heartping을 보낸 경우 → 양쪽 모두 MATCHED 처리
        likesRepository.findBySenderAndReceiverAndStatus(receiver, sender, LikeStatus.PENDING)
                .ifPresent(reverseLike -> {
                    reverseLike.updateStatus(LikeStatus.MATCHED);
                    likes.updateStatus(LikeStatus.MATCHED);
                });
    }
}
