package org.example.sumting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.sumting.enums.Gender;

@Data
@AllArgsConstructor
public class ProfileDto {

    private String user_id;
    private String nickname;
    private boolean gender;
    private String department;
    private int age;
    private int height;
    private String my_kw1;
    private String my_kw2;
    private String my_kw3;
    private String your_kw1;
    private String your_kw2;
    private String your_kw3;
}
