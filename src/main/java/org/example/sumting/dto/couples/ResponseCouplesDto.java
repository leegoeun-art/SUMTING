package org.example.sumting.dto.couples;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseCouplesDto {

    private String user_id;
    private String department;
    private String your_kw1;
    private String your_kw2;
    private String your_kw3;
}
