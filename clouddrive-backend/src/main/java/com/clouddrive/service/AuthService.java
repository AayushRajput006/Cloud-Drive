package com.clouddrive.service;

import com.clouddrive.dto.AuthResponse;
import com.clouddrive.dto.LoginRequest;
import com.clouddrive.dto.RegisterRequest;

import com.clouddrive.dto.MessageResponse;
import com.clouddrive.dto.VerifyOtpRequest;
import com.clouddrive.dto.ResendOtpRequest;

public interface AuthService {
    MessageResponse register(RegisterRequest request);
    AuthResponse verifySignupOtp(VerifyOtpRequest request);
    
    MessageResponse login(LoginRequest request);
    AuthResponse verifyLoginOtp(VerifyOtpRequest request);
    
    MessageResponse resendOtp(ResendOtpRequest request);
}
