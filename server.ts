/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './server-db';
import bcrypt from 'bcryptjs';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // ============================================
  // AUTH APIs
  // ============================================

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi.' });
      }

      const user = await db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email atau kata sandi salah.' });
      }

      // Compare password with bcrypt hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Email atau kata sandi salah.' });
      }

      // Return user without password_hash
      const { password_hash, ...safeUser } = user;
      const mappedUser = {
        id: safeUser.id,
        email: safeUser.email,
        name: safeUser.name,
        role: safeUser.role,
        phone: safeUser.phone || '',
        address: safeUser.address || '',
        createdAt: safeUser.created_at?.toISOString?.() || safeUser.created_at || ''
      };

      return res.json({ user: mappedUser });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, phone, address, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
      }

      const existing = await db.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Email sudah terdaftar.' });
      }

      // Hash password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await db.createUser({
        id: `usr_${Date.now()}`,
        email,
        name,
        role: 'customer',
        phone: phone || '',
        address: address || '',
        passwordHash
      });

      return res.json({ user: newUser });
    } catch (err: any) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  });

  // ============================================
  // MENU CRUD APIs
  // ============================================

  app.get('/api/menu', async (req, res) => {
    try {
      const items = await db.getMenuItems();
      res.json(items);
    } catch (err: any) {
      console.error('Get menu error:', err);
      res.status(500).json({ error: 'Gagal memuat menu.' });
    }
  });

  app.post('/api/menu', async (req, res) => {
    try {
      const item = await db.createMenuItem({
        id: `mn_${Date.now()}`,
        rating: 5.0,
        soldCount: 0,
        ...req.body
      });
      res.json(item);
    } catch (err: any) {
      console.error('Create menu error:', err);
      res.status(500).json({ error: 'Gagal menambah menu.' });
    }
  });

  app.put('/api/menu/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateMenuItem(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Menu tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update menu error:', err);
      res.status(500).json({ error: 'Gagal mengupdate menu.' });
    }
  });

  app.delete('/api/menu/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.deleteMenuItem(id);
      if (!deleted) return res.status(404).json({ error: 'Menu tidak ditemukan.' });
      res.json(deleted);
    } catch (err: any) {
      console.error('Delete menu error:', err);
      res.status(500).json({ error: 'Gagal menghapus menu.' });
    }
  });

  // ============================================
  // PROMO CRUD APIs
  // ============================================

  app.get('/api/promos', async (req, res) => {
    try {
      const promos = await db.getPromos();
      res.json(promos);
    } catch (err: any) {
      console.error('Get promos error:', err);
      res.status(500).json({ error: 'Gagal memuat promo.' });
    }
  });

  app.post('/api/promos', async (req, res) => {
    try {
      const promo = await db.createPromo({
        id: `pr_${Date.now()}`,
        ...req.body
      });
      res.json(promo);
    } catch (err: any) {
      console.error('Create promo error:', err);
      res.status(500).json({ error: 'Gagal menambah promo.' });
    }
  });

  app.put('/api/promos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updatePromo(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Promo tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update promo error:', err);
      res.status(500).json({ error: 'Gagal mengupdate promo.' });
    }
  });

  app.delete('/api/promos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.deletePromo(id);
      if (!deleted) return res.status(404).json({ error: 'Promo tidak ditemukan.' });
      res.json(deleted);
    } catch (err: any) {
      console.error('Delete promo error:', err);
      res.status(500).json({ error: 'Gagal menghapus promo.' });
    }
  });

  // ============================================
  // BRANCH CRUD APIs
  // ============================================

  app.get('/api/branches', async (req, res) => {
    try {
      const branches = await db.getBranches();
      res.json(branches);
    } catch (err: any) {
      console.error('Get branches error:', err);
      res.status(500).json({ error: 'Gagal memuat cabang.' });
    }
  });

  app.post('/api/branches', async (req, res) => {
    try {
      const branch = await db.createBranch({
        id: `br_${Date.now()}`,
        ...req.body
      });
      res.json(branch);
    } catch (err: any) {
      console.error('Create branch error:', err);
      res.status(500).json({ error: 'Gagal menambah cabang.' });
    }
  });

  app.put('/api/branches/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateBranch(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Cabang tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update branch error:', err);
      res.status(500).json({ error: 'Gagal mengupdate cabang.' });
    }
  });

  app.delete('/api/branches/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await db.deleteBranch(id);
      if (!deleted) return res.status(404).json({ error: 'Cabang tidak ditemukan.' });
      res.json(deleted);
    } catch (err: any) {
      console.error('Delete branch error:', err);
      res.status(500).json({ error: 'Gagal menghapus cabang.' });
    }
  });

  // ============================================
  // RESERVATION APIs
  // ============================================

  app.get('/api/reservations', async (req, res) => {
    try {
      const reservations = await db.getReservations();
      res.json(reservations);
    } catch (err: any) {
      console.error('Get reservations error:', err);
      res.status(500).json({ error: 'Gagal memuat reservasi.' });
    }
  });

  app.post('/api/reservations', async (req, res) => {
    try {
      const reservation = await db.createReservation({
        id: `res_${Date.now()}`,
        status: 'pending',
        ...req.body
      });
      res.json(reservation);
    } catch (err: any) {
      console.error('Create reservation error:', err);
      res.status(500).json({ error: 'Gagal membuat reservasi.' });
    }
  });

  app.put('/api/reservations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateReservation(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Reservasi tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update reservation error:', err);
      res.status(500).json({ error: 'Gagal mengupdate reservasi.' });
    }
  });

  // ============================================
  // ORDER APIs
  // ============================================

  app.get('/api/orders', async (req, res) => {
    try {
      const orders = await db.getOrders();
      res.json(orders);
    } catch (err: any) {
      console.error('Get orders error:', err);
      res.status(500).json({ error: 'Gagal memuat pesanan.' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const order = await db.createOrder({
        id: `ord_${Date.now()}`,
        status: 'pending',
        ...req.body
      });
      res.json(order);
    } catch (err: any) {
      console.error('Create order error:', err);
      res.status(500).json({ error: 'Gagal membuat pesanan.' });
    }
  });

  app.put('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateOrder(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update order error:', err);
      res.status(500).json({ error: 'Gagal mengupdate pesanan.' });
    }
  });

  // ============================================
  // REVIEW APIs
  // ============================================

  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await db.getReviews();
      res.json(reviews);
    } catch (err: any) {
      console.error('Get reviews error:', err);
      res.status(500).json({ error: 'Gagal memuat ulasan.' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const review = await db.createReview({
        id: `rv_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...req.body
      });

      // Recompute average rating for the menu item
      if (review.menuId) {
        await db.recalcMenuRating(review.menuId);
      }

      res.json(review);
    } catch (err: any) {
      console.error('Create review error:', err);
      res.status(500).json({ error: 'Gagal menambah ulasan.' });
    }
  });

  // ============================================
  // CONTACT MESSAGE APIs
  // ============================================

  app.get('/api/contact', async (req, res) => {
    try {
      const messages = await db.getContactMessages();
      res.json(messages);
    } catch (err: any) {
      console.error('Get contact error:', err);
      res.status(500).json({ error: 'Gagal memuat pesan.' });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const msg = await db.createContactMessage({
        id: `msg_${Date.now()}`,
        status: 'unread',
        ...req.body
      });
      res.json(msg);
    } catch (err: any) {
      console.error('Create contact error:', err);
      res.status(500).json({ error: 'Gagal mengirim pesan.' });
    }
  });

  app.put('/api/contact/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateContactMessage(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
      res.json(updated);
    } catch (err: any) {
      console.error('Update contact error:', err);
      res.status(500).json({ error: 'Gagal mengupdate pesan.' });
    }
  });

  // ============================================
  // REPORT APIs (Aggregated from PostgreSQL)
  // ============================================

  app.get('/api/reports', async (req, res) => {
    try {
      const reports = await db.getReports();
      res.json(reports);
    } catch (err: any) {
      console.error('Get reports error:', err);
      res.status(500).json({ error: 'Gagal memuat laporan.' });
    }
  });

  // ============================================
  // GEMINI AI CHATBOT API
  // ============================================

  app.post('/api/gemini/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Pesan wajib diisi.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return a warm, helpful Grandma-like fallback message if API key is not configured
      return res.json({
        text: `Halo Sayang! Eyang sangat senang kamu mampir ke website AyamEyang. \n\nMaaf ya, saat ini "Asisten Eyang AI" sedang istirahat sejenak (kunci API belum diatur). Tapi tenang saja, kamu tetap bisa menjelajahi menu-menu lezat warisan keluarga Eyang, memesan hidangan favoritmu secara online, atau melakukan reservasi meja di halaman reservasi. \n\nSaran Eyang, cobalah **Ayam Goreng Kremes Eyang** atau **Ayam Bakar Bumbu Rujak** yang bumbunya meresap sampai ke tulang! Ada yang bisa Eyang bantu lainnya, Sayang?`
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const menuItems = await db.getMenuItems();
      const branches = await db.getBranches();
      const promos = await db.getPromos();

      const menuListSummary = menuItems
        .filter(m => m.isAvailable)
        .map(m => `- ${m.name} (${m.category}): Rp ${m.price.toLocaleString('id-ID')} - ${m.description}`)
        .join('\n');

      const branchesSummary = branches
        .map(b => `- ${b.name}: ${b.address} (Telp: ${b.phone})`)
        .join('\n');

      const promosSummary = promos
        .filter(p => p.isAvailable)
        .map(p => `- Kode: ${p.code} (${p.title}): diskon ${p.discountPercent}% dengan minimal belanja Rp ${p.minPurchase.toLocaleString('id-ID')}`)
        .join('\n');

      const systemInstruction = `
Kamu adalah "Eyang AI", asisten kecerdasan buatan resmi berbentuk nenek yang sangat hangat, ramah, lemah lembut, penuh kasih sayang, dan profesional dari restoran modern "AyamEyang".
Gunakan bahasa Indonesia yang sangat sopan dan penuh kehangatan khas seorang nenek yang menyayangi cucunya (misal menyapa pengguna dengan sebutan "Sayang" atau "Cucu Eyang").
Tugasmu adalah membantu pelanggan mengerti tentang restoran AyamEyang, merekomendasikan menu, memberikan info promo, dan menjelaskan cara pemesanan atau reservasi.

JANGAN PERNAH MENGGUNAKAN EMOJI SAMA SEKALI dalam jawabanmu. Gunakan tanda baca atau format teks tebal (markdown) untuk menekankan bagian penting.

Berikut adalah informasi resmi restoran AyamEyang yang WAJIB kamu gunakan untuk menjawab pertanyaan pelanggan:

TENTANG RESTORAN:
AyamEyang menyajikan masakan ayam resep rahasia warisan turun-temurun dari Eyang tercinta sejak puluhan tahun lalu yang diolah dengan konsep modern, luxury, minimalis, dan cita rasa yang sangat kaya akan rempah Nusantara. Cita rasa hangat, lezat, premium, dan higienis.

DAFTAR MENU AKTIF:
${menuListSummary}

DAFTAR CABANG AKTIF:
${branchesSummary}

PROMO BERLAKU:
${promosSummary}

CARA MEMESAN MAKANAN:
Pelanggan tinggal masuk ke halaman "Menu", memilih hidangan kesukaan mereka, menambahkannya ke "Keranjang", lalu melakukan "Checkout" untuk mengisi alamat pengiriman dan menyelesaikan pembayaran (mendukung Transfer, Tunai, atau Midtrans).

CARA RESERVASI MEJA:
Masuk ke halaman "Reservasi", isi detail nama, jumlah tamu, tanggal, jam, dan permohonan khusus. Sistem kami akan segera mencatat meja kosong terbaik untuk Anda.

Jika ditanya di luar konteks restoran AyamEyang, arahkan kembali dengan lembut bahwa fokusmu adalah melayani pelanggan setia AyamEyang.
`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in Gemini Chat API:', error);
      res.status(500).json({ error: 'Eyang sedang sibuk meracik bumbu rahasia di dapur (kesalahan server).' });
    }
  });

  // ============================================
  // VITE DEV SERVER / PRODUCTION STATIC
  // ============================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍗 AyamEyang server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
