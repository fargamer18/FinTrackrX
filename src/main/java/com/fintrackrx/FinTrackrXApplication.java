package com.fintrackrx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FinTrackrXApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinTrackrXApplication.class, args);
    }
}
