// ============================================================
// 1. USERS
// ============================================================

export interface User {
  id: string;

  firstName: string;
  lastName: string;

  email: string;

  mobile: string;
  whatsappMobile: string;

  isActive: boolean;

  isEmailVerified: boolean;
  isMobileVerified: boolean;

  lastLoginAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;

  email: string;

  mobile: string;
  whatsappMobile: string;

  password: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;

  email?: string;

  mobile?: string;
  whatsappMobile?: string;

  isActive?: boolean;
}

export interface UsersQueryParams {
  skip?: number;
  limit?: number;
}


// ============================================================
// 2. ROLES
// ============================================================

export interface Role {
  id: string;

  roleName: string;
  roleCode: string;

  description: string;

  isSystemRole: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePayload {
  roleName: string;
  roleCode: string;
  description: string;
  isSystemRole: boolean;
}


// ============================================================
// 3. PERMISSIONS
// ============================================================

export interface Permission {
  id: string;

  permissionName: string;
  permissionCode: string;

  description: string;

  createdAt: string;
}

export interface CreatePermissionPayload {
  permissionName: string;
  permissionCode: string;
  description: string;
}


// ============================================================
// 4. ROLE PERMISSIONS
// ============================================================

export interface RolePermission {
  id: string;

  roleId: string;
  permissionId: string;

  createdAt: string;
}

export interface CreateRolePermissionPayload {
  permissionId: string;
}


// ============================================================
// 5. USER ROLES
// ============================================================

export interface UserRole {
  id: string;

  userId: string;
  roleId: string;

  tenantId: string;

  assignedBy: string;

  assignedAt: string;
}

export interface CreateUserRolePayload {
  roleId: string;
  tenantId: string;
  assignedBy: string;
}


// ============================================================
// 6. STORE STAFF PERMISSIONS
// ============================================================

export interface StoreStaffPermission {
  id: string;

  userId: string;
  storeId: string;
  permissionId: string;

  grantedBy: string;

  createdAt: string;
}

export interface CreateStoreStaffPermissionPayload {
  storeId: string;
  permissionId: string;
  grantedBy: string;
}


// ============================================================
// 7. USER SECURITY SETTINGS
// ============================================================

export interface UserSecuritySettings {
  id: string;

  userId: string;

  twoFactorEnabled: boolean;

  failedLoginCount: number;

  accountLockedUntil: string | null;

  passwordChangedAt: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSecuritySettingsPayload {
  twoFactorEnabled: boolean;
}


// ============================================================
// 8. USER SESSIONS
// ============================================================

export interface UserSession {
  id: string;

  userId: string;

  refreshTokenId: string;

  loginAt: string;

  logoutAt: string | null;

  ipAddress: string;

  userAgent: string;

  isActive: boolean;
}