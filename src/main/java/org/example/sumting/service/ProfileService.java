package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.entity.User;
import org.example.sumting.entity.UserProfile;
import org.example.sumting.enums.Gender;
import org.example.sumting.repository.LikesRepository;
import org.example.sumting.repository.MessageRepository;
import org.example.sumting.repository.ReportRepository;
import org.example.sumting.repository.UserProfileRepository;
import org.example.sumting.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final LikesRepository likesRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;

    private static final String[] ADJECTIVES = {
        "귀여운", "멋진", "따뜻한", "활발한", "설레는", "반짝이는", "다정한", "씩씩한",
        "사랑스런", "포근한", "상냥한", "발랄한", "밝은", "순수한", "맑은", "빛나는",
        "행복한", "즐거운", "유쾌한", "신나는", "두근두근한", "살랑이는", "산뜻한", "사뿐한",
        "낭만적인", "몽글몽글한", "복슬복슬한", "폭신한", "따스한", "온화한", "수줍은", "설레이는",
        "달콤한", "향긋한", "청량한", "상쾌한", "부드러운", "고요한", "잔잔한", "투명한",
        "반듯한", "의젓한", "당당한", "늠름한", "용감한", "활기찬", "생기있는", "에너지넘치는",
        "차분한", "여유로운", "느긋한", "평화로운", "안락한", "아늑한", "편안한", "아담한",
        "소중한", "특별한", "독특한", "신비로운", "매력적인", "빛살같은", "꿈같은", "동화같은",
        "하늘같은", "봄같은", "여름같은", "가을같은", "겨울같은", "무지개같은", "구름같은", "별같은",
        "꽃같은", "나비같은", "햇살같은", "달빛같은", "눈송이같은", "이슬같은", "샘물같은", "바람같은",
        "든든한", "믿음직한", "진실된", "솔직한", "천진한", "순진한", "해맑은", "명랑한",
        "총명한", "영리한", "지혜로운", "섬세한", "감성적인", "따뜻따뜻한", "사근사근한", "싱그러운"
    };
    private static final String[] NOUNS = {
        "수뭉", "별님", "달님", "봄이", "구름", "햇살", "새벽",
        "은하", "소나기", "무지개", "노을", "이슬", "안개", "서리", "눈꽃",
        "나비", "반딧불", "꽃잎", "벚꽃", "장미", "민들레", "라벤더", "수선화",
        "코코", "몽이", "뭉치", "뭉이", "토리", "솜이", "콩이", "팥이",
        "하늘이", "바다이", "숲이", "별이", "달이", "해님", "빛이", "샛별",
        "봄날", "여름밤", "가을빛", "겨울별", "새벽빛", "황혼이", "여명이", "석양이",
        "도토리", "솔방울", "단풍이", "클로버", "아이비", "재스민", "히나",
        "동글이", "포동이", "보들이", "폭신이", "두리", "누리", "가온이", "온이",
        "사랑이", "행복이", "기쁨이", "꿈이", "희망이", "설렘이", "다솜이", "나래",
        "아리", "하리", "소리", "노리", "모리", "보리", "고리", "조리",
        "루나", "솔라", "스텔라", "오로라", "세레나", "아리아", "멜로디", "하모니",
        "초코", "바닐라", "카라멜", "마카롱", "쿠키", "머핀", "와플", "크레페",
        "퐁당이", "몽실이", "뭉실이", "올망이", "졸망이", "아몽이", "도롱이", "나풀이"
    };

    private String generateNickname() {
        Random rng = new Random();
        String candidate;
        do {
            String adj  = ADJECTIVES[rng.nextInt(ADJECTIVES.length)];
            String noun = NOUNS[rng.nextInt(NOUNS.length)];
            candidate = adj + noun;
        } while (userProfileRepository.existsByNickName(candidate));
        return candidate;
    }

    @Transactional
    public String saveProfile(ProfileDto dto) {
        User user = userRepository.findByUuid(dto.getUser_id())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUser_id()));

        Gender gender = dto.isGender() ? Gender.M : Gender.F;
        String nickname = generateNickname();
        System.out.println("---------------------------------------------------------------------nickname: " + nickname);

        UserProfile userProfile = UserProfile.builder()
                .user(user)
                .nickName(nickname)
                .gender(gender)
                .department(dto.getDepartment())
                .age(dto.getAge())
                .height(dto.getHeight())
                .myKw1(dto.getMy_kw1())
                .myKw2(dto.getMy_kw2())
                .myKw3(dto.getMy_kw3())
                .yourKw1(dto.getYour_kw1())
                .yourKw2(dto.getYour_kw2())
                .yourKw3(dto.getYour_kw3())
                .build();

        userProfileRepository.save(userProfile);
        return nickname;
    }

    @Transactional
    public void withdraw(Long userId) {
        messageRepository.deleteAllByUserId(userId);
        reportRepository.deleteAllByUserId(userId);
        likesRepository.deleteAllByUserId(userId);
        userProfileRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }
}