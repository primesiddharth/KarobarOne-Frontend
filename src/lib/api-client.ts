// src/lib/api-client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  if (!BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured in .env.local"
    );
  }

  const { token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    let message = `API Error: ${res.status}`;

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((error: { msg?: string }) => error.msg || "Validation error")
        .join(", ");
    } else if (typeof data?.error?.message === "string") {
      message = data.error.message;
    } else if (typeof data?.message === "string") {
      message = data.message;
    }

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}