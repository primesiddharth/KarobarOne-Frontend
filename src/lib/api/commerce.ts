// src/lib/api/commerce.ts

import { apiClient } from "../api-client";
import {
  Cart,
  CartCreatePayload,
  CartItem,
  CartItemCreatePayload,
  CartItemUpdatePayload,
  CheckoutRequestPayload,
  CheckoutSummary,
  Order,
  OrderCreatePayload,
  OrderItem,
  Payment,
  PaymentCreatePayload,
  CreateRazorpayOrderPayload,
  RazorpayOrderResponse,
  VerifyPaymentPayload,
  RefundPayload,
} from "@/types/commerce";

// ---- Cart ----
export const cartApi = {
  create: (data: CartCreatePayload, token: string) =>
    apiClient<Cart>("/api/v1/github/cart/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) => apiClient<Cart[]>("/api/v1/github/cart/", { token }),
  getById: (cartId: string, token: string) =>
    apiClient<Cart>(`/api/v1/github/cart/${cartId}`, { token }),
  remove: (cartId: string, token: string) =>
    apiClient<void>(`/api/v1/github/cart/${cartId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Cart Items ----
export const cartItemApi = {
  create: (data: CartItemCreatePayload, token: string) =>
    apiClient<CartItem>("/api/v1/github/cart-items/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  listByCart: (cartId: string, token: string) =>
    apiClient<CartItem[]>(`/api/v1/github/cart-items/cart/${cartId}`, {
      token,
    }),
  update: (itemId: string, data: CartItemUpdatePayload, token: string) =>
    apiClient<CartItem>(`/api/v1/github/cart-items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (itemId: string, token: string) =>
    apiClient<void>(`/api/v1/github/cart-items/${itemId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Checkout (totals preview) ----
export const checkoutApi = {
  preview: (data: CheckoutRequestPayload, token: string) =>
    apiClient<CheckoutSummary>("/api/v1/github/checkout", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
};

// ---- Orders ----
export const orderApi = {
  create: (data: OrderCreatePayload, token: string) =>
    apiClient<Order>("/api/v1/github/orders/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) => apiClient<Order[]>("/api/v1/github/orders/", { token }),
  getById: (orderId: string, token: string) =>
    apiClient<Order>(`/api/v1/github/orders/${orderId}`, { token }),
  update: (orderId: string, data: Partial<OrderCreatePayload>, token: string) =>
    apiClient<Order>(`/api/v1/github/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),
  remove: (orderId: string, token: string) =>
    apiClient<void>(`/api/v1/github/orders/${orderId}`, {
      method: "DELETE",
      token,
    }),
};

// ---- Order Items ----
export const orderItemApi = {
  listByOrder: (orderId: string, token: string) =>
    apiClient<OrderItem[]>(`/api/v1/github/order-items/order/${orderId}`, {
      token,
    }),
};

// ---- Order Status ----
export const orderStatusApi = {
  update: (orderId: string, status: string, token: string) =>
    apiClient<Order>(`/api/v1/github/order-status`, {
      method: "PATCH",
      body: JSON.stringify({ order_id: orderId, order_status: status }),
      token,
    }),
};

// ---- Payments (Razorpay) ----
export const paymentApi = {
  create: (data: PaymentCreatePayload, token: string) =>
    apiClient<Payment>("/api/v1/github/payments/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  list: (token: string) =>
    apiClient<Payment[]>("/api/v1/github/payments/", { token }),
  getById: (paymentId: string, token: string) =>
    apiClient<Payment>(`/api/v1/github/payments/${paymentId}`, { token }),

  createRazorpayOrder: (data: CreateRazorpayOrderPayload, token: string) =>
    apiClient<RazorpayOrderResponse>("/api/v1/github/payments/create-order", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  verify: (data: VerifyPaymentPayload, token: string) =>
    apiClient<{ status: string }>("/api/v1/github/payments/verify", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  refund: (data: RefundPayload, token: string) =>
    apiClient<unknown>("/api/v1/github/payments/refund", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
};