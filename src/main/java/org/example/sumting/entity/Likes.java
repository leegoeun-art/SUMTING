package org.example.sumting.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.sumting.enums.LikeStatus;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "likes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_interaction",
                        columnNames = {"sender_id", "receiver_id"}
                )
        }
)
public class Likes {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING', 'MATCHED', 'REJECTED', 'EXITED') DEFAULT 'PENDING'")
    private LikeStatus status = LikeStatus.PENDING;

    @Column(name = "created_at", insertable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Builder
    public Likes(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    // 매칭 상태 업데이트를 위한 메서드
    public void updateStatus(LikeStatus status) {
        this.status = status;
    }
}