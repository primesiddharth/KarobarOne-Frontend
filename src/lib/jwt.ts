// src/lib/jwt.ts

// Decodes a JWT payload client-side (no signature verification — just reads claims).
// Returns null if the token is missing/malformed.
export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string | null
): T | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

// Most backends encode the user id as "sub" or "userId" — try both.
export function getUserIdFromToken(token: string | null): string {
  const payload = decodeJwtPayload<{ sub?: string; userId?: string }>(token);
  return payload?.userId || payload?.sub || "";
}