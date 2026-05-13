package org.example.sumting.dto.couples;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.sumting.enums.Gender;

@Data
@AllArgsConstructor
public class RequestCouplesDto {

    private Long user_id;
    private Gender gender;
}
