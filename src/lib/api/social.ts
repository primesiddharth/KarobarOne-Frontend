import { apiClient } from "@/lib/api-client";

import type {
  SocialLinkCreate,
  SocialLinkUpdate,
  SocialLinkResponse,
  SocialPlatformCreate,
  SocialPlatformUpdate,
  SocialPlatformResponse,
} from "@/types/social";

// ============================================================
// SOCIAL LINKS
// ============================================================

/**
 * POST /api/v1/social-links/
 */
export async function createSocialLink(
  data: SocialLinkCreate,
  token?: string
): Promise<SocialLinkResponse> {
  return apiClient<SocialLinkResponse>(
    "/api/v1/social-links/",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/social-links/
 *
 * Optional storeId query parameter.
 */
export async function listSocialLinks(
  storeId?: string,
  token?: string
): Promise<SocialLinkResponse[]> {
  const params = new URLSearchParams();

  if (storeId) {
    params.set("storeId", storeId);
  }

  const query = params.toString();

  return apiClient<SocialLinkResponse[]>(
    `/api/v1/social-links/${query ? `?${query}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * GET /api/v1/social-links/{socialLinkId}
 */
export async function getSocialLink(
  socialLinkId: string,
  token?: string
): Promise<SocialLinkResponse> {
  return apiClient<SocialLinkResponse>(
    `/api/v1/social-links/${socialLinkId}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * PATCH /api/v1/social-links/{socialLinkId}
 */
export async function updateSocialLink(
  socialLinkId: string,
  data: SocialLinkUpdate,
  token?: string
): Promise<SocialLinkResponse> {
  return apiClient<SocialLinkResponse>(
    `/api/v1/social-links/${socialLinkId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * DELETE /api/v1/social-links/{socialLinkId}
 *
 * Returns 204 No Content.
 */
export async function deleteSocialLink(
  socialLinkId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/social-links/${socialLinkId}`,
    {
      method: "DELETE",
      token,
    }
  );
}


// ============================================================
// SOCIAL PLATFORMS
// ============================================================

/**
 * POST /api/v1/social-platforms/
 */
export async function createSocialPlatform(
  data: SocialPlatformCreate,
  token?: string
): Promise<SocialPlatformResponse> {
  return apiClient<SocialPlatformResponse>(
    "/api/v1/social-platforms/",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/social-platforms/
 *
 * Optional activeOnly query parameter.
 */
export async function listSocialPlatforms(
  activeOnly = false,
  token?: string
): Promise<SocialPlatformResponse[]> {
  return apiClient<SocialPlatformResponse[]>(
    `/api/v1/social-platforms/?activeOnly=${activeOnly}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * GET /api/v1/social-platforms/{platformId}
 */
export async function getSocialPlatform(
  platformId: string,
  token?: string
): Promise<SocialPlatformResponse> {
  return apiClient<SocialPlatformResponse>(
    `/api/v1/social-platforms/${platformId}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * PATCH /api/v1/social-platforms/{platformId}
 */
export async function updateSocialPlatform(
  platformId: string,
  data: SocialPlatformUpdate,
  token?: string
): Promise<SocialPlatformResponse> {
  return apiClient<SocialPlatformResponse>(
    `/api/v1/social-platforms/${platformId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * DELETE /api/v1/social-platforms/{platformId}
 *
 * Returns 204 No Content.
 */
export async function deleteSocialPlatform(
  platformId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/social-platforms/${platformId}`,
    {
      method: "DELETE",
      token,
    }
  );
}