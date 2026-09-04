// ============================================================
// WEBSITE MODULE API
// ============================================================
// Only these modules are included:
//
// 1. Admin Websites          - 5
// 2. Websites                - 5
// 3. SEO Metadata            - 11
// 4. Website AI Content      - 4
// 5. Website AI Generation   - 1
// 6. Blog Writer AI Agent    - 1
// 7. Public Website          - 2
//
// TOTAL = 29 ENDPOINTS
// ============================================================

import { apiClient } from "@/lib/api-client";

import type {
  AiSeoSuggestionRequest,
  AiSeoSuggestionResponse,
  BlogGenerationRequest,
  KeywordDensityRequest,
  KeywordDensityResponse,
  ListSeoMetadataParams,
  SeoAuditRequest,
  SeoAuditResponse,
  SeoMetadataCreate,
  SeoMetadataResponse,
  SeoMetadataUpdate,
  SeoScoreRequest,
  SeoScoreResponse,
  UUID,
  WebsiteAIContentCreate,
  WebsiteAIContentResponse,
  WebsiteAIContentUpdate,
  WebsiteAIGenerateRequest,
  WebsiteCreate,
  WebsitePreviewResponse,
  WebsiteResponse,
  WebsiteStatusRequest,
  WebsiteSubmitRequest,
  WebsiteUpdate,
} from "@/types/websites";


// ============================================================
// 1. WEBSITES
// ============================================================

/**
 * POST /api/v1/websites/create
 *
 * Create website.
 */
export async function createWebsite(
  data: WebsiteCreate,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/websites/create",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * PUT /api/v1/websites/update?websiteId={websiteId}
 *
 * Update website.
 *
 * IMPORTANT:
 * websiteId is a QUERY PARAMETER.
 */
export async function updateWebsite(
  websiteId: UUID,
  data: WebsiteUpdate,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    `/api/v1/websites/update?websiteId=${encodeURIComponent(websiteId)}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * GET /api/v1/websites/{websiteId}
 *
 * Get website by ID.
 */
export async function getWebsite(
  websiteId: UUID,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    `/api/v1/websites/${websiteId}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * POST /api/v1/websites/submit
 *
 * Submit website.
 */
export async function submitWebsite(
  data: WebsiteSubmitRequest,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/websites/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * GET /api/v1/websites/preview/{slug}
 *
 * Preview website by slug.
 */
export async function previewWebsite(
  slug: string,
  token?: string
): Promise<WebsitePreviewResponse> {
  return apiClient<WebsitePreviewResponse>(
    `/api/v1/websites/preview/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      token,
    }
  );
}


// ============================================================
// 2. ADMIN WEBSITES
// ============================================================

/**
 * GET /api/v1/admin/websites/pending
 *
 * Get websites waiting for approval.
 */
export async function getPendingWebsites(
  token?: string
): Promise<WebsiteResponse[]> {
  return apiClient<WebsiteResponse[]>(
    "/api/v1/admin/websites/pending",
    {
      method: "GET",
      token,
    }
  );
}


/**
 * GET /api/v1/admin/websites/{websiteId}
 *
 * Get website from admin portal.
 */
export async function getAdminWebsite(
  websiteId: UUID,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    `/api/v1/admin/websites/${websiteId}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * POST /api/v1/admin/websites/approve
 *
 * Approve website.
 */
export async function approveWebsite(
  data: WebsiteStatusRequest,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/admin/websites/approve",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * POST /api/v1/admin/websites/reject
 *
 * Reject website.
 */
export async function rejectWebsite(
  data: WebsiteStatusRequest,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/admin/websites/reject",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * POST /api/v1/admin/websites/publish
 *
 * Publish website.
 */
export async function publishWebsite(
  data: WebsiteStatusRequest,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/admin/websites/publish",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// 3. SEO METADATA
// ============================================================

/**
 * POST /api/v1/seo-metadata/
 *
 * Create SEO metadata.
 */
export async function createSeoMetadata(
  data: SeoMetadataCreate,
  token?: string
): Promise<SeoMetadataResponse> {
  return apiClient<SeoMetadataResponse>(
    "/api/v1/seo-metadata/",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * GET /api/v1/seo-metadata/
 *
 * List SEO metadata.
 */
export async function listSeoMetadata(
  params: ListSeoMetadataParams = {},
  token?: string
): Promise<SeoMetadataResponse[]> {
  const searchParams = new URLSearchParams();

  if (params.tenantId) {
    searchParams.set("tenantId", params.tenantId);
  }

  const query = searchParams.toString();

  return apiClient<SeoMetadataResponse[]>(
    `/api/v1/seo-metadata/${query ? `?${query}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * GET /api/v1/seo-metadata/{seoId}
 *
 * Get SEO metadata.
 */
export async function getSeoMetadata(
  seoId: UUID,
  token?: string
): Promise<SeoMetadataResponse> {
  return apiClient<SeoMetadataResponse>(
    `/api/v1/seo-metadata/${seoId}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * PATCH /api/v1/seo-metadata/{seoId}
 *
 * Update SEO metadata.
 */
export async function updateSeoMetadata(
  seoId: UUID,
  data: SeoMetadataUpdate,
  token?: string
): Promise<SeoMetadataResponse> {
  return apiClient<SeoMetadataResponse>(
    `/api/v1/seo-metadata/${seoId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * DELETE /api/v1/seo-metadata/{seoId}
 *
 * Delete SEO metadata.
 */
export async function deleteSeoMetadata(
  seoId: UUID,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/seo-metadata/${seoId}`,
    {
      method: "DELETE",
      token,
    }
  );
}


/**
 * GET /api/v1/seo-metadata/entity/{entityType}/{entityId}
 *
 * Get SEO metadata by entity.
 */
export async function getSeoMetadataByEntity(
  entityType: string,
  entityId: UUID,
  token?: string
): Promise<SeoMetadataResponse> {
  return apiClient<SeoMetadataResponse>(
    `/api/v1/seo-metadata/entity/${encodeURIComponent(
      entityType
    )}/${entityId}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * GET /api/v1/seo-metadata/slug/{entityType}/{slug}
 *
 * Get SEO metadata by slug.
 */
export async function getSeoMetadataBySlug(
  entityType: string,
  slug: string,
  token?: string
): Promise<SeoMetadataResponse> {
  return apiClient<SeoMetadataResponse>(
    `/api/v1/seo-metadata/slug/${encodeURIComponent(
      entityType
    )}/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * POST /api/v1/seo-metadata/score
 *
 * Calculate SEO score.
 */
export async function calculateSeoScore(
  data: SeoScoreRequest,
  token?: string
): Promise<SeoScoreResponse> {
  return apiClient<SeoScoreResponse>(
    "/api/v1/seo-metadata/score",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * POST /api/v1/seo-metadata/ai-suggestions
 *
 * Generate AI SEO suggestions.
 */
export async function generateAiSeoSuggestions(
  data: AiSeoSuggestionRequest,
  token?: string
): Promise<AiSeoSuggestionResponse> {
  return apiClient<AiSeoSuggestionResponse>(
    "/api/v1/seo-metadata/ai-suggestions",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * POST /api/v1/seo-metadata/audit
 *
 * Run SEO audit.
 */
export async function auditSeo(
  data: SeoAuditRequest,
  token?: string
): Promise<SeoAuditResponse> {
  return apiClient<SeoAuditResponse>(
    "/api/v1/seo-metadata/audit",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * POST /api/v1/seo-metadata/keyword-density
 *
 * Calculate keyword density.
 */
export async function calculateKeywordDensity(
  data: KeywordDensityRequest,
  token?: string
): Promise<KeywordDensityResponse> {
  return apiClient<KeywordDensityResponse>(
    "/api/v1/seo-metadata/keyword-density",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// 4. WEBSITE AI CONTENT
// ============================================================

/**
 * POST /api/v1/website-ai-content/
 *
 * Create AI-generated website content record.
 */
export async function createWebsiteAIContent(
  data: WebsiteAIContentCreate,
  token?: string
): Promise<WebsiteAIContentResponse> {
  return apiClient<WebsiteAIContentResponse>(
    "/api/v1/website-ai-content/",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * GET /api/v1/website-ai-content/{contentId}
 *
 * Get AI content by ID.
 */
export async function getWebsiteAIContent(
  contentId: UUID,
  token?: string
): Promise<WebsiteAIContentResponse> {
  return apiClient<WebsiteAIContentResponse>(
    `/api/v1/website-ai-content/${contentId}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * PATCH /api/v1/website-ai-content/{contentId}
 *
 * Update AI content.
 */
export async function updateWebsiteAIContent(
  contentId: UUID,
  data: WebsiteAIContentUpdate,
  token?: string
): Promise<WebsiteAIContentResponse> {
  return apiClient<WebsiteAIContentResponse>(
    `/api/v1/website-ai-content/${contentId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}


/**
 * GET /api/v1/website-ai-content/store/{storeId}
 *
 * List AI content for a store.
 */
export async function listWebsiteAIContent(
  storeId: UUID,
  token?: string
): Promise<WebsiteAIContentResponse[]> {
  return apiClient<WebsiteAIContentResponse[]>(
    `/api/v1/website-ai-content/store/${storeId}`,
    {
      method: "GET",
      token,
    }
  );
}


// ============================================================
// 5. WEBSITE AI GENERATION
// ============================================================

/**
 * POST /api/v1/website-ai/generate
 *
 * Generate website content using AI.
 */
export async function generateWebsiteAIContent(
  data: WebsiteAIGenerateRequest,
  token?: string
): Promise<WebsiteAIContentResponse> {
  return apiClient<WebsiteAIContentResponse>(
    "/api/v1/website-ai/generate",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// 6. BLOG WRITER AI AGENT
// ============================================================

/**
 * POST /api/v1/blog-agent/generate
 *
 * Generate a blog post using AI.
 */
export async function generateBlog(
  data: BlogGenerationRequest,
  token?: string
): Promise<string> {
  return apiClient<string>(
    "/api/v1/blog-agent/generate",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// 7. PUBLIC WEBSITE
// ============================================================

/**
 * GET /api/v1/company/{slug}
 *
 * Resolve public website by slug.
 */
export async function getPublicWebsite(
  slug: string,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    `/api/v1/company/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      token,
    }
  );
}


/**
 * GET /api/v1/
 *
 * Resolve public website by domain/Host header.
 */
export async function getWebsiteByDomain(
  host?: string,
  token?: string
): Promise<WebsiteResponse> {
  return apiClient<WebsiteResponse>(
    "/api/v1/",
    {
      method: "GET",
      token,
      headers: host
        ? {
            host,
          }
        : undefined,
    }
  );
}