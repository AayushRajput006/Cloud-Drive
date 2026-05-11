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

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Attempting login...');
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response);
      
      // Store token - handle both 'token' and 'accessToken' formats
      const token = response.token || response.accessToken;
      if (!token) {
        throw new Error('No token in login response');
      }
      
      authService.setToken(token);
      console.log('AuthContext: Token stored successfully');
      
      // Set user data
      const userData = {
        userId: response.user?.id || response.userId,
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
      };
      console.log('AuthContext: Setting user data:', userData);
      setUser(userData);
      
      // Also store user data in localStorage as fallback
      authService.setUserData(userData);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(name, email, password);
      
      // Store token - handle both 'token' and 'accessToken' formats
      const token = response.token || response.accessToken;
      if (!token) {
        throw new Error('No token in register response');
      }
      
      authService.setToken(token);
      
      // Set user data
      const userData = {
        userId: response.user?.id || response.userId,
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
      };
      setUser(userData);
      
      // Also store user data in localStorage as fallback
      authService.setUserData(userData);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
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
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
