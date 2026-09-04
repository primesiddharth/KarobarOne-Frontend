// ============================================================
// WEBSITE MODULE TYPES
// ============================================================

export type UUID = string;
export type DateTime = string;

export type JsonObject = Record<string, unknown>;

export type JsonValue =
  | JsonObject
  | unknown[]
  | string
  | number
  | boolean
  | null;


// ============================================================
// 1. WEBSITES
// ============================================================

export interface WebsiteCreate {
  tenantId: UUID;
  companyName: string;
  businessType: string;
  theme?: string | null;
  plan?: string;
  domain?: string | null;
}

export interface WebsiteUpdate {
  companyName?: string | null;
  businessType?: string | null;
  theme?: string | null;
  plan?: string | null;
  domain?: string | null;
}

export interface WebsiteResponse {
  id: UUID;
  tenantId: UUID;
  companyName: string;
  slug: string;
  businessType: string;
  theme: string | null;
  status: string;
  plan: string;
  domain: string | null;
  createdAt: DateTime;
}

export interface WebsiteSubmitRequest {
  websiteId: UUID;
}


// ============================================================
// WEBSITE PREVIEW
// ============================================================

export interface WebsitePreviewSection {
  id: UUID;
  sectionName: string;
  content: JsonValue;
}

export interface WebsitePreviewMedia {
  id: UUID;
  logo: string | null;
  banner: string | null;
  gallery: unknown[] | null;
}

export interface WebsitePreviewTheme {
  id: UUID;
  themeName: string;
  themeCode: string;
  configSchema: JsonValue;
  isActive: boolean;
}

export interface WebsitePreviewResponse {
  website: JsonObject;
  sections: WebsitePreviewSection[];
  media: WebsitePreviewMedia | null;
  theme: WebsitePreviewTheme | null;
  preview?: boolean;
}


// ============================================================
// 2. ADMIN WEBSITES
// ============================================================

export interface WebsiteStatusRequest {
  websiteId: UUID;
  reason?: string | null;
}


// ============================================================
// 3. WEBSITE AI CONTENT
// ============================================================

export interface WebsiteAIContentCreate {
  storeId: UUID;
  contentType: string;
  content?: string | null;
  metadata?: JsonValue;
}

export interface WebsiteAIContentUpdate {
  content?: string | null;
  metadata?: JsonValue;
  status?: string | null;
}

export interface WebsiteAIContentResponse {
  id: UUID;
  storeId: UUID;
  contentType: string;
  content: string | null;
  metadata: JsonValue;
  status: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}


// ============================================================
// 4. WEBSITE AI GENERATION
// ============================================================

export interface WebsiteAIGenerateRequest {
  storeId: UUID;
  contentType: string;
  instructions?: string | null;
}


// ============================================================
// 5. SEO METADATA
// ============================================================

export interface SeoMetadataCreate {
  tenantId: UUID;
  entityType: string;
  entityId: UUID;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  slug: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  seoScore?: number | string | null;
}

export interface SeoMetadataUpdate {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  slug?: string | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
  seoScore?: number | string | null;
}

export interface SeoMetadataResponse {
  id: UUID;
  tenantId: UUID;
  entityType: string;
  entityId: UUID;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  slug: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  seoScore: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface ListSeoMetadataParams {
  tenantId?: UUID;
}

export interface SeoScoreRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  slug?: string | null;
  content?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface SeoScoreResponse {
  seoScore: number;
  grade: string;
  suggestions: string[];
}

export interface AiSeoSuggestionRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: string | null;
}

export interface AiSeoSuggestionResponse {
  improvedTitle: string;
  improvedDescription: string;
  keywords: string[];
}

export interface SeoAuditRequest {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  slug?: string | null;
  content?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
}

export interface SeoAuditResponse {
  seoScore: number;
  grade: string;
  titleLength: number;
  descriptionLength: number;
  contentLength: number;
  wordCount: number;
  keywordDensity: number;
  readability: string;
  canonical: boolean;
  robots: boolean;
  issues: string[];
  recommendations: string[];
}

export interface KeywordDensityRequest {
  content: string;
  targetKeyword: string;
}

export interface KeywordDensityResponse {
  keyword: string;
  count: number;
  totalWords: number;
  density: number;
  status: string;
  recommendation: string;
}


// ============================================================
// 6. BLOG WRITER AI AGENT
// ============================================================

export interface BlogGenerationRequest {
  topic: string;
  as_of?: string | null;
  tenantId?: UUID | null;
}