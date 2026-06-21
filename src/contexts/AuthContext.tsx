"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType, AuthFormData, User } from "@/src/types";
import { authApi } from "@/src/lib/api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// #region debug-point login-invalid-credentials-auth-context-report
async function reportLoginDebug(event: string, payload: Record<string, unknown> = {}) {
  try {
    await fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "login-invalid-credentials",
        source: "frontend-auth-context",
        event,
        hypothesisId: payload.hypothesisId ?? null,
        runId: "pre",
        ts: new Date().toISOString(),
        payload,
      }),
      keepalive: true,
    });
  } catch {
    // Intentionally ignore debug transport failures.
  }
}
// #endregion debug-point login-invalid-credentials-auth-context-report

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

  const login = async (emailOrPhone: string, password: string): Promise<User> => {
    const normalizedIdentifier = emailOrPhone.trim().toLowerCase();
    void reportLoginDebug("auth_context_login_start", {
      hypothesisId: "C",
      rawIdentifier: emailOrPhone,
      normalizedIdentifier,
      passwordLength: password.length,
    });
    await authApi.signIn(normalizedIdentifier, password);
    void reportLoginDebug("auth_context_login_signin_success", {
      hypothesisId: "E",
      normalizedIdentifier,
    });
    const me = await authApi.getCurrentUser();
    void reportLoginDebug("auth_context_login_me_success", {
      hypothesisId: "E",
      userId: me.id,
      email: me.email,
      isVerified: me.isVerified,
    });
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
