package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
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
    private final FirebasePushService firebasePushService;

    @Transactional
    public void saveHeartPing(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + senderId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + receiverId));

        if (likesRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new IllegalStateException("이미 heartping을 보냈습니다.");
        }

        sender.decrementHeart();

        Likes likes = Likes.builder()
                .sender(sender)
                .receiver(receiver)
                .build();
        likesRepository.save(likes);

        // 상대방이 이미 나에게 heartping을 보낸 경우 → 양쪽 모두 MATCHED 처리
        boolean isMatch = likesRepository.findBySenderAndReceiverAndStatus(receiver, sender, LikeStatus.PENDING)
                .map(reverseLike -> {
                    reverseLike.updateStatus(LikeStatus.MATCHED);
                    likes.updateStatus(LikeStatus.MATCHED);
                    return true;
                }).orElse(false);

        if (isMatch) {
            firebasePushService.sendMatchNotification(sender.getId());
            firebasePushService.sendMatchNotification(receiver.getId());
        } else {
            firebasePushService.sendHeartpingNotification(receiver.getId());
        }
    }

    @Transactional
    public void approveHeartPing(Long myId, Long senderId) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(myId).orElseThrow();

        Likes likes = likesRepository
                .findBySenderAndReceiverAndStatus(sender, receiver, LikeStatus.PENDING)
                .orElseThrow(() -> new IllegalStateException("수락할 하트핑이 없습니다."));

        likes.updateStatus(LikeStatus.MATCHED);
        firebasePushService.sendMatchNotification(sender.getId());
        firebasePushService.sendMatchNotification(receiver.getId());
    }

    @Transactional
    public void rejectHeartPing(Long myId, Long senderId) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(myId).orElseThrow();

        Likes likes = likesRepository
                .findBySenderAndReceiverAndStatus(sender, receiver, LikeStatus.PENDING)
                .orElseThrow(() -> new IllegalStateException("거절할 하트핑이 없습니다."));

        likes.updateStatus(LikeStatus.REJECTED);
    }
}
