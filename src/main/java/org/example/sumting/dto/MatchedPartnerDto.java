package org.example.sumting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MatchedPartnerDto {
    private String userId;
    private String nickname;
    private String department;
    private String mascotType;
    private String lastMessage;
    private String lastTime;
    private long unreadCount;
    private Integer age;
    private Integer height;
    private String myKw1;
    private String myKw2;
    private String myKw3;
    private String yourKw1;
    private String yourKw2;
    private String yourKw3;
}
