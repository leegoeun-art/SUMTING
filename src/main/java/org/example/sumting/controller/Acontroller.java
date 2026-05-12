package org.example.sumting.controller;

import lombok.RequiredArgsConstructor;
import org.example.sumting.dto.HeartPingDto;
import org.example.sumting.dto.ModifyHeartPingDto;
import org.example.sumting.dto.ProfileDto;
import org.example.sumting.dto.couples.RequestCouplesDto;
import org.example.sumting.dto.couples.ResponseCouplesDto;
import org.example.sumting.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class Acontroller {
    ProfileService profileService;

    @PostMapping("/profile")
    public void profile(@RequestBody ProfileDto profileDto) {
        profileService.saveProfile(profileDto);
    }

    @GetMapping("/couples")
    public ResponseCouplesDto couples(@RequestBody RequestCouplesDto requestCouplesDto) {
        return null;
    }

    @PostMapping("/heartPing")
    public void heartping(@RequestBody HeartPingDto heartPingDto){

    }

    @GetMapping("/receiveHeartPing")
    public ProfileDto receiveHeartPing(@RequestBody String receiver_id){
        return null;
    }

    @GetMapping("/SendHeartPing")
    public ProfileDto SendHeartPing(@RequestBody String sender_id){
        return null;
    }

    @PostMapping("/ModifyHeartPing")
    public void ModifyHeartPing(@RequestBody ModifyHeartPingDto modifyHeartPingDto){

    }
}
