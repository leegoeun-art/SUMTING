package org.example.sumting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HeartPingDto {
    private String sender_id;
    private String receiver_id;
}
