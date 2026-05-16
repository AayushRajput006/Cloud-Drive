import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        console.log('AuthContext: Initializing authentication...');
        const token = authService.getToken();
        console.log('AuthContext: Token exists:', !!token);
        
        if (token) {
          console.log('AuthContext: Token found, parsing user data...');
          const userData = authService.getUserFromToken();
          console.log('AuthContext: User data from token:', userData);
          
          if (userData) {
            setUser({
              userId: userData.userId,
              name: userData.name,
              email: userData.email,
            });
          } else {
            console.warn('AuthContext: Failed to parse user data from token, trying stored user data...');
            const storedUserData = authService.getUserData();
            console.log('AuthContext: Stored user data:', storedUserData);
            
            if (storedUserData) {
              setUser({
                userId: storedUserData.id || storedUserData.userId,
                name: storedUserData.name || storedUserData.firstName,
                email: storedUserData.email,
              });
            } else {
              console.warn('AuthContext: No user data available, removing token');
              authService.removeToken();
            }
          }
        } else {
          console.log('AuthContext: No token found');
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        authService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function - step 1
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      return response; // Just return response to proceed to OTP
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Login OTP - step 2
  const verifyLoginOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.verifyLoginOtp(email, otp);
      
      const userData = {
        userId: response.userId,
        name: response.name,
        email: response.email,
      };
      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.message || "OTP Verification failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function - step 1
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(name, email, password);
      return response; // Just return response to proceed to OTP
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Signup OTP - step 2 (just confirms account, redirects to login)
  const verifySignupOtp = async (email, otp) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.verifySignupOtp(email, otp);
      // Don't store token or set user - user will log in fresh
      return response;
    } catch (err) {
      const errorMessage = err.message || "OTP Verification failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.removeToken();
    setUser(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    verifyLoginOtp,
    register,
    verifySignupOtp,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
