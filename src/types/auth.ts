// src/types/auth.ts

export interface RegisterPayload {
  firstName: string;
  lastName?: string | null;
  email: string;
  mobile: string;
  whatsappMobile?: string | null;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Returned by both /auth/register and /auth/login — no token yet, an OTP was sent
export interface OtpPendingResponse {
  userId: string;
  otpId: string;
  message: string;
}

export interface OtpConfirmPayload {
  otpId: string;
  code: string;
}

// Returned by /auth/register/verify and /auth/login/verify — the actual login
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}