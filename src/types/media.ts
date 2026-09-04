// src/types/media.ts

/* =====================================================
   MEDIA FILE
===================================================== */

export interface MediaFile {
  id: string;
  tenantId: string;
  fileName?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  storageProvider?: string;
  storagePath?: string;
  publicUrl?: string;
  uploadStatus?: string;
  checksum?: string;
  uploadedAt?: string;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface MediaFileCreatePayload {
  tenantId?: string;
  fileName?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  storageProvider?: string;
  storagePath?: string;
  publicUrl?: string;
  uploadStatus?: string;
  checksum?: string;
  isActive?: boolean;
}

export interface MediaFileUpdatePayload {
  fileName?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  storageProvider?: string;
  storagePath?: string;
  publicUrl?: string;
  uploadStatus?: string;
  checksum?: string;
  isActive?: boolean;
}


/* =====================================================
   MEDIA METADATA
===================================================== */

export interface MediaMetadata {
  id: string;
  mediaFileId: string;
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
  slug?: string;
  tags?: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaMetadataCreatePayload {
  mediaFileId: string;
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
  slug?: string;
  tags?: string;
  width?: number;
  height?: number;
}

export interface MediaMetadataUpdatePayload {
  title?: string;
  altText?: string;
  caption?: string;
  description?: string;
  slug?: string;
  tags?: string;
  width?: number;
  height?: number;
}


/* =====================================================
   MEDIA VARIANT
===================================================== */

export interface MediaVariant {
  id: string;
  mediaFileId: string;
  variantName?: string;
  variantType?: string;
  width?: number;
  height?: number;
  url?: string;
  storagePath?: string;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaVariantCreatePayload {
  mediaFileId: string;
  variantName?: string;
  variantType?: string;
  width?: number;
  height?: number;
  url?: string;
  storagePath?: string;
  mimeType?: string;
  fileSize?: number;
}

export interface MediaVariantUpdatePayload {
  variantName?: string;
  variantType?: string;
  width?: number;
  height?: number;
  url?: string;
  storagePath?: string;
  mimeType?: string;
  fileSize?: number;
}


/* =====================================================
   MEDIA UPLOAD LOG
===================================================== */

export interface MediaUploadLog {
  id: string;
  mediaFileId: string;
  uploadStatus?: string;
  errorMessage?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MediaUploadLogCreatePayload {
  mediaFileId: string;
  uploadStatus?: string;
  errorMessage?: string;
  fileName?: string;
  fileSize?: number;
}

export interface MediaUploadLogUpdatePayload {
  uploadStatus?: string;
  errorMessage?: string;
  fileName?: string;
  fileSize?: number;
}


/* =====================================================
   PAGINATION
===================================================== */

export interface MediaFileListResponse {
  items: MediaFile[];
  total: number;
  skip: number;
  limit: number;
}

export interface MediaMetadataListResponse {
  items: MediaMetadata[];
}

export interface MediaVariantListResponse {
  items: MediaVariant[];
}

export interface MediaUploadLogListResponse {
  items: MediaUploadLog[];
}