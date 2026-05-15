package org.example.sumting.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageDto {
    private Long receiverId;
    private String content;
}
