package org.example.sumting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class PageController {

    @GetMapping("/")
    public String splash() {
        return "forward:/index.html";
    }

    @GetMapping("/start")
    public String start() {
        return "forward:/index.html";
    }

    @GetMapping("/signup")
    public String signup() {
        return "forward:/index.html";
    }

    @GetMapping("/home")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping("/detail")
    public String detail() {
        return "forward:/index.html";
    }

    @GetMapping("/heartpings")
    public String heartpings() {
        return "forward:/index.html";
    }

    @GetMapping("/match-success")
    public String matchSuccess() {
        return "forward:/index.html";
    }

    @GetMapping("/chat")
    public String chat() {
        return "forward:/index.html";
    }

    @GetMapping("/profile")
    public String profile() {
        return "forward:/index.html";
    }

    @GetMapping("/ending")
    public String ending() {
        return "forward:/index.html";
    }
}
