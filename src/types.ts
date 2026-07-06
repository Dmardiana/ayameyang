/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: string;
}

export type MenuCategory = 'makanan' | 'minuman' | 'dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  isAvailable: boolean;
  rating: number;
  soldCount: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'transfer' | 'midtrans';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  tableNumber?: string; // empty if delivery/takeaway
  notes?: string;
  createdAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableNumber?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  bannerUrl: string;
  isAvailable: boolean;
  minPurchase: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  isMainBranch: boolean;
  comingSoon?: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  menuId: string;
  menuName: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}
