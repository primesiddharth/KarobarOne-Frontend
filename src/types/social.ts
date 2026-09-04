export type UUID = string;

export interface SocialLinkCreate {
  storeId: UUID;
  platformId: UUID;
  profileUrl: string;
  isActive?: boolean;
}

export interface SocialLinkUpdate {
  profileUrl?: string | null;
  isActive?: boolean | null;
}

export interface SocialLinkResponse {
  id: UUID;
  storeId: UUID;
  platformId: UUID;
  profileUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface SocialPlatformCreate {
  platformCode: string;
  platformName: string;
  baseUrl?: string | null;
  iconMediaId?: UUID | null;
  isActive?: boolean;
}

export interface SocialPlatformUpdate {
  platformName?: string | null;
  baseUrl?: string | null;
  iconMediaId?: UUID | null;
  isActive?: boolean | null;
}

export interface SocialPlatformResponse {
  id: UUID;
  platformCode: string;
  platformName: string;
  baseUrl: string | null;
  iconMediaId: UUID | null;
  isActive: boolean;
  createdAt: string;
}