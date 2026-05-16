package com.clouddrive.service.impl;

import com.clouddrive.dto.*;
import com.clouddrive.entity.User;
import com.clouddrive.exception.BadRequestException;
import com.clouddrive.repository.UserRepository;
import com.clouddrive.security.CustomUserDetails;
import com.clouddrive.security.JwtService;
import com.clouddrive.service.AuthService;
import com.clouddrive.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                         AuthenticationManager authenticationManager, JwtService jwtService,
                         EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            if (user.isVerified()) {
                throw new BadRequestException("Email is already registered and verified");
            }
        } else {
            user = new User();
            user.setEmail(email);
        }

        user.setName(request.name().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        
        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setLastOtpSentAt(LocalDateTime.now());
        user.setFailedAttempts(0);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);

        return new MessageResponse("OTP sent to your email");
    }

    @Override
    @Transactional
    public AuthResponse verifySignupOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Account already verified");
        }

        validateOtp(user, request.otp());

        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setFailedAttempts(0);
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail());
    }

    @Override
    @Transactional
    public MessageResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.isVerified()) {
            throw new BadRequestException("Account not verified. Please verify your email first.");
        }

        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setLastOtpSentAt(LocalDateTime.now());
        user.setFailedAttempts(0);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);

        return new MessageResponse("OTP sent to your email for login");
    }

    @Override
    @Transactional
    public AuthResponse verifyLoginOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!user.isVerified()) {
            throw new BadRequestException("Account not verified");
        }

        validateOtp(user, request.otp());

        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setFailedAttempts(0);
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail());
    }

    @Override
    @Transactional
    public MessageResponse resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (user.getLastOtpSentAt() != null && user.getLastOtpSentAt().plusMinutes(1).isAfter(LocalDateTime.now())) {
            throw new BadRequestException("Please wait 1 minute before requesting a new OTP");
        }

        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setLastOtpSentAt(LocalDateTime.now());
        user.setFailedAttempts(0);
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);

        return new MessageResponse("OTP resent to your email");
    }

    private void validateOtp(User user, String otp) {
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new BadRequestException("No OTP requested or OTP expired");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            user.setOtpCode(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        if (user.getFailedAttempts() >= 5) {
            user.setOtpCode(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new BadRequestException("Maximum OTP attempts reached. Please request a new OTP.");
        }

        if (!user.getOtpCode().equals(otp)) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            userRepository.save(user);
            throw new BadRequestException("Invalid OTP");
        }
    }
}
