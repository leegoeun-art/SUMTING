package org.example.sumting.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.sumting.enums.Gender;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private Long userId;

    @MapsId // UserProfile.userId를 User.id와 매핑
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('M', 'F')")
    private Gender gender;

    private String department;
    private Integer age;
    private Integer height;

    private String myKw1;
    private String myKw2;
    private String myKw3;

    private String yourKw1;
    private String yourKw2;
    private String yourKw3;

    @Builder
    public UserProfile(User user, Gender gender, String department, Integer age, Integer height) {
        this.user = user;
        this.userId = user.getId();
        this.gender = gender;
        this.department = department;
        this.age = age;
        this.height = height;
    }
}