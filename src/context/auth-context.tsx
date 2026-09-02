// src/context/auth-context.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "@/lib/api/auth";
import {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
  OtpPendingResponse,
} from "@/types/auth";

interface AuthContextValue {
  token: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  isLoading: boolean;

  // Step 1: submit credentials, get back an otpId (no session yet)
  login: (data: LoginPayload) => Promise<OtpPendingResponse>;
  register: (data: RegisterPayload) => Promise<OtpPendingResponse>;

  // Step 2: submit the emailed code, this actually logs the user in
  verifyLogin: (otpId: string, code: string) => Promise<void>;
  verifyRegister: (otpId: string, code: string) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "karobar_access_token";
const REFRESH_TOKEN_KEY = "karobar_refresh_token";
const TOKEN_TYPE_KEY = "karobar_token_type";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedTokenType = localStorage.getItem(TOKEN_TYPE_KEY);

    if (storedToken) setToken(storedToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    if (storedTokenType) setTokenType(storedTokenType);

    setIsLoading(false);
  }, []);

  function persistSession(data: AuthTokenResponse) {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(TOKEN_TYPE_KEY, data.tokenType || "bearer");
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setTokenType(data.tokenType || "bearer");
  }

  // Step 1 — just forwards to backend, returns the otpId for the UI to use
  async function login(data: LoginPayload) {
    return authApi.login(data);
  }

  async function register(data: RegisterPayload) {
    return authApi.register(data);
  }

  // Step 2 — verifies the code and actually establishes the session
  async function verifyLogin(otpId: string, code: string) {
    const result = await authApi.loginVerify({ otpId, code });
    persistSession(result);
  }

  async function verifyRegister(otpId: string, code: string) {
    const result = await authApi.registerVerify({ otpId, code });
    persistSession(result);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    setToken(null);
    setRefreshToken(null);
    setTokenType(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        tokenType,
        isLoading,
        login,
        register,
        verifyLogin,
        verifyRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}