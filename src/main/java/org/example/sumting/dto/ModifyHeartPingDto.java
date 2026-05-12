package org.example.sumting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModifyHeartPingDto {

    private String user_id;
    private String my_kw1;
    private String my_kw2;
    private String my_kw3;
    private String your_kw1;
    private String your_kw2;
    private String your_kw3;
}
