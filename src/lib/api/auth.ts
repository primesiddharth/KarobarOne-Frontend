// src/lib/api/auth.ts
import { apiClient } from "../api-client";
import {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient<AuthTokenResponse>("/api/v1/chat-auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: LoginPayload) =>
    apiClient<AuthTokenResponse>("/api/v1/chat-auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
