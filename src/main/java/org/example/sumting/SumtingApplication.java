package org.example.sumting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class SumtingApplication {

    public static void main(String[] args) {
        SpringApplication.run(SumtingApplication.class, args);
    }

}
