// src/lib/api/tenant.ts

import { apiClient } from "../api-client";

import {
  Tenant,
  TenantCreatePayload,
  TenantUpdatePayload,
  TenantSettings,
  TenantSettingsUpdatePayload,
} from "@/types/tenant";


/* =========================
   LIST RESPONSE
========================= */

export interface TenantListResponse {
  items: Tenant[];
  total: number;
  skip: number;
  limit: number;
}


/* =========================
   TENANT API
========================= */

export const tenantApi = {

  /* =========================
     CREATE TENANT
     POST /api/v1/tenants
  ========================= */

  create: (
    data: TenantCreatePayload,
    token: string
  ) =>
    apiClient<Tenant>(
      "/api/v1/tenants",
      {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }
    ),


  /* =========================
     LIST TENANTS
     GET /api/v1/tenants
  ========================= */

  list: (
    token: string,
    skip = 0,
    limit = 20
  ) =>
    apiClient<TenantListResponse>(
      `/api/v1/tenants?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        token,
      }
    ),


  /* =========================
     GET TENANT
     GET /api/v1/tenants/{tenantId}
  ========================= */

  getById: (
    tenantId: string,
    token: string
  ) =>
    apiClient<Tenant>(
      `/api/v1/tenants/${tenantId}`,
      {
        method: "GET",
        token,
      }
    ),


  /* =========================
     UPDATE TENANT
     PATCH /api/v1/tenants/{tenantId}

     Swagger verified fields:
     gstNumber
     documentMediaLink
     documentVerificationDone
     documentVerificationDoneBy
     businessName
     legalName
     logoMediaId
     email
     mobile
     whatsappMobile
     ownerName
     businessAddressLine1
     businessAddressLine2
     locationLatitude
     locationLongitude
     landmark
     postOffice
     policeStation
     city
     state
     country
     postalCode
     businessType
     businessDescription
     employeeCount
     statusId
     isActive
  ========================= */

  update: (
    tenantId: string,
    data: TenantUpdatePayload,
    token: string
  ) =>
    apiClient<Tenant>(
      `/api/v1/tenants/${tenantId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),


  /* =========================
     DELETE TENANT
     DELETE /api/v1/tenants/{tenantId}
  ========================= */

  remove: (
    tenantId: string,
    token: string
  ) =>
    apiClient<void>(
      `/api/v1/tenants/${tenantId}`,
      {
        method: "DELETE",
        token,
      }
    ),


  /* =========================
     UPDATE TENANT STATUS
     PATCH /api/v1/tenants/{tenantId}/status

     Swagger:
     tenantId -> path
     statusId -> query
  ========================= */

  updateStatus: (
    tenantId: string,
    statusId: number,
    token: string
  ) =>
    apiClient<Tenant>(
      `/api/v1/tenants/${tenantId}/status?statusId=${statusId}`,
      {
        method: "PATCH",
        token,
      }
    ),


  /* =========================
     GET TENANT SETTINGS
     GET /api/v1/tenants/{tenantId}/settings
  ========================= */

  getSettings: (
    tenantId: string,
    token: string
  ) =>
    apiClient<TenantSettings>(
      `/api/v1/tenants/${tenantId}/settings`,
      {
        method: "GET",
        token,
      }
    ),


  /* =========================
     UPDATE TENANT SETTINGS
     PATCH /api/v1/tenants/{tenantId}/settings
  ========================= */

  updateSettings: (
    tenantId: string,
    data: TenantSettingsUpdatePayload,
    token: string
  ) =>
    apiClient<TenantSettings>(
      `/api/v1/tenants/${tenantId}/settings`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      }
    ),
};