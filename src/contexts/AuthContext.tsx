"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { AuthContextType, AuthFormData, User } from "@/src/types";
import { authApi } from "@/src/lib/api/auth";

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
  const lastSessionValidationAtRef = useRef(0);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const me = await authApi.getCurrentUser();
        setUser(me);
      } catch {
        try {
          await authApi.refresh();
          const me = await authApi.getCurrentUser();
          setUser(me);
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("torchlife:session-expired", handleSessionExpired);
    return () => window.removeEventListener("torchlife:session-expired", handleSessionExpired);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const validateSessionSilently = async () => {
      if (!user || isLoading || document.visibilityState !== "visible") {
        return;
      }

      const now = Date.now();
      if (now - lastSessionValidationAtRef.current < 60_000) {
        return;
      }

      lastSessionValidationAtRef.current = now;

      try {
        const me = await authApi.getCurrentUser();
        setUser((currentUser) => {
          if (!currentUser) {
            return me;
          }

          const sameIdentity =
            currentUser.id === me.id &&
            currentUser.email === me.email &&
            currentUser.role === me.role &&
            currentUser.isVerified === me.isVerified;

          return sameIdentity ? currentUser : me;
        });
      } catch {
        // The API client handles session expiry with a toast, auth clear, and redirect.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void validateSessionSilently();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isLoading, user]);

  const login = async (emailOrPhone: string, password: string): Promise<User> => {
    const normalizedIdentifier = emailOrPhone.trim().toLowerCase();
    await authApi.signIn(normalizedIdentifier, password);
    const me = await authApi.getCurrentUser();
    setUser(me);
    return me;
  };

  const loginWithGoogle = async (credential: string): Promise<User> => {
    await authApi.signInWithGoogle(credential);
    const me = await authApi.getCurrentUser();
    setUser(me);
    return me;
  };

  const register = async (data: AuthFormData): Promise<User> => {
    const normalized: AuthFormData = { ...data, email: data.email.trim().toLowerCase() };
    await authApi.signUp(normalized);
    const me = await authApi.getCurrentUser();
    setUser(me);
    return me;
  };

  const refreshMe = async (): Promise<User> => {
    const me = await authApi.getCurrentUser();
    setUser(me);
    return me;
  };

  const logout = async (): Promise<void> => {
    await authApi.logout().catch(() => undefined);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    refreshMe,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
