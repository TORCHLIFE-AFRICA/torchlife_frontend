"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthContextType, AuthFormData, User, UserRole } from "@/src/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_STORAGE_KEY = "torchlife_auth_users";
const SESSION_STORAGE_KEY = "torchlife_auth_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  password: string;
};

type StoredSession = {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
};

const getStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

const readUsers = (): StoredUser[] => {
  const storage = getStorage();
  if (!storage) return [];
  const value = storage.getItem(USERS_STORAGE_KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const readSession = (): StoredSession | null => {
  const storage = getStorage();
  if (!storage) return null;
  const value = storage.getItem(SESSION_STORAGE_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as StoredSession;
    if (!parsed?.userId || !parsed?.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeSession = (session: StoredSession) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  storage.setItem("auth_token", session.token);
  storage.setItem("refresh_token", session.refreshToken);
};

const clearSession = () => {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(SESSION_STORAGE_KEY);
  storage.removeItem("auth_token");
  storage.removeItem("refresh_token");
};

const toUser = (storedUser: StoredUser): User => ({
  id: storedUser.id,
  email: storedUser.email,
  name: storedUser.name,
  role: storedUser.role,
  avatar: storedUser.avatar,
  isVerified: storedUser.isVerified,
  createdAt: new Date(storedUser.createdAt),
  updatedAt: new Date(storedUser.updatedAt),
});

const nowIso = () => new Date().toISOString();
const safeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `usr_${Date.now()}`;

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
    const session = readSession();
    if (!session || session.expiresAt <= Date.now()) {
      clearSession();
      setUser(null);
      setIsLoading(false);
      return;
    }

    const currentUser = readUsers().find((candidate) => candidate.id === session.userId);
    if (!currentUser) {
      clearSession();
      setUser(null);
      setIsLoading(false);
      return;
    }

    setUser(toUser(currentUser));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const match = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === password
    );

    if (!match) {
      throw new Error("Invalid email or password.");
    }

    const session: StoredSession = {
      userId: match.id,
      token: `local_token_${match.id}`,
      refreshToken: `local_refresh_${match.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    writeSession(session);
    setUser(toUser(match));
  };

  const register = async (data: AuthFormData): Promise<void> => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const users = readUsers();
    const exists = users.some(
      (candidate) => candidate.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    if (!data.password || data.password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const createdUser: StoredUser = {
      id: safeId(),
      email: normalizedEmail,
      name: data.name?.trim() || "TorchLife User",
      role: UserRole.BACKER,
      isVerified: true,
      avatar: undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      password: data.password,
    };

    const nextUsers = [...users, createdUser];
    writeUsers(nextUsers);
  };

  const logout = (): void => {
    clearSession();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error("You must be logged in to update profile.");
    }

    const users = readUsers();
    const index = users.findIndex((candidate) => candidate.id === user.id);
    if (index === -1) {
      throw new Error("User session is invalid. Please sign in again.");
    }

    const current = users[index];
    const updated: StoredUser = {
      ...current,
      name: data.name ?? current.name,
      email: data.email?.toLowerCase() ?? current.email,
      avatar: data.avatar ?? current.avatar,
      updatedAt: nowIso(),
    };
    users[index] = updated;
    writeUsers(users);
    setUser(toUser(updated));
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
