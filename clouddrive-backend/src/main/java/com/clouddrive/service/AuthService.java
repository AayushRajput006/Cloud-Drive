package com.clouddrive.service;

import com.clouddrive.dto.AuthResponse;
import com.clouddrive.dto.LoginRequest;
import com.clouddrive.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
