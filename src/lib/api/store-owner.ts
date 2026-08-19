const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

export interface Store {
  id: string;
  name?: string;
  store_name?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  [key: string]: unknown;
}

export interface Order {
  id: string;
  tenant_id: string;
  store_id: string;
  customer_id: string;
  order_number: string;
  order_status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal_amount: string | number;
  discount_amount: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;
  total_amount: string | number;
  currency_code: string;
  customer_note?: string | null;
  placed_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string | null;
  first_name?: string;
  last_name?: string | null;
  email: string;
  mobile?: string | null;
  whatsappMobile?: string | null;
  whatsapp_mobile?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface StorePermission {
  id?: string;
  user_id?: string;
  store_id?: string;
  permission?: string;
  role?: string;
  [key: string]: unknown;
}

export interface UserRole {
  id?: string;
  user_id?: string;
  role?: string;
  [key: string]: unknown;
}

export interface WebsiteSettings {
  id?: string;
  store_id?: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  store_id?: string;
  product_name?: string;
  quantity_constraint?: number;
  status?: string;
  [key: string]: unknown;
}

/**
 * Get access token.
 *
 * If your auth-context uses a different localStorage key,
 * change/add that key here.
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const possibleKeys = [
    "accessToken",
    "access_token",
    "karobar_access_token",
    "token",
  ];

  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  return null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error?.message ||
        message;
    } catch {
      // Ignore invalid JSON error response
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/* =========================================================
   STORE
========================================================= */

export async function getStore(
  storeId: string
): Promise<Store> {
  return apiRequest<Store>(
    `/api/v1/stores/${storeId}`
  );
}

/* =========================================================
   ORDERS
========================================================= */

export async function getOrders(): Promise<Order[]> {
  return apiRequest<Order[]>(
    `/api/v1/github/orders/`
  );
}

export async function getOrder(
  orderId: string
): Promise<Order> {
  return apiRequest<Order>(
    `/api/v1/github/orders/${orderId}`
  );
}

/* =========================================================
   USERS / CUSTOMERS
========================================================= */

export async function getUsers(
  skip = 0,
  limit = 100
): Promise<User[]> {
  return apiRequest<User[]>(
    `/api/v1/users/?skip=${skip}&limit=${limit}`
  );
}

export async function getUser(
  userId: string
): Promise<User> {
  return apiRequest<User>(
    `/api/v1/users/${userId}`
  );
}

/* =========================================================
   STORE STAFF PERMISSIONS
========================================================= */

export async function getStorePermissions(
  userId: string,
  storeId: string
): Promise<StorePermission[]> {
  return apiRequest<StorePermission[]>(
    `/api/v1/users/${userId}/store-permissions/?storeId=${storeId}`
  );
}

/* =========================================================
   USER ROLES
========================================================= */

export async function getUserRoles(
  userId: string
): Promise<UserRole[]> {
  return apiRequest<UserRole[]>(
    `/api/v1/users/${userId}/roles/`
  );
}

/* =========================================================
   WEBSITE SETTINGS
========================================================= */

export async function getWebsiteSettings(
  storeId: string
): Promise<WebsiteSettings> {
  return apiRequest<WebsiteSettings>(
    `/api/v1/website-settings/store/${storeId}`
  );
}

export async function updateWebsiteSettings(
  storeId: string,
  data: Record<string, unknown>
): Promise<WebsiteSettings> {
  return apiRequest<WebsiteSettings>(
    `/api/v1/website-settings/store/${storeId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

/* =========================================================
   PRODUCTS
========================================================= */

export async function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>(
    `/api/v1/github/products/`
  );
}