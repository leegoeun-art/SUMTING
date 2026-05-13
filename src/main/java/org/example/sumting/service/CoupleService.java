package org.example.sumting.service;


import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.couples.RequestCouplesDto;
import org.example.sumting.entity.User;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CoupleService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public void loadCouples(RequestCouplesDto dto) {

    }
}

//user_id로 본인의 my_kw 조회
//DB에서 본인과 다른 성별 필터링
//DB에서 your_kw와 1개 이상 겹치는 사용자의 user_id, department, my_kw return
