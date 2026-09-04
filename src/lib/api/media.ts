// src/lib/api/media.ts

import { apiClient } from "../api-client";

import {
  MediaFile,
  MediaFileCreatePayload,
  MediaFileUpdatePayload,
  MediaFileListResponse,

  MediaMetadata,
  MediaMetadataCreatePayload,
  MediaMetadataUpdatePayload,
  MediaMetadataListResponse,

  MediaVariant,
  MediaVariantCreatePayload,
  MediaVariantUpdatePayload,
  MediaVariantListResponse,

  MediaUploadLog,
  MediaUploadLogCreatePayload,
  MediaUploadLogUpdatePayload,
  MediaUploadLogListResponse,
} from "@/types/media";


export const mediaApi = {

  /* =====================================================
     MEDIA FILES
  ===================================================== */

  // POST /api/v1/media-files/
  createFile: (
    data: MediaFileCreatePayload,
    token: string
  ) =>
    apiClient<MediaFile>(
      "/api/v1/media-files/",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),

  // GET /api/v1/media-files/?tenantId={tenantId}
  listFiles: (
    token: string,
    tenantId?: string,
    skip = 0,
    limit = 20
  ) => {
    const params = new URLSearchParams();

    if (tenantId) {
      params.set("tenantId", tenantId);
    }

    params.set("skip", String(skip));
    params.set("limit", String(limit));

    return apiClient<MediaFileListResponse>(
      `/api/v1/media-files/?${params.toString()}`,
      {
        method: "GET",
        token,
      }
    );
  },

  // GET /api/v1/media-files/{mediaFileId}
  getFile: (
    mediaFileId: string,
    token: string
  ) =>
    apiClient<MediaFile>(
      `/api/v1/media-files/${encodeURIComponent(mediaFileId)}`,
      {
        method: "GET",
        token,
      }
    ),

  // PATCH /api/v1/media-files/{mediaFileId}
  updateFile: (
    mediaFileId: string,
    data: MediaFileUpdatePayload,
    token: string
  ) =>
    apiClient<MediaFile>(
      `/api/v1/media-files/${encodeURIComponent(mediaFileId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),

  // DELETE /api/v1/media-files/{mediaFileId}?soft=true
  deleteFile: (
    mediaFileId: string,
    token: string,
    soft = true
  ) =>
    apiClient<void>(
      `/api/v1/media-files/${encodeURIComponent(
        mediaFileId
      )}?soft=${String(soft)}`,
      {
        method: "DELETE",
        token,
      }
    ),


  /* =====================================================
     MEDIA METADATA
  ===================================================== */

  // GET /api/v1/media-metadata/
  listMetadata: (
    token: string
  ) =>
    apiClient<MediaMetadataListResponse>(
      "/api/v1/media-metadata/",
      {
        method: "GET",
        token,
      }
    ),

  // POST /api/v1/media-metadata/
  createMetadata: (
    data: MediaMetadataCreatePayload,
    token: string
  ) =>
    apiClient<MediaMetadata>(
      "/api/v1/media-metadata/",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),

  // GET /api/v1/media-metadata/{metadataId}
  getMetadata: (
    metadataId: string,
    token: string
  ) =>
    apiClient<MediaMetadata>(
      `/api/v1/media-metadata/${encodeURIComponent(metadataId)}`,
      {
        method: "GET",
        token,
      }
    ),

  // GET /api/v1/media-metadata/media-file/{mediaFileId}
  getMetadataByMediaFile: (
    mediaFileId: string,
    token: string
  ) =>
    apiClient<MediaMetadata>(
      `/api/v1/media-metadata/media-file/${encodeURIComponent(
        mediaFileId
      )}`,
      {
        method: "GET",
        token,
      }
    ),

  // PATCH /api/v1/media-metadata/{metadataId}
  updateMetadata: (
    metadataId: string,
    data: MediaMetadataUpdatePayload,
    token: string
  ) =>
    apiClient<MediaMetadata>(
      `/api/v1/media-metadata/${encodeURIComponent(metadataId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),

  // DELETE /api/v1/media-metadata/{metadataId}
  deleteMetadata: (
    metadataId: string,
    token: string
  ) =>
    apiClient<void>(
      `/api/v1/media-metadata/${encodeURIComponent(metadataId)}`,
      {
        method: "DELETE",
        token,
      }
    ),


  /* =====================================================
     MEDIA VARIANTS
  ===================================================== */

  // POST /api/v1/media-variants/
  createVariant: (
    data: MediaVariantCreatePayload,
    token: string
  ) =>
    apiClient<MediaVariant>(
      "/api/v1/media-variants/",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),

  // GET /api/v1/media-variants/?mediaFileId={mediaFileId}
  listVariants: (
    mediaFileId: string,
    token: string
  ) => {
    const params = new URLSearchParams();
    params.set("mediaFileId", mediaFileId);

    return apiClient<MediaVariantListResponse>(
      `/api/v1/media-variants/?${params.toString()}`,
      {
        method: "GET",
        token,
      }
    );
  },

  // GET /api/v1/media-variants/{variantId}
  getVariant: (
    variantId: string,
    token: string
  ) =>
    apiClient<MediaVariant>(
      `/api/v1/media-variants/${encodeURIComponent(variantId)}`,
      {
        method: "GET",
        token,
      }
    ),

  // PATCH /api/v1/media-variants/{variantId}
  updateVariant: (
    variantId: string,
    data: MediaVariantUpdatePayload,
    token: string
  ) =>
    apiClient<MediaVariant>(
      `/api/v1/media-variants/${encodeURIComponent(variantId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),

  // DELETE /api/v1/media-variants/{variantId}
  deleteVariant: (
    variantId: string,
    token: string
  ) =>
    apiClient<void>(
      `/api/v1/media-variants/${encodeURIComponent(variantId)}`,
      {
        method: "DELETE",
        token,
      }
    ),


  /* =====================================================
     MEDIA UPLOAD LOGS
  ===================================================== */

  // POST /api/v1/media-upload-logs/
  createUploadLog: (
    data: MediaUploadLogCreatePayload,
    token: string
  ) =>
    apiClient<MediaUploadLog>(
      "/api/v1/media-upload-logs/",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),

  // GET /api/v1/media-upload-logs/?mediaFileId={mediaFileId}
  listUploadLogs: (
    mediaFileId: string,
    token: string
  ) => {
    const params = new URLSearchParams();
    params.set("mediaFileId", mediaFileId);

    return apiClient<MediaUploadLogListResponse>(
      `/api/v1/media-upload-logs/?${params.toString()}`,
      {
        method: "GET",
        token,
      }
    );
  },

  // GET /api/v1/media-upload-logs/{logId}
  getUploadLog: (
    logId: string,
    token: string
  ) =>
    apiClient<MediaUploadLog>(
      `/api/v1/media-upload-logs/${encodeURIComponent(logId)}`,
      {
        method: "GET",
        token,
      }
    ),

  // PATCH /api/v1/media-upload-logs/{logId}
  updateUploadLog: (
    logId: string,
    data: MediaUploadLogUpdatePayload,
    token: string
  ) =>
    apiClient<MediaUploadLog>(
      `/api/v1/media-upload-logs/${encodeURIComponent(logId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),

  // DELETE /api/v1/media-upload-logs/{logId}
  deleteUploadLog: (
    logId: string,
    token: string
  ) =>
    apiClient<void>(
      `/api/v1/media-upload-logs/${encodeURIComponent(logId)}`,
      {
        method: "DELETE",
        token,
      }
    ),
};