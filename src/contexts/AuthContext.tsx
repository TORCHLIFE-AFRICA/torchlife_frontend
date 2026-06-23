"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { AuthContextType, AuthFormData, User } from "@/src/types";
import { authApi } from "@/src/lib/api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// #region debug-point A:staging-auth-report
const reportStagingAuthDebug = async (
  event: string,
  hypothesisId: "A" | "B" | "C" | "D" | "E",
  data: Record<string, unknown> = {}
) => {
  try {
    await fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "staging-auth-session",
        runId: "pre-fix",
        hypothesisId,
        location: "src/contexts/AuthContext.tsx",
        msg: `[DEBUG] ${event}`,
        data,
        ts: Date.now(),
      }),
      keepalive: true,
    });
  } catch {
    // Debug transport is best-effort only.
  }
};
// #endregion

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
      void reportStagingAuthDebug("auth_bootstrap_started", "B", {
        hasDocument: typeof document !== "undefined",
        visibilityState: typeof document !== "undefined" ? document.visibilityState : null,
      });
      try {
        const me = await authApi.getCurrentUser();
        void reportStagingAuthDebug("auth_bootstrap_me_success", "B", {
          userId: me.id,
          email: me.email,
          isVerified: me.isVerified,
        });
        setUser(me);
      } catch {
        void reportStagingAuthDebug("auth_bootstrap_me_failed", "B");
        try {
          await authApi.refresh();
          void reportStagingAuthDebug("auth_bootstrap_refresh_success", "B");
          const me = await authApi.getCurrentUser();
          void reportStagingAuthDebug("auth_bootstrap_refresh_me_success", "B", {
            userId: me.id,
            email: me.email,
            isVerified: me.isVerified,
          });
          setUser(me);
        } catch {
          void reportStagingAuthDebug("auth_bootstrap_refresh_failed", "A");
          setUser(null);
        }
      } finally {
        void reportStagingAuthDebug("auth_bootstrap_finished", "B", {
          userResolved: !!user,
        });
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      void reportStagingAuthDebug("auth_session_expired_event", "E");
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
        void reportStagingAuthDebug("auth_visibility_me_success", "E", {
          userId: me.id,
          email: me.email,
          isVerified: me.isVerified,
        });
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
        void reportStagingAuthDebug("auth_visibility_me_failed", "E");
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
    void reportStagingAuthDebug("auth_login_started", "C", {
      identifier: normalizedIdentifier,
      passwordLength: password.length,
    });
    await authApi.signIn(normalizedIdentifier, password);
    void reportStagingAuthDebug("auth_login_signin_success", "C", {
      identifier: normalizedIdentifier,
    });
    const me = await authApi.getCurrentUser();
    void reportStagingAuthDebug("auth_login_me_success", "A", {
      userId: me.id,
      email: me.email,
      isVerified: me.isVerified,
    });
    setUser(me);
    return me;
  };

  const loginWithGoogle = async (credential: string): Promise<User> => {
    void reportStagingAuthDebug("auth_google_login_started", "C", {
      credentialLength: credential.length,
    });
    await authApi.signInWithGoogle(credential);
    void reportStagingAuthDebug("auth_google_signin_success", "C");
    const me = await authApi.getCurrentUser();
    void reportStagingAuthDebug("auth_google_me_success", "A", {
      userId: me.id,
      email: me.email,
      isVerified: me.isVerified,
    });
    setUser(me);
    return me;
  };

  const register = async (data: AuthFormData): Promise<User> => {
    const normalized: AuthFormData = { ...data, email: data.email.trim().toLowerCase() };
    void reportStagingAuthDebug("auth_register_started", "D", {
      email: normalized.email,
      hasPhoneNumber: !!normalized.phoneNumber,
    });
    await authApi.signUp(normalized);
    void reportStagingAuthDebug("auth_register_signup_success", "D", {
      email: normalized.email,
    });
    const me = await authApi.getCurrentUser();
    void reportStagingAuthDebug("auth_register_me_success", "A", {
      userId: me.id,
      email: me.email,
      isVerified: me.isVerified,
    });
    setUser(me);
    return me;
  };

  const refreshMe = async (): Promise<User> => {
    void reportStagingAuthDebug("auth_refresh_me_started", "E");
    const me = await authApi.getCurrentUser();
    void reportStagingAuthDebug("auth_refresh_me_success", "E", {
      userId: me.id,
      email: me.email,
      isVerified: me.isVerified,
    });
    setUser(me);
    return me;
  };

  const logout = async (): Promise<void> => {
    void reportStagingAuthDebug("auth_logout_started", "E");
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
