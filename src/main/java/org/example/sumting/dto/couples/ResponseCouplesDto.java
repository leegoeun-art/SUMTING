package org.example.sumting.dto.couples;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseCouplesDto {

    private String user_id;
    private String nickname;
    private String department;
    private Integer age;
    private Integer height;
    private String my_kw1;
    private String my_kw2;
    private String my_kw3;
    private String status; // "none" | "pending" | "matched"
}
