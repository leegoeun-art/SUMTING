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

    @Column(name = "nickname")
    private String nickName;

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
    public UserProfile(User user, String nickName, Gender gender, String department, Integer age, Integer height,
                       String myKw1, String myKw2, String myKw3,
                       String yourKw1, String yourKw2, String yourKw3) {
        this.user = user;
        this.userId = user.getId();
        this.nickName = nickName;
        this.gender = gender;
        this.department = department;
        this.age = age;
        this.height = height;
        this.myKw1 = myKw1;
        this.myKw2 = myKw2;
        this.myKw3 = myKw3;
        this.yourKw1 = yourKw1;
        this.yourKw2 = yourKw2;
        this.yourKw3 = yourKw3;
    }
}