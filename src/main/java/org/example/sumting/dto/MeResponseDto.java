package org.example.sumting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MeResponseDto {
    private String id;
    private String nickname;
    private String mascotType;
    private String department;
    private int age;
    private int height;
    private String gender;
    private List<String> keywords;
    private List<String> idealKeywords;
}
