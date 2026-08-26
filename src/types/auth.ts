// src/types/auth.ts
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  storeId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  userId: string;
  role: string;
  storeId?: string | null;
}
