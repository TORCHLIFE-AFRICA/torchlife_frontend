"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, AuthContextType, AuthFormData } from "@/types";
import { authApi } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          apiClient.setToken(token);
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        apiClient.setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login(email, password);

      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("refresh_token", response.refreshToken);
      apiClient.setToken(response.token);

      setUser(response.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (data: AuthFormData): Promise<void> => {
    try {
      const response = await authApi.register(data);

      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("refresh_token", response.refreshToken);
      apiClient.setToken(response.token);

      setUser(response.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = (): void => {
    try {
      authApi.logout().catch(console.error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      apiClient.setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};