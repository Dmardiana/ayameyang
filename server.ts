/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { loadDB, saveDB } from './server-db';
import { MenuItem, Promo, Branch, Reservation, Order, User, Review, ContactMessage } from './src/types';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // API endpoints FIRST

  // Auth APIs
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = loadDB();
    
    // Simple mock auth
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Email atau kata sandi salah.' });
    }

    // Accept simple password equals to role or generic password
    if (user.role === 'admin' && password !== 'admin') {
      return res.status(401).json({ error: 'Kata sandi admin salah. Gunakan: "admin"' });
    }
    if (user.role === 'customer' && password !== 'customer' && password !== 'rahasia' && password !== '123') {
      return res.status(401).json({ error: 'Kata sandi salah. Gunakan: "customer" atau daftarkan akun baru.' });
    }

    return res.json({ user });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nama dan email wajib diisi.' });
    }

    const db = loadDB();
    const existing = db.users.find(u => u.email === email);
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name,
      role: 'customer',
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    return res.json({ user: newUser });
  });

  // Menu CRUD APIs
  app.get('/api/menu', (req, res) => {
    const db = loadDB();
    res.json(db.menu);
  });

  app.post('/api/menu', (req, res) => {
    const db = loadDB();
    const item: MenuItem = {
      id: `mn_${Date.now()}`,
      rating: 5.0,
      soldCount: 0,
      ...req.body
    };
    db.menu.unshift(item);
    saveDB(db);
    res.json(item);
  });

  app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.menu.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Menu tidak ditemukan.' });

    db.menu[index] = { ...db.menu[index], ...req.body };
    saveDB(db);
    res.json(db.menu[index]);
  });

  app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.menu.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Menu tidak ditemukan.' });

    const deleted = db.menu.splice(index, 1);
    saveDB(db);
    res.json(deleted[0]);
  });

  // Promo CRUD APIs
  app.get('/api/promos', (req, res) => {
    const db = loadDB();
    res.json(db.promos);
  });

  app.post('/api/promos', (req, res) => {
    const db = loadDB();
    const promo: Promo = {
      id: `pr_${Date.now()}`,
      ...req.body
    };
    db.promos.unshift(promo);
    saveDB(db);
    res.json(promo);
  });

  app.put('/api/promos/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.promos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Promo tidak ditemukan.' });

    db.promos[index] = { ...db.promos[index], ...req.body };
    saveDB(db);
    res.json(db.promos[index]);
  });

  app.delete('/api/promos/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.promos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Promo tidak ditemukan.' });

    const deleted = db.promos.splice(index, 1);
    saveDB(db);
    res.json(deleted[0]);
  });

  // Branch CRUD APIs
  app.get('/api/branches', (req, res) => {
    const db = loadDB();
    res.json(db.branches);
  });

  app.post('/api/branches', (req, res) => {
    const db = loadDB();
    const branch: Branch = {
      id: `br_${Date.now()}`,
      ...req.body
    };
    db.branches.push(branch);
    saveDB(db);
    res.json(branch);
  });

  app.put('/api/branches/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.branches.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cabang tidak ditemukan.' });

    db.branches[index] = { ...db.branches[index], ...req.body };
    saveDB(db);
    res.json(db.branches[index]);
  });

  app.delete('/api/branches/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.branches.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ error: 'Cabang tidak ditemukan.' });

    const deleted = db.branches.splice(index, 1);
    saveDB(db);
    res.json(deleted[0]);
  });

  // Reservations APIs
  app.get('/api/reservations', (req, res) => {
    const db = loadDB();
    res.json(db.reservations);
  });

  app.post('/api/reservations', (req, res) => {
    const db = loadDB();
    const reservation: Reservation = {
      id: `res_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.reservations.unshift(reservation);
    saveDB(db);
    res.json(reservation);
  });

  app.put('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.reservations.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Reservasi tidak ditemukan.' });

    db.reservations[index] = { ...db.reservations[index], ...req.body };
    saveDB(db);
    res.json(db.reservations[index]);
  });

  // Orders APIs
  app.get('/api/orders', (req, res) => {
    const db = loadDB();
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const db = loadDB();
    const order: Order = {
      id: `ord_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req.body
    };

    // Update sold counts for menu items in order
    order.items.forEach(item => {
      const menuItem = db.menu.find(m => m.id === item.menuItemId);
      if (menuItem) {
        menuItem.soldCount += item.quantity;
      }
    });

    db.orders.unshift(order);
    saveDB(db);
    res.json(order);
  });

  app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });

    db.orders[index] = { ...db.orders[index], ...req.body };
    saveDB(db);
    res.json(db.orders[index]);
  });

  // Reviews APIs
  app.get('/api/reviews', (req, res) => {
    const db = loadDB();
    res.json(db.reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const db = loadDB();
    const review: Review = {
      id: `rv_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...req.body
    };

    db.reviews.unshift(review);

    // Recompute average rating for the menu item
    const menuItem = db.menu.find(m => m.id === review.menuId);
    if (menuItem) {
      const menuReviews = db.reviews.filter(r => r.menuId === review.menuId);
      const totalRating = menuReviews.reduce((sum, r) => sum + r.rating, 0);
      menuItem.rating = parseFloat((totalRating / menuReviews.length).toFixed(1));
    }

    saveDB(db);
    res.json(review);
  });

  // Contact Message API
  app.post('/api/contact', (req, res) => {
    const db = loadDB();
    const msg: ContactMessage = {
      id: `msg_${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.contactMessages.unshift(msg);
    saveDB(db);
    res.json(msg);
  });

  app.get('/api/contact', (req, res) => {
    const db = loadDB();
    res.json(db.contactMessages);
  });

  app.put('/api/contact/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const index = db.contactMessages.findIndex(m => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Pesan tidak ditemukan.' });

    db.contactMessages[index] = { ...db.contactMessages[index], ...req.body };
    saveDB(db);
    res.json(db.contactMessages[index]);
  });

  // Report APIs
  app.get('/api/reports', (req, res) => {
    const db = loadDB();
    
    // 1. Total Sales & Orders
    const completedOrders = db.orders.filter(o => o.status === 'completed');
    const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = db.orders.length;
    
    // 2. Counts
    const activeReservationsCount = db.reservations.filter(r => r.status === 'confirmed').length;
    const pendingOrdersCount = db.orders.filter(o => o.status === 'pending').length;
    const menuCount = db.menu.length;

    // 3. Category Sales Data
    const categoryRevenue: Record<string, number> = { makanan: 0, minuman: 0, dessert: 0 };
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        // Find category
        const menuItem = db.menu.find(m => m.id === item.menuItemId);
        const category = menuItem ? menuItem.category : 'makanan';
        categoryRevenue[category] += item.price * item.quantity;
      });
    });

    // 4. Sales Trends (simulate monthly/daily from orders)
    // Group completed orders by date (last 7 days or similar)
    const dailySales: Record<string, number> = {};
    completedOrders.forEach(o => {
      const date = o.createdAt.split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + o.totalAmount;
    });

    // 5. Best Seller Menu Items
    const sortedMenu = [...db.menu].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
    const bestSellers = sortedMenu.map(m => ({
      name: m.name,
      sold: m.soldCount,
      revenue: m.soldCount * m.price,
      image: m.image
    }));

    res.json({
      summary: {
        totalSales,
        orderCount,
        completedOrderCount: completedOrders.length,
        activeReservationsCount,
        pendingOrdersCount,
        menuCount,
      },
      categoryRevenue,
      dailySales: Object.entries(dailySales).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date)).slice(-10),
      bestSellers
    });
  });

  // Gemini AI Chatbot API
  app.post('/api/gemini/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Pesan wajib diisi.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a warm, helpful Grandma-like fallback message if API key is not configured
      return res.json({
        text: `Halo Sayang! Eyang sangat senang kamu mampir ke website AyamEyang. \n\nMaaf ya, saat ini "Asisten Eyang AI" sedang istirahat sejenak (kunci API belum diatur). Tapi tenang saja, kamu tetap bisa menjelajahi menu-menu lezat warisan keluarga Eyang, memesan hidangan favoritmu secara online, atau melakukan reservasi meja di halaman reservasi. \n\nSaran Eyang, cobalah **Ayam Goreng Kremes Eyang** atau **Ayam Bakar Bumbu Rujak** yang bumbunya meresap sampai ke tulang! Ada yang bisa Eyang bantu lainnya, Sayang?`
      });
    }

    try {
      // Lazy initialization of Gemini client as requested in the Guidelines
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const db = loadDB();
      const menuListSummary = db.menu
        .filter(m => m.isAvailable)
        .map(m => `- ${m.name} (${m.category}): Rp ${m.price.toLocaleString('id-ID')} - ${m.description}`)
        .join('\n');

      const branchesSummary = db.branches
        .map(b => `- ${b.name}: ${b.address} (Telp: ${b.phone})`)
        .join('\n');

      const promosSummary = db.promos
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

      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach(h => {
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

  // Serve Vite assets in development
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
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
