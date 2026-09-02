// src/lib/api/auth.ts
import { apiClient } from "../api-client";
import {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
  OtpPendingResponse,
  OtpConfirmPayload,
} from "@/types/auth";

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient<OtpPendingResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  registerVerify: (data: OtpConfirmPayload) =>
    apiClient<AuthTokenResponse>("/api/v1/auth/register/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: LoginPayload) =>
    apiClient<OtpPendingResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  loginVerify: (data: OtpConfirmPayload) =>
    apiClient<AuthTokenResponse>("/api/v1/auth/login/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};