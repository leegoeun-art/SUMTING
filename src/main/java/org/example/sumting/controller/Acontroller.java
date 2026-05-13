package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.ModifyHeartPingDto;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.dto.couples.RequestCouplesDto;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import java.util.List;
import org.example.sumting.service.CoupleService;
import org.example.sumting.service.HeartpingService;
import org.example.sumting.service.LoadHeartpingService;
import org.example.sumting.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class Acontroller {
    private final ProfileService profileService;
    private final CoupleService coupleService;
    private final HeartpingService heartpingService;
    private final LoadHeartpingService loadHeartpingService;

    @PostMapping("/profile")
    public void profile(@RequestBody ProfileDto profileDto) {
        profileService.saveProfile(profileDto);
    }

    @GetMapping("/couples")
    public List<ResponseCouplesDto> couples(@RequestBody RequestCouplesDto requestCouplesDto) {
        return coupleService.loadCouples(requestCouplesDto);
    }

    @PostMapping("/heartPing")
    public void heartping(@RequestBody HeartPingDto heartPingDto){
        heartpingService.saveHeartPing(heartPingDto);
    }

    @GetMapping("/receiveHeartPing")
    public List<ProfileDto> receiveHeartPing(@RequestBody String nickname){
        return loadHeartpingService.loadReceive(nickname);
    }

    @GetMapping("/sendHeartPing")
    public List<ProfileDto> SendHeartPing(@RequestBody String nickname){
        return loadHeartpingService.loadSend(nickname) ;
    }

    @PostMapping("/modifyHeartPing")
    public void ModifyHeartPing(@RequestBody ModifyHeartPingDto modifyHeartPingDto){

    }
}
