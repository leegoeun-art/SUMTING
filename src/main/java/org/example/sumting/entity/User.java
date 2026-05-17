package org.example.sumting.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    private Long id; // 카카오 고유 식별번호 (Primary Key)

    @Column(name = "uuid", updatable = false, nullable = false, unique = true)
    private String uuid;

    private int heart = 5;

    private String fcmToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public User(Long id) {
        this.id = id;
        this.uuid = UUID.randomUUID().toString();
    }

    public void updateFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }

    public void decrementHeart() {
        if (this.heart <= 0) throw new IllegalStateException("하트가 부족합니다.");
        this.heart--;
    }

    public void resetHeart() {
        this.heart = 5;
    }
}