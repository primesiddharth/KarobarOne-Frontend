import { apiClient } from "@/lib/api-client";

import type {
  // Users
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UsersQueryParams,

  // Roles
  CreateRolePayload,
  Role,

  // Permissions
  CreatePermissionPayload,
  Permission,

  // Role Permissions
  RolePermission,
  CreateRolePermissionPayload,

  // User Roles
  UserRole,
  CreateUserRolePayload,

  // Store Staff Permissions
  StoreStaffPermission,
  CreateStoreStaffPermissionPayload,

  // User Sessions
  UserSession,

  // User Security Settings
  UserSecuritySettings,
  UpdateUserSecuritySettingsPayload,
} from "@/types/users";

// ============================================================
// 1. USERS
// ============================================================

/**
 * POST /api/v1/users/
 * Create a new user
 */
export async function createUser(
  data: CreateUserPayload,
  token?: string
): Promise<User> {
  return apiClient<User>("/api/v1/users/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/v1/users/
 * List users with pagination
 */
export async function getUsers(
  params?: UsersQueryParams,
  token?: string
): Promise<User[]> {
  const searchParams = new URLSearchParams();

  if (params?.skip !== undefined) {
    searchParams.set("skip", String(params.skip));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return apiClient<User[]>(
    `/api/v1/users/${query ? `?${query}` : ""}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * GET /api/v1/users/{userId}
 * Get user details
 */
export async function getUser(
  userId: string,
  token?: string
): Promise<User> {
  return apiClient<User>(`/api/v1/users/${userId}`, {
    method: "GET",
    token,
  });
}

/**
 * PATCH /api/v1/users/{userId}
 * Update user
 */
export async function updateUser(
  userId: string,
  data: UpdateUserPayload,
  token?: string
): Promise<User> {
  return apiClient<User>(`/api/v1/users/${userId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/v1/users/{userId}
 * Delete user
 */
export async function deleteUser(
  userId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(`/api/v1/users/${userId}`, {
    method: "DELETE",
    token,
  });
}


// ============================================================
// 2. ROLES
// ============================================================

/**
 * GET /api/v1/roles/
 * List roles
 */
export async function getRoles(
  token?: string
): Promise<Role[]> {
  return apiClient<Role[]>("/api/v1/roles/", {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/roles/
 * Create role
 */
export async function createRole(
  data: CreateRolePayload,
  token?: string
): Promise<Role> {
  return apiClient<Role>("/api/v1/roles/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/v1/roles/{roleId}
 * Get role details
 */
export async function getRole(
  roleId: string,
  token?: string
): Promise<Role> {
  return apiClient<Role>(`/api/v1/roles/${roleId}`, {
    method: "GET",
    token,
  });
}


// ============================================================
// 3. PERMISSIONS
// ============================================================

/**
 * GET /api/v1/permissions/
 * List permissions
 */
export async function getPermissions(
  token?: string
): Promise<Permission[]> {
  return apiClient<Permission[]>("/api/v1/permissions/", {
    method: "GET",
    token,
  });
}

/**
 * POST /api/v1/permissions/
 * Create permission
 */
export async function createPermission(
  data: CreatePermissionPayload,
  token?: string
): Promise<Permission> {
  return apiClient<Permission>("/api/v1/permissions/", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/v1/permissions/{permissionId}
 * Get permission details
 */
export async function getPermission(
  permissionId: string,
  token?: string
): Promise<Permission> {
  return apiClient<Permission>(
    `/api/v1/permissions/${permissionId}`,
    {
      method: "GET",
      token,
    }
  );
}


// ============================================================
// 4. ROLE PERMISSIONS
// ============================================================

/**
 * POST /api/v1/roles/{roleId}/permissions/
 * Grant permission to role
 */
export async function grantRolePermission(
  roleId: string,
  data: CreateRolePermissionPayload,
  token?: string
): Promise<RolePermission> {
  return apiClient<RolePermission>(
    `/api/v1/roles/${roleId}/permissions/`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/roles/{roleId}/permissions/
 * List permissions assigned to role
 */
export async function getRolePermissions(
  roleId: string,
  token?: string
): Promise<RolePermission[]> {
  return apiClient<RolePermission[]>(
    `/api/v1/roles/${roleId}/permissions/`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * DELETE /api/v1/roles/{roleId}/permissions/{mappingId}
 * Revoke permission from role
 */
export async function revokeRolePermission(
  roleId: string,
  mappingId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/roles/${roleId}/permissions/${mappingId}`,
    {
      method: "DELETE",
      token,
    }
  );
}


// ============================================================
// 5. USER ROLES
// ============================================================

/**
 * POST /api/v1/users/{userId}/roles/
 * Assign role to user
 */
export async function assignUserRole(
  userId: string,
  data: CreateUserRolePayload,
  token?: string
): Promise<UserRole> {
  return apiClient<UserRole>(
    `/api/v1/users/${userId}/roles/`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/users/{userId}/roles/
 * List roles assigned to user
 */
export async function getUserRoles(
  userId: string,
  token?: string
): Promise<UserRole[]> {
  return apiClient<UserRole[]>(
    `/api/v1/users/${userId}/roles/`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * DELETE /api/v1/users/{userId}/roles/{mappingId}
 * Revoke role from user
 */
export async function revokeUserRole(
  userId: string,
  mappingId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/users/${userId}/roles/${mappingId}`,
    {
      method: "DELETE",
      token,
    }
  );
}


// ============================================================
// 6. STORE STAFF PERMISSIONS
// ============================================================

/**
 * POST /api/v1/users/{userId}/store-permissions/
 * Grant store-level permission
 */
export async function grantStoreStaffPermission(
  userId: string,
  data: CreateStoreStaffPermissionPayload,
  token?: string
): Promise<StoreStaffPermission> {
  return apiClient<StoreStaffPermission>(
    `/api/v1/users/${userId}/store-permissions/`,
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );
}

/**
 * GET /api/v1/users/{userId}/store-permissions/
 * List store-level permissions
 */
export async function getStoreStaffPermissions(
  userId: string,
  storeId: string,
  token?: string
): Promise<StoreStaffPermission[]> {
  const searchParams = new URLSearchParams();

  searchParams.set("storeId", storeId);

  return apiClient<StoreStaffPermission[]>(
    `/api/v1/users/${userId}/store-permissions/?${searchParams.toString()}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * DELETE /api/v1/users/{userId}/store-permissions/{recordId}
 * Revoke store-level permission
 */
export async function revokeStoreStaffPermission(
  userId: string,
  recordId: string,
  token?: string
): Promise<void> {
  return apiClient<void>(
    `/api/v1/users/${userId}/store-permissions/${recordId}`,
    {
      method: "DELETE",
      token,
    }
  );
}


// ============================================================
// 7. USER SECURITY SETTINGS
// ============================================================

/**
 * GET /api/v1/users/{userId}/security-settings/
 * Get user security settings
 */
export async function getUserSecuritySettings(
  userId: string,
  token?: string
): Promise<UserSecuritySettings> {
  return apiClient<UserSecuritySettings>(
    `/api/v1/users/${userId}/security-settings/`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * PATCH /api/v1/users/{userId}/security-settings/
 * Update user security settings
 */
export async function updateUserSecuritySettings(
  userId: string,
  data: UpdateUserSecuritySettingsPayload,
  token?: string
): Promise<UserSecuritySettings> {
  return apiClient<UserSecuritySettings>(
    `/api/v1/users/${userId}/security-settings/`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// 8. USER SESSIONS
// ============================================================

/**
 * GET /api/v1/users/{userId}/sessions/
 * List user sessions
 */
export async function getUserSessions(
  userId: string,
  token?: string
): Promise<UserSession[]> {
  return apiClient<UserSession[]>(
    `/api/v1/users/${userId}/sessions/`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * PATCH /api/v1/users/{userId}/sessions/{sessionId}/end
 * End user session
 */
export async function endUserSession(
  userId: string,
  sessionId: string,
  token?: string
): Promise<UserSession> {
  return apiClient<UserSession>(
    `/api/v1/users/${userId}/sessions/${sessionId}/end`,
    {
      method: "PATCH",
      token,
    }
  );
}