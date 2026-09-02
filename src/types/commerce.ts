// src/types/commerce.ts
// NOTE: This module (github-ported) uses snake_case field names, unlike the rest
// of the backend which uses camelCase. Kept as-is here to match the API exactly.

// ---- Cart ----
export interface Cart {
  id: string;
  tenant_id: string;
  store_id: string;
  customer_id: string | null;
  session_id: string | null;
  cart_status: string;
  subtotal_amount: string;
  discount_amount: string;
  tax_amount: string;
  shipping_amount: string;
  total_amount: string;
  currency_code: string;
  expires_at: string | null;
  created_at?: string;
}

export interface CartCreatePayload {
  tenant_id: string;
  store_id: string;
  customer_id?: string | null;
  session_id?: string | null;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product_variant_id: string | null;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
}

export interface CartItemCreatePayload {
  cart_id: string;
  product_id: string;
  product_variant_id?: string | null;
  quantity?: number;
  unit_price: number;
  discount_amount?: number;
  tax_amount?: number;
}

export interface CartItemUpdatePayload {
  quantity?: number;
}

// ---- Checkout (cart totals preview) ----
export interface CheckoutRequestPayload {
  customer_id: string;
  shipping_address_id?: string | null;
  coupon_code?: string | null;
}

export interface CheckoutSummary {
  cart_id: string;
  total_items: number;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  grand_total: string;
  currency: string;
}

// ---- Orders ----
export interface Order {
  id: string;
  tenant_id: string;
  store_id: string;
  customer_id: string;
  cart_id: string | null;
  order_number: string;
  payment_id: string | null;
  shipping_profile_id: string | null;
  billing_address_id: string;
  shipping_address_id: string;
  order_status: string;
  payment_status: string;
  created_at?: string;
}

export interface OrderCreatePayload {
  tenant_id: string;
  store_id: string;
  customer_id: string;
  cart_id?: string | null;
  order_number: string;
  billing_address_id: string;
  shipping_address_id: string;
  order_status?: string;
  payment_status?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variant_id: string | null;
  quantity: number;
  unit_price: number;
}

// ---- Payments (Razorpay) ----
export interface PaymentCreatePayload {
  tenant_id: string;
  store_id: string;
  entity_type: string;
  entity_id: string;
  payment_method_id: string;
  amount: number;
  currency?: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  store_id: string;
  entity_type: string;
  entity_id: string;
  payment_method_id: string;
  amount: string;
  currency: string;
  status?: string;
  created_at?: string;
}

export interface CreateRazorpayOrderPayload {
  amount: number;
  currency?: string;
  receipt: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  [key: string]: unknown;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RefundPayload {
  payment_id: string;
  amount?: number | null;
}