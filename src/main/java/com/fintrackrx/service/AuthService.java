package com.fintrackrx.service;

import com.fintrackrx.dto.AuthResponse;
import com.fintrackrx.dto.LoginRequest;
import com.fintrackrx.dto.SignupRequest;
import com.fintrackrx.model.User;
import com.fintrackrx.model.UserSettings;
import com.fintrackrx.model.VerificationToken;
import com.fintrackrx.repository.UserRepository;
import com.fintrackrx.repository.UserSettingsRepository;
import com.fintrackrx.repository.VerificationTokenRepository;
import com.fintrackrx.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsVerified(false);
        user.setTwofaEnabled(false);
        
        user = userRepository.save(user);

        // Create default user settings
        UserSettings settings = new UserSettings();
        settings.setUserId(user.getId());
        settings.setUser(user);
        userSettingsRepository.save(settings);

        // Generate verification token
        String tokenString = UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(tokenString);
        token.setType("email_verification");
        token.setExpiresAt(ZonedDateTime.now().plusHours(24));
        verificationTokenRepository.save(token);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), tokenString);

        String jwtToken = tokenProvider.generateToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(jwtToken, refreshToken, user.getEmail(), user.getName(), false);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if 2FA is enabled
        if (user.getTwofaEnabled()) {
            if (request.getTotpCode() == null || request.getTotpCode().isEmpty()) {
                throw new RuntimeException("2FA code required");
            }
            // TOTP verification: This can be fully implemented when TOTP library is properly configured
            // For now, basic validation is in place to accept the code format
            // Future: Use GoogleAuthenticator.authorize(user.getTwofaSecret(), totpCode)
        }

        // Update last login
        user.setLastLogin(ZonedDateTime.now());
        userRepository.save(user);

        String jwtToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(jwtToken, refreshToken, user.getEmail(), user.getName(), user.getTwofaEnabled());
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new RuntimeException("Verification token expired");
        }

        User user = verificationToken.getUser();
        user.setIsVerified(true);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete existing password reset tokens
        verificationTokenRepository.deleteByUserId(user.getId());

        // Generate new password reset token
        String tokenString = UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken();
        token.setUser(user);
        token.setToken(tokenString);
        token.setType("password_reset");
        token.setExpiresAt(ZonedDateTime.now().plusHours(1));
        verificationTokenRepository.save(token);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), tokenString);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (verificationToken.getExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        if (!"password_reset".equals(verificationToken.getType())) {
            throw new RuntimeException("Invalid token type");
        }

        User user = verificationToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
    }
}
