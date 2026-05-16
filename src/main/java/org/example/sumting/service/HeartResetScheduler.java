package org.example.sumting.service;

import lombok.RequiredArgsConstructor;
import org.example.sumting.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class HeartResetScheduler {

    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void resetAllHeartsAtMidnight() {
        userRepository.findAll().forEach(user -> user.resetHeart());
    }
}
