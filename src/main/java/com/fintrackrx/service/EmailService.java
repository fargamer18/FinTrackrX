package com.fintrackrx.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String to, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("FinTrackrX - Verify Your Email");
        message.setText("Welcome to FinTrackrX!\n\n" +
                "Please verify your email by clicking the link below:\n" +
                verificationUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account, please ignore this email.");
        
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("FinTrackrX - Password Reset");
        message.setText("You requested a password reset.\n\n" +
                "Click the link below to reset your password:\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.");
        
        mailSender.send(message);
    }

    public void send2FAEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("FinTrackrX - Your 2FA Code");
        message.setText("Your 2FA authentication code is: " + code + "\n\n" +
                "This code will expire in 5 minutes.\n\n" +
                "If you didn't request this, please secure your account immediately.");
        
        mailSender.send(message);
    }
}
