/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Promo, Branch, Reservation, Order, User, Review, ContactMessage } from '../types';

export const api = {
  // Authentication
  async login(credentials: any): Promise<{ user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal masuk');
    }
    return res.json();
  },

  async register(data: any): Promise<{ user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal mendaftar');
    }
    return res.json();
  },

  // Menus
  async getMenus(): Promise<MenuItem[]> {
    const res = await fetch('/api/menu');
    return res.json();
  },

  async createMenu(data: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateMenu(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteMenu(id: string): Promise<MenuItem> {
    const res = await fetch(`/api/menu/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Promos
  async getPromos(): Promise<Promo[]> {
    const res = await fetch('/api/promos');
    return res.json();
  },

  async createPromo(data: Partial<Promo>): Promise<Promo> {
    const res = await fetch('/api/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePromo(id: string, data: Partial<Promo>): Promise<Promo> {
    const res = await fetch(`/api/promos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deletePromo(id: string): Promise<Promo> {
    const res = await fetch(`/api/promos/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Branches
  async getBranches(): Promise<Branch[]> {
    const res = await fetch('/api/branches');
    return res.json();
  },

  async createBranch(data: Partial<Branch>): Promise<Branch> {
    const res = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBranch(id: string): Promise<Branch> {
    const res = await fetch(`/api/branches/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    const res = await fetch('/api/reservations');
    return res.json();
  },

  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders');
    return res.json();
  },

  async createOrder(data: Partial<Order>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch('/api/reviews');
    return res.json();
  },

  async createReview(data: Partial<Review>): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Contact Us
  async sendMessage(data: any): Promise<ContactMessage> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact');
    return res.json();
  },

  async updateMessage(id: string, data: Partial<ContactMessage>): Promise<ContactMessage> {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Report statistics
  async getReports(): Promise<any> {
    const res = await fetch('/api/reports');
    return res.json();
  },

  // Gemini chat assistant
  async askGemini(message: string, history: Array<{role: 'user'|'model', text: string}>): Promise<{ text: string }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) {
      throw new Error('Eyang sedang sibuk menyiapkan bumbu');
    }
    return res.json();
  }
};
