import { createContext, useContext, useEffect, useState } from "react";
import { api, clearAuth, setAuth } from "@/lib/api";

type Role = "admin" | "staff" | "member";
export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  nationalId?: string;
  isVerified?: boolean;
  placeOfBirth?: string;
  kraPin?: string;
  idPhotoUrl?: string;
  referralCode?: string;
  membershipNumber?: string;
  createdAt?: string;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  sendOtp: (phoneNumber: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const t = localStorage.getItem("auth_token");
      const u = localStorage.getItem("auth_user");

      console.log("🔍 AuthContext - Loading from localStorage:", {
        hasToken: !!t,
        hasUser: !!u,
        token: t ? `${t.substring(0, 20)}...` : "No token",
        user: u ? JSON.parse(u) : "No user"
      });

      if (t && u) {
        try {
          // Validate token with server
          const userData = JSON.parse(u);
          console.log("🔍 AuthContext - Validating token with server...");

          // Try to get user profile to validate token
          const response = await api("/auth/profile", { method: "GET" });

          if (response.success && response.user) {
            console.log("✅ AuthContext - Token valid, user authenticated");
            console.log("🔍 AuthContext - User role:", response.user.role);
            console.log("🔍 AuthContext - User data:", response.user);
            setToken(t);
            setUser(response.user); // Use fresh user data from server
          } else {
            console.log("❌ AuthContext - Token invalid, clearing auth");
            clearAuth();
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.log("❌ AuthContext - Token validation failed:", error);
          clearAuth();
          setToken(null);
          setUser(null);
        }
      } else {
        console.log("🔍 AuthContext - No token or user data, setting defaults");
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    await api("/auth/send-otp", {
      method: "POST",
      body: { phone: phoneNumber }
    });
  };

  const login = async (phoneNumber: string, otp: string) => {
    const response = await api<{ verified: boolean; user: User; token: string }>(
      "/auth/verify-otp",
      { method: "POST", body: { phone: phoneNumber, otp } }
    );

    if (!response.verified) {
      throw new Error('OTP verification failed');
    }

    // Ensure user has a role (default to 'member' if not set)
    const userWithRole = {
      ...response.user,
      role: response.user.role || 'member'
    };

    console.log("🔍 AuthContext - OTP Login successful, user role:", userWithRole.role);
    console.log("🔍 AuthContext - Full user data:", userWithRole);

    setAuth(response.token, userWithRole);
    setUser(userWithRole);
    setToken(response.token);
  };

  const loginWithEmail = async (email: string, password: string) => {
    const response = await api<{ success: boolean; user: User; token: string }>(
      "/auth/login",
      { method: "POST", body: { email, password } }
    );

    if (!response.success) {
      throw new Error('Login failed');
    }

    // Ensure user has a role (default to 'member' if not set)
    const userWithRole = {
      ...response.user,
      role: response.user.role || 'member'
    };

    console.log("🔍 AuthContext - Email Login successful, user role:", userWithRole.role);
    console.log("🔍 AuthContext - Full user data:", userWithRole);

    setAuth(response.token, userWithRole);
    setUser(userWithRole);
    setToken(response.token);
  };


  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token && !!user.id;

  return (
    <Ctx.Provider value={{
      user,
      token,
      login,
      loginWithEmail,
      sendOtp,
      logout,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
