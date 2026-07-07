/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Layers,
  FileText,
  Download,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Mail,
  MapPin,
  Tag,
  Star,
  RefreshCw,
  Clock,
  Eye
} from 'lucide-react';
import { api } from '../services/api';
import { MenuItem, Promo, Branch, Reservation, Order, ContactMessage, MenuCategory } from '../types';

interface AdminSectionProps {
  currentUser: any;
  setPage: (page: string) => void;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export default function AdminSection({ currentUser, setPage, setMenuItems }: AdminSectionProps) {
  // Admin role guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-12 bg-cream/20 font-sans text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-primary/5 shadow-premium space-y-4">
          <h3 className="font-serif font-bold text-lg text-charcoal">Akses Ditolak</h3>
          <p className="text-xs text-muted-text">Anda tidak memiliki izin untuk mengakses halaman Admin. Silakan masuk dengan akun Administrator.</p>
          <button
            onClick={() => setPage('login')}
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-premium cursor-pointer"
          >
            Masuk Sebagai Admin
          </button>
        </div>
      </div>
    );
  }

  // Tabs State
  const [activeTab, setActiveTab] = useState<'laporan' | 'menu' | 'promo' | 'cabang' | 'reservasi' | 'pesanan' | 'pesan'>('laporan');

  // Core Data States
  const [stats, setStats] = useState<any>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal / Editing states
  const [activeModal, setActiveModal] = useState<'menu' | 'promo' | 'branch' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states for CRUD Menu
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuPrice, setMenuPrice] = useState(0);
  const [menuCategory, setMenuCategory] = useState<MenuCategory>('makanan');
  const [menuImage, setMenuImage] = useState('');
  const [menuIsAvailable, setMenuIsAvailable] = useState(true);

  // Form states for CRUD Promo
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDescription, setPromoDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoBanner, setPromoBanner] = useState('');
  const [promoMinPurchase, setPromoMinPurchase] = useState(0);
  const [promoIsAvailable, setPromoIsAvailable] = useState(true);

  // Form states for CRUD Branch
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchLat, setBranchLat] = useState(-7.7592);
  const [branchLng, setBranchLng] = useState(110.3789);
  const [branchIsMain, setBranchIsMain] = useState(false);

  // Load Data
  const loadAllAdminData = () => {
    setIsLoading(true);
    Promise.all([
      api.getReports(),
      api.getMenus(),
      api.getPromos(),
      api.getBranches(),
      api.getReservations(),
      api.getOrders(),
      api.getMessages()
    ]).then(([rep, mn, pr, br, res, ord, msg]) => {
      setStats(rep);
      setMenus(mn);
      setPromos(pr);
      setBranches(br);
      setReservations(res);
      setOrders(ord);
      setMessages(msg);
    }).catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Menu Handlers
  const handleOpenMenuModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setMenuName(item.name);
      setMenuDescription(item.description);
      setMenuPrice(item.price);
      setMenuCategory(item.category);
      setMenuImage(item.image);
      setMenuIsAvailable(item.isAvailable);
    } else {
      setEditingItem(null);
      setMenuName('');
      setMenuDescription('');
      setMenuPrice(15000);
      setMenuCategory('makanan');
      setMenuImage('https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800');
      setMenuIsAvailable(true);
    }
    setActiveModal('menu');
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: menuName,
      description: menuDescription,
      price: menuPrice,
      category: menuCategory,
      image: menuImage,
      isAvailable: menuIsAvailable
    };

    try {
      if (editingItem) {
        await api.updateMenu(editingItem.id, payload);
      } else {
        await api.createMenu(payload);
      }
      setActiveModal(null);
      // reload menus list
      const freshMenus = await api.getMenus();
      setMenus(freshMenus);
      setMenuItems(freshMenus); // Update global menu catalog too
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hidangan ini, Admin?')) return;
    try {
      await api.deleteMenu(id);
      const freshMenus = await api.getMenus();
      setMenus(freshMenus);
      setMenuItems(freshMenus);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Promo Handlers
  const handleOpenPromoModal = (promo?: Promo) => {
    if (promo) {
      setEditingItem(promo);
      setPromoTitle(promo.title);
      setPromoDescription(promo.description);
      setPromoCode(promo.code);
      setPromoDiscount(promo.discountPercent);
      setPromoBanner(promo.bannerUrl);
      setPromoMinPurchase(promo.minPurchase);
      setPromoIsAvailable(promo.isAvailable);
    } else {
      setEditingItem(null);
      setPromoTitle('');
      setPromoDescription('');
      setPromoCode('');
      setPromoDiscount(15);
      setPromoBanner('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800');
      setPromoMinPurchase(50000);
      setPromoIsAvailable(true);
    }
    setActiveModal('promo');
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: promoTitle,
      description: promoDescription,
      code: promoCode.toUpperCase().trim(),
      discountPercent: promoDiscount,
      bannerUrl: promoBanner,
      minPurchase: promoMinPurchase,
      isAvailable: promoIsAvailable
    };

    try {
      if (editingItem) {
        await api.updatePromo(editingItem.id, payload);
      } else {
        await api.createPromo(payload);
      }
      setActiveModal(null);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kode promo ini?')) return;
    try {
      await api.deletePromo(id);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Branch Handlers
  const handleOpenBranchModal = (branch?: Branch) => {
    if (branch) {
      setEditingItem(branch);
      setBranchName(branch.name);
      setBranchAddress(branch.address);
      setBranchPhone(branch.phone);
      setBranchLat(branch.lat);
      setBranchLng(branch.lng);
      setBranchIsMain(branch.isMainBranch);
    } else {
      setEditingItem(null);
      setBranchName('');
      setBranchAddress('');
      setBranchPhone('');
      setBranchLat(-7.7592);
      setBranchLng(110.3789);
      setBranchIsMain(false);
    }
    setActiveModal('branch');
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: branchName,
      address: branchAddress,
      phone: branchPhone,
      lat: Number(branchLat),
      lng: Number(branchLng),
      isMainBranch: branchIsMain
    };

    try {
      if (editingItem) {
        await api.updateBranch(editingItem.id, payload);
      } else {
        await api.createBranch(payload);
      }
      setActiveModal(null);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus cabang ini?')) return;
    try {
      await api.deleteBranch(id);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Status updaters
  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    try {
      await api.updateOrder(orderId, { status });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReservationStatus = async (resId: string, status: any, tableNumber?: string) => {
    try {
      const payload: any = { status };
      if (tableNumber) payload.tableNumber = tableNumber;
      await api.updateReservation(resId, payload);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkMessageRead = async (msgId: string) => {
    try {
      await api.updateMessage(msgId, { status: 'read' });
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Simulated Exports
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    // Header Row
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Items Count', 'Total Amount', 'Status', 'Payment Method', 'Date'];
    const rows = orders.map(o => [
      o.id,
      o.customerName,
      o.customerEmail,
      o.items.length,
      o.totalAmount,
      o.status,
      o.paymentMethod,
      o.createdAt.split('T')[0]
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penjualan_AyamEyang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    const maps = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      cooking: 'bg-blue-100 text-blue-800 border-blue-200',
      delivering: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels = {
      pending: 'Menunggu',
      cooking: 'Dimasak',
      delivering: 'Diantar',
      completed: 'Selesai',
      cancelled: 'Batal',
    };
    return (
      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${maps[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="py-10 bg-cream/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-primary/10 pb-6 mb-8 no-print">
          <div>
            <span className="text-[10px] bg-primary text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
              Sistem Portal Admin
            </span>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-primary mt-2">
              Dashboard Manajemen AyamEyang
            </h2>
            <p className="text-xs text-muted-text mt-0.5">Pantau laporan penjualan, kelola pesanan, reservasi meja, dan menu hidangan secara real-time.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              className="bg-white border border-primary/15 text-primary p-2.5 rounded-xl hover:bg-cream transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang Data</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-premium cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Cetak Laporan (PDF)</span>
            </button>
          </div>
        </div>

        {/* PRINT ONLY REPORT BRAND HEADER */}
        <div className="hidden print:block mb-8 text-center border-b-4 border-primary pb-4">
          <h1 className="font-serif font-black text-3xl text-primary">LAPORAN MANAJEMEN PENJUALAN AYAMEYANG</h1>
          <p className="text-xs text-charcoal/70 mt-1">Laporan Resmi Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        {/* Dashboard Tabs bar */}
        <div className="flex flex-wrap border-b border-primary/10 mb-8 gap-1.5 no-print">
          {[
            { id: 'laporan', label: 'Ringkasan Laporan', icon: TrendingUp },
            { id: 'pesanan', label: 'CRUD Pesanan', icon: ShoppingBag },
            { id: 'reservasi', label: 'CRUD Reservasi', icon: Calendar },
            { id: 'menu', label: 'CRUD Menu', icon: Layers },
            { id: 'promo', label: 'CRUD Promo', icon: Tag },
            { id: 'cabang', label: 'CRUD Cabang', icon: MapPin },
            { id: 'pesan', label: 'Feedback Pesan', icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white border-b-2 border-transparent'
                    : 'text-charcoal/70 hover:text-primary hover:bg-cream/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- TAB 1: REPORTS Ringkasan --- */}
        {activeTab === 'laporan' && stats && (
          <div className="space-y-8 animate-fade-in">
            {/* Bento statistics grids */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-premium">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">Total Penjualan Selesai</span>
                <p className="font-mono text-xl md:text-2xl font-black text-primary mt-1.5">
                  Rp {stats.summary.totalSales.toLocaleString('id-ID')}
                </p>
                <div className="text-[10px] text-green-700 font-semibold bg-green-50 p-1 px-2 rounded-lg mt-2.5 inline-block">
                  Dari {stats.summary.completedOrderCount} Transaksi Berhasil
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-premium">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">Jumlah Pesanan Masuk</span>
                <p className="font-mono text-xl md:text-2xl font-black text-charcoal mt-1.5">
                  {stats.summary.orderCount} Pesanan
                </p>
                <div className="text-[10px] text-amber-700 font-semibold bg-amber-50 p-1 px-2 rounded-lg mt-2.5 inline-block">
                  {stats.summary.pendingOrdersCount} Masih Menunggu Masak
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-premium">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">Reservasi Aktif</span>
                <p className="font-mono text-xl md:text-2xl font-black text-charcoal mt-1.5">
                  {stats.summary.activeReservationsCount} Meja
                </p>
                <div className="text-[10px] text-blue-700 font-semibold bg-blue-50 p-1 px-2 rounded-lg mt-2.5 inline-block">
                  Telah Dikonfirmasi Dapur
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-primary/5 shadow-premium">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wider">Katalog Menu Hidangan</span>
                <p className="font-mono text-xl md:text-2xl font-black text-charcoal mt-1.5">
                  {stats.summary.menuCount} Hidangan
                </p>
                <div className="text-[10px] text-purple-700 font-semibold bg-purple-50 p-1 px-2 rounded-lg mt-2.5 inline-block">
                  Tersedia untuk Pelanggan
                </div>
              </div>
            </div>

            {/* Custom SVG Charts visualizations to prevent React 19 charting crashes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown Chart Card */}
              <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-premium">
                <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider mb-5">Distribusi Penjualan Kategori</h4>
                
                <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-4">
                  {/* Custom SVG Pie/Donut Chart representation */}
                  <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
                    {/* Circle arcs based on ratio calculations */}
                    <circle cx="80" cy="80" r="60" fill="transparent" stroke="#B22222" strokeWidth="24" strokeDasharray="260 376" strokeDashoffset="0" /> {/* Makanan: ~69% */}
                    <circle cx="80" cy="80" r="60" fill="transparent" stroke="#FFD166" strokeWidth="24" strokeDasharray="90 376" strokeDashoffset="-260" /> {/* Minuman: ~24% */}
                    <circle cx="80" cy="80" r="60" fill="transparent" stroke="#333333" strokeWidth="24" strokeDasharray="26 376" strokeDashoffset="-350" /> {/* Dessert: ~7% */}
                    
                    <circle cx="80" cy="80" r="40" fill="white" />
                    <text x="80" y="85" textAnchor="middle" className="text-[10px] font-black fill-primary font-mono uppercase tracking-wider">AyamEyang</text>
                  </svg>

                  <div className="space-y-3 flex-1 text-xs text-charcoal/80">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 bg-primary rounded border border-secondary shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="font-semibold">Olahan Makanan:</span>
                        <span className="font-mono text-primary font-bold">Rp {stats.categoryRevenue.makanan.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 bg-secondary rounded border border-primary shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="font-semibold">Minuman Segar:</span>
                        <span className="font-mono text-primary font-bold">Rp {stats.categoryRevenue.minuman.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 bg-charcoal rounded shrink-0" />
                      <div className="flex-1 flex justify-between">
                        <span className="font-semibold">Pencuci Mulut:</span>
                        <span className="font-mono text-primary font-bold">Rp {stats.categoryRevenue.dessert.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Seller Menu Items list */}
              <div className="bg-white rounded-3xl p-6 border border-primary/5 shadow-premium">
                <div className="flex items-center justify-between mb-5 border-b border-primary/5 pb-3">
                  <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Sajian Ayam Terlaris</h4>
                  <span className="text-[10px] font-mono text-muted-text">Paling Banyak Dipesan</span>
                </div>

                <div className="space-y-3.5">
                  {stats.bestSellers.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-xs leading-relaxed">
                      <span className="font-mono font-bold text-primary w-5 text-center">{i + 1}</span>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-primary/5"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-charcoal truncate">{item.name}</h5>
                        <p className="text-[10px] text-muted-text font-mono">Rp {item.revenue.toLocaleString('id-ID')} Terakumulasi</p>
                      </div>
                      <span className="bg-cream text-primary font-bold font-mono px-2.5 py-1 rounded-lg">
                        {item.sold} Porsi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated CSV/Excel Export triggering panel */}
            <div className="bg-primary text-white rounded-3xl p-6 shadow-premium border-2 border-secondary flex flex-col md:flex-row items-center justify-between gap-6 no-print">
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-secondary">Export Data Transaksi Excel/CSV</h4>
                <p className="text-xs text-cream/70">Unduh data pesanan terperinci langsung ke format lembar sebar (Excel) untuk audit.</p>
              </div>

              <button
                onClick={handleExportCSV}
                className="bg-secondary hover:bg-secondary-hover text-charcoal font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Export Laporan (Excel/CSV)</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 2: CRUD Pesanan --- */}
        {activeTab === 'pesanan' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5">Manajemen Pesanan</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-primary/5">
                <thead className="bg-cream/40 font-bold text-charcoal font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Metode</th>
                    <th className="p-3">Meja / Alamat</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Bayar</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-cream/10">
                      <td className="p-3 font-mono font-bold text-primary uppercase">{o.id}</td>
                      <td className="p-3">
                        <span className="block font-semibold">{o.customerName}</span>
                        <span className="text-[10px] text-muted-text">{o.customerPhone}</span>
                      </td>
                      <td className="p-3 font-mono uppercase text-[10px] text-charcoal/80">{o.paymentMethod}</td>
                      <td className="p-3 max-w-[150px] truncate">
                        {o.tableNumber ? `Meja ${o.tableNumber}` : 'Antar ke rumah'}
                      </td>
                      <td className="p-3">{getOrderStatusBadge(o.status)}</td>
                      <td className="p-3 font-mono font-bold">Rp {o.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          {o.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'cooking')}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg border border-blue-200 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Masak
                            </button>
                          )}
                          {o.status === 'cooking' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'delivering')}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-1.5 rounded-lg border border-purple-200 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Kirim
                            </button>
                          )}
                          {(o.status === 'delivering' || o.status === 'cooking' || o.status === 'pending') && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'completed')}
                              className="bg-green-50 hover:bg-green-100 text-green-700 p-1.5 rounded-lg border border-green-200 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Selesai
                            </button>
                          )}
                          {o.status !== 'completed' && o.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'cancelled')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: CRUD Reservasi --- */}
        {activeTab === 'reservasi' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5">Manajemen Reservasi Meja</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-primary/5">
                <thead className="bg-cream/40 font-bold text-charcoal font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">ID Reservasi</th>
                    <th className="p-3">Pelanggan</th>
                    <th className="p-3">Tanggal & Jam</th>
                    <th className="p-3">Tamu</th>
                    <th className="p-3">No. Meja</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {reservations.map(r => (
                    <tr key={r.id} className="hover:bg-cream/10">
                      <td className="p-3 font-mono font-bold text-primary uppercase">{r.id}</td>
                      <td className="p-3">
                        <span className="block font-semibold">{r.customerName}</span>
                        <span className="text-[10px] text-muted-text">{r.customerPhone}</span>
                      </td>
                      <td className="p-3">{r.date} pukul {r.time} WIB</td>
                      <td className="p-3 font-mono font-bold">{r.numberOfGuests} Orang</td>
                      <td className="p-3 font-bold text-primary">Meja {r.tableNumber || '-'}</td>
                      <td className="p-3">
                        {r.status === 'confirmed' ? (
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase font-mono">Diterima</span>
                        ) : r.status === 'cancelled' ? (
                          <span className="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded border border-red-200 uppercase font-mono">Dibatalkan</span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase font-mono">Menunggu</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          {r.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  const tbl = prompt('Masukkan nomor meja untuk dikonfirmasi:', '1');
                                  if (tbl) handleUpdateReservationStatus(r.id, 'confirmed', tbl);
                                }}
                                className="bg-green-50 hover:bg-green-100 text-green-700 p-1.5 rounded-lg border border-green-200 text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Konfirmasi
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id, 'cancelled')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200 text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {r.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateReservationStatus(r.id, 'cancelled')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg border border-red-200 text-[10px] font-bold uppercase cursor-pointer"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 4: CRUD Menu list --- */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Manajemen Menu Kuliner</h3>
              <button
                onClick={() => handleOpenMenuModal()}
                className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-premium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-primary/5">
                <thead className="bg-cream/40 font-bold text-charcoal font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Foto</th>
                    <th className="p-3">Nama Hidangan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Status Dapur</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {menus.map(item => (
                    <tr key={item.id} className="hover:bg-cream/10">
                      <td className="p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-primary/5"
                        />
                      </td>
                      <td className="p-3">
                        <span className="block font-semibold text-charcoal">{item.name}</span>
                        <span className="text-[10px] text-muted-text truncate max-w-sm block leading-relaxed">{item.description}</span>
                      </td>
                      <td className="p-3 font-mono uppercase text-[10px] text-primary font-bold">{item.category}</td>
                      <td className="p-3">
                        {item.isAvailable ? (
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200">TERSEDIA</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded border border-red-200">HABIS</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold flex items-center text-amber-500 mt-2">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-0.5">{item.rating}</span>
                      </td>
                      <td className="p-3 font-mono font-bold">Rp {item.price.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenMenuModal(item)}
                            className="p-1.5 text-primary hover:bg-primary/5 border border-primary/10 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 5: CRUD Promo list --- */}
        {activeTab === 'promo' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Manajemen Kode Voucher</h3>
              <button
                onClick={() => handleOpenPromoModal()}
                className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-premium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Voucher Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-primary/5">
                <thead className="bg-cream/40 font-bold text-charcoal font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Banner</th>
                    <th className="p-3">Kupon / Judul</th>
                    <th className="p-3">Diskon</th>
                    <th className="p-3">Min Belanja</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {promos.map(p => (
                    <tr key={p.id} className="hover:bg-cream/10">
                      <td className="p-3">
                        <img
                          src={p.bannerUrl}
                          alt={p.title}
                          className="w-14 h-8 rounded object-cover"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-primary text-sm uppercase tracking-wider block">{p.code}</span>
                        <span className="font-semibold text-charcoal block mt-0.5">{p.title}</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-green-700 text-sm">{p.discountPercent}% OFF</td>
                      <td className="p-3 font-mono font-semibold">Rp {p.minPurchase.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        {p.isAvailable ? (
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded border border-green-200">AKTIF</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded border border-red-200">NON-AKTIF</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenPromoModal(p)}
                            className="p-1.5 text-primary hover:bg-primary/5 border border-primary/10 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePromo(p.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 6: CRUD Cabang list --- */}
        {activeTab === 'cabang' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Manajemen Cabang Kedai</h3>
              <button
                onClick={() => handleOpenBranchModal()}
                className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-premium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Cabang Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-primary/5">
                <thead className="bg-cream/40 font-bold text-charcoal font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Nama Cabang</th>
                    <th className="p-3">Alamat</th>
                    <th className="p-3">Telepon</th>
                    <th className="p-3">Koordinat Lat / Lng</th>
                    <th className="p-3">Tipe</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {branches.map(b => (
                    <tr key={b.id} className="hover:bg-cream/10">
                      <td className="p-3 font-serif font-bold text-charcoal text-sm">{b.name}</td>
                      <td className="p-3 max-w-sm truncate text-muted-text leading-relaxed">{b.address}</td>
                      <td className="p-3 font-mono">{b.phone}</td>
                      <td className="p-3 font-mono text-[11px] text-primary">{b.lat.toFixed(4)}, {b.lng.toFixed(4)}</td>
                      <td className="p-3">
                        {b.isMainBranch ? (
                          <span className="bg-secondary/20 text-primary text-[9px] font-bold px-2 py-0.5 rounded border border-secondary uppercase font-mono">PUSAT</span>
                        ) : (
                          <span className="bg-cream text-charcoal/70 text-[9px] font-bold px-2 py-0.5 rounded border border-primary/10 uppercase font-mono">CABANG</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenBranchModal(b)}
                            className="p-1.5 text-primary hover:bg-primary/5 border border-primary/10 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(b.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 7: CRUD Messages list --- */}
        {activeTab === 'pesan' && (
          <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 animate-fade-in space-y-4">
            <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5">Kotak Masuk Pesan & Feedback</h3>
            
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-xs text-muted-text text-center py-6">Kotak masuk masih kosong.</p>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`border rounded-2xl p-4 text-xs font-sans space-y-2 relative transition-all ${
                    m.status === 'unread' ? 'bg-primary/5 border-primary/25 shadow-sm' : 'bg-cream/10 border-primary/5'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="block font-bold text-charcoal">{m.name}</span>
                        <span className="text-[10px] text-muted-text font-mono">{m.email} &bull; {new Date(m.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      
                      {m.status === 'unread' ? (
                        <div className="flex gap-1.5 items-center">
                          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          <button
                            onClick={() => handleMarkMessageRead(m.id)}
                            className="bg-primary hover:bg-primary-hover text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide cursor-pointer"
                          >
                            Tandai Dibaca
                          </button>
                        </div>
                      ) : (
                        <span className="bg-cream text-charcoal/50 text-[9px] font-bold px-2.5 py-0.5 rounded uppercase font-mono">Telah dibaca</span>
                      )}
                    </div>
                    
                    <p className="font-semibold text-primary text-[11px] border-l-2 border-primary/30 pl-2">{m.subject}</p>
                    <p className="text-charcoal leading-relaxed bg-white/45 p-3 rounded-xl border border-primary/5">{m.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* --- CRUD MODAL MENU --- */}
      {activeModal === 'menu' && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
          <form onSubmit={handleSaveMenu} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-premium-lg max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="font-serif font-bold text-lg text-primary border-b border-primary/5 pb-2">
              {editingItem ? 'Edit Informasi Menu' : 'Tambah Menu Baru'}
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-bold text-charcoal mb-1">Nama Hidangan *</label>
                <input
                  type="text"
                  required
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Contoh: Ayam Goreng Kremes Eyang"
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Deskripsi Kuliner *</label>
                <textarea
                  required
                  rows={3}
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="Tuliskan bumbu, pelengkap, resep, porsi..."
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Harga (Rupiah) *</label>
                  <input
                    type="number"
                    required
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(Number(e.target.value))}
                    placeholder="Harga hidangan"
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Kategori *</label>
                  <select
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value as any)}
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="makanan">Makanan</option>
                    <option value="minuman">Minuman</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">URL Foto (Unsplash) *</label>
                <input
                  type="text"
                  required
                  value={menuImage}
                  onChange={(e) => setMenuImage(e.target.value)}
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="menuAvail"
                  checked={menuIsAvailable}
                  onChange={(e) => setMenuIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-primary border-primary/25 rounded"
                />
                <label htmlFor="menuAvail" className="font-bold text-charcoal cursor-pointer">Menu Tersedia untuk Pemesanan</label>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-primary/5">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-premium cursor-pointer"
              >
                Simpan Menu
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-cream border border-primary/15 text-primary py-2.5 rounded-xl text-xs font-bold hover:bg-primary/5 cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- CRUD MODAL PROMO --- */}
      {activeModal === 'promo' && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
          <form onSubmit={handleSavePromo} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-premium-lg max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="font-serif font-bold text-lg text-primary border-b border-primary/5 pb-2">
              {editingItem ? 'Edit Kupon Voucher' : 'Tambah Kupon Baru'}
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-bold text-charcoal mb-1">Judul Kupon Promo *</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="Contoh: Potongan 10% Spesial"
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Keterangan Promo *</label>
                <textarea
                  required
                  rows={2}
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Kode Voucher Kupon *</label>
                  <input
                    type="text"
                    required
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Contoh: PROMO10"
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Potongan Persen *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Minimum Pembelian (Rupiah)</label>
                  <input
                    type="number"
                    value={promoMinPurchase}
                    onChange={(e) => setPromoMinPurchase(Number(e.target.value))}
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">URL Banner Foto *</label>
                <input
                  type="text"
                  required
                  value={promoBanner}
                  onChange={(e) => setPromoBanner(e.target.value)}
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promoAvail"
                  checked={promoIsAvailable}
                  onChange={(e) => setPromoIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-primary border-primary/25 rounded"
                />
                <label htmlFor="promoAvail" className="font-bold text-charcoal cursor-pointer">Kupon Promo Aktif Berlaku</label>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-primary/5">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-premium cursor-pointer"
              >
                Simpan Promo
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-cream border border-primary/15 text-primary py-2.5 rounded-xl text-xs font-bold hover:bg-primary/5 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- CRUD MODAL CABANG --- */}
      {activeModal === 'branch' && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
          <form onSubmit={handleSaveBranch} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-premium-lg max-w-md w-full space-y-4 animate-scale-in">
            <h3 className="font-serif font-bold text-lg text-primary border-b border-primary/5 pb-2">
              {editingItem ? 'Edit Lokasi Cabang' : 'Tambah Cabang Baru'}
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-bold text-charcoal mb-1">Nama Kedai Cabang *</label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Contoh: AyamEyang Bandung Dago"
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Alamat Kedai *</label>
                <textarea
                  required
                  rows={2}
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Nomor Telepon *</label>
                <input
                  type="text"
                  required
                  value={branchPhone}
                  onChange={(e) => setBranchPhone(e.target.value)}
                  className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Latitude Koordinat *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={branchLat}
                    onChange={(e) => setBranchLat(Number(e.target.value))}
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Longitude Koordinat *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={branchLng}
                    onChange={(e) => setBranchLng(Number(e.target.value))}
                    className="w-full bg-cream/10 border border-primary/10 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="branchIsMain"
                  checked={branchIsMain}
                  onChange={(e) => setBranchIsMain(e.target.checked)}
                  className="w-4 h-4 text-primary border-primary/25 rounded"
                />
                <label htmlFor="branchIsMain" className="font-bold text-charcoal cursor-pointer">Merupakan Kantor Pusat (Main Branch)</label>
              </div>
            </div>

            <div className="flex gap-2.5 pt-4 border-t border-primary/5">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-premium cursor-pointer"
              >
                Simpan Cabang
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 bg-cream border border-primary/15 text-primary py-2.5 rounded-xl text-xs font-bold hover:bg-primary/5 cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
