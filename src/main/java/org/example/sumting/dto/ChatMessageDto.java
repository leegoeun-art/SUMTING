package org.example.sumting.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageDto {
    private String receiverUuid;
    private String content;
}
