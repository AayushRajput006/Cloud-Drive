import api from "./api";
import { validationService } from "./validationService";

export const authService = {
  // Login user with enhanced security
  login: async (email, password) => {
    // Input validation
    if (!validationService.isValidEmail(email)) {
      throw { message: "Invalid email format" };
    }
    
    if (password.length === 0) {
      throw { message: "Password is required" };
    }

    try {
      const response = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
        rememberMe: false // Add remember me functionality
      });
      
      const { token, user } = response.data;
      
      // Store token securely
      authService.setToken(token);
      authService.setUserData(user);
      
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw { message: "Invalid email or password" };
      } else if (error.response?.status === 429) {
        throw { message: "Too many login attempts. Please try again later." };
      } else if (error.response?.status === 403) {
        throw { message: "Account is locked. Please contact support." };
      }
      
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Register new user with validation
  register: async (name, email, password) => {
    // Input validation
    if (!name || name.trim().length < 2) {
      throw { message: "Name must be at least 2 characters" };
    }
    
    if (!validationService.isValidEmail(email)) {
      throw { message: "Invalid email format" };
    }
    
    const passwordValidation = validationService.isValidPassword(password);
    if (!passwordValidation.isValid) {
      throw { 
        message: Object.values(passwordValidation.errors).filter(Boolean).join(', ') 
      };
    }

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });
      
      const { token, user } = response.data;
      
      // Store token securely
      authService.setToken(token);
      authService.setUserData(user);
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw { message: "Email already registered" };
      }
      
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Logout with cleanup
  logout: () => {
    try {
      // Call logout endpoint to invalidate server session
      api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local storage
      authService.removeToken();
      authService.removeUserData();
      authService.clearSessionData();
    }
  },

  // Store token securely
  setToken: (token) => {
    if (!token || typeof token !== 'string') {
      console.error("Invalid token provided");
      return;
    }
    
    try {
      localStorage.setItem("clouddrive_token", token);
      
      // Set token expiration (if JWT contains exp claim)
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        localStorage.setItem("clouddrive_token_expires", expirationTime);
      }
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  },

  // Get token from localStorage with validation
  getToken: () => {
    try {
      const token = localStorage.getItem("clouddrive_token");
      
      if (!token) return null;
      
      // Check token expiration
      const expirationTime = localStorage.getItem("clouddrive_token_expires");
      if (expirationTime && Date.now() > parseInt(expirationTime)) {
        authService.removeToken();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  },

  // Remove token and related data
  removeToken: () => {
    localStorage.removeItem("clouddrive_token");
    localStorage.removeItem("clouddrive_token_expires");
  },

  // Check if user is authenticated with token validation
  isAuthenticated: () => {
    const token = authService.getToken();
    return token !== null;
  },

  // Get user info from token with enhanced parsing
  getUserFromToken: () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Validate required fields
      if (!payload.userId && !payload.sub) {
        console.error("Token missing user ID");
        return null;
      }
      
      return {
        userId: payload.userId || payload.sub,
        firstName: payload.firstName || payload.given_name,
        lastName: payload.lastName || payload.family_name,
        name: payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
        email: payload.email || payload.sub,
        role: payload.role || 'user',
        permissions: payload.permissions || [],
        iat: payload.iat, // Issued at
        exp: payload.exp  // Expires at
      };
    } catch (error) {
      console.error("Failed to parse token:", error);
      authService.removeToken(); // Remove invalid token
      return null;
    }
  },

  // Store user data securely
  setUserData: (userData) => {
    if (!userData) return;
    
    try {
      localStorage.setItem("clouddrive_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  },

  // Get user data from localStorage
  getUserData: () => {
    try {
      const userData = localStorage.getItem("clouddrive_user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to get user data:", error);
      return null;
    }
  },

  // Remove user data
  removeUserData: () => {
    localStorage.removeItem("clouddrive_user");
  },

  // Clear all session data
  clearSessionData: () => {
    // Clear all app-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('clouddrive_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expirationTime = localStorage.getItem("clouddrive_token_expires");
    return expirationTime ? Date.now() > parseInt(expirationTime) : false;
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      const { token } = response.data;
      authService.setToken(token);
      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      authService.logout();
      throw error;
    }
  },

  // Change password with validation
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    if (!currentPassword || currentPassword.length === 0) {
      throw { message: "Current password is required" };
    }
    
    const passwordValidation = validationService.isValidPassword(newPassword);
    if (!passwordValidation.isValid) {
      throw { 
        message: Object.values(passwordValidation.errors).filter(Boolean).join(', ') 
      };
    }
    
    if (newPassword !== confirmPassword) {
      throw { message: "New passwords do not match" };
    }

    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw { message: "Current password is incorrect" };
      }
      
      throw error.response?.data || { message: "Password change failed" };
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    if (!validationService.isValidEmail(email)) {
      throw { message: "Invalid email format" };
    }

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.toLowerCase().trim()
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw { message: "Email not found" };
      }
      
      throw error.response?.data || { message: "Password reset request failed" };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword, confirmPassword) => {
    if (!token || token.length === 0) {
      throw { message: "Reset token is required" };
    }
    
    const passwordValidation = validationService.isValidPassword(newPassword);
    if (!passwordValidation.isValid) {
      throw { 
        message: Object.values(passwordValidation.errors).filter(Boolean).join(', ') 
      };
    }
    
    if (newPassword !== confirmPassword) {
      throw { message: "Passwords do not match" };
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw { message: "Invalid or expired reset token" };
      }
      
      throw error.response?.data || { message: "Password reset failed" };
    }
  }
};
