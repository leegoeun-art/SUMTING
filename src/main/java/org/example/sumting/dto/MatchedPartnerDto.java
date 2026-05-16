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
}
