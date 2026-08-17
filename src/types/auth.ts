// src/types/auth.ts

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  whatsappMobile?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}