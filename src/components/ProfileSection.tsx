/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Phone, Mail, Clock, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Order, User } from '../types';

interface ProfileSectionProps {
  currentUser: User | null;
  setPage: (page: string) => void;
}

export default function ProfileSection({ currentUser, setPage }: ProfileSectionProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMyOrderHistory = () => {
    if (!currentUser) return;
    setIsLoading(true);
    api.getOrders()
      .then(all => {
        // filter orders by user email or userId
        const filtered = all.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email);
        setOrders(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMyOrderHistory();
  }, [currentUser]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini, Sayang?')) return;
    try {
      await api.updateOrder(orderId, { status: 'cancelled' });
      loadMyOrderHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    if (status === 'completed') return 'text-green-700 bg-green-50 border-green-200';
    if (status === 'cancelled') return 'text-red-700 bg-red-50 border-red-200';
    if (status === 'cooking') return 'text-blue-700 bg-blue-50 border-blue-200';
    if (status === 'delivering') return 'text-purple-700 bg-purple-50 border-purple-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const getStatusLabel = (status: Order['status']) => {
    if (status === 'completed') return 'Selesai';
    if (status === 'cancelled') return 'Dibatalkan';
    if (status === 'cooking') return 'Dimasak';
    if (status === 'delivering') return 'Diantar';
    return 'Menunggu';
  };

  if (!currentUser) {
    return (
      <div className="py-12 bg-cream/20 font-sans text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-primary/5 shadow-premium space-y-4">
          <h3 className="font-serif font-bold text-lg text-charcoal">Silakan Masuk Terlebih Dahulu</h3>
          <p className="text-xs text-muted-text">Anda perlu masuk ke akun Anda untuk menelusuri profil dan melacak riwayat transaksi kuliner Anda.</p>
          <button
            onClick={() => setPage('login')}
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-premium cursor-pointer"
          >
            Masuk Akun
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="bg-primary text-white rounded-3xl p-6 md:p-8 shadow-premium border-2 border-secondary relative overflow-hidden mb-8">
          <div className="absolute right-0 bottom-0 opacity-10 font-serif text-9xl translate-x-10 translate-y-10 pointer-events-none">
            AE
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-cream text-primary border-3 border-secondary flex items-center justify-center font-serif font-black text-3xl shadow-md shrink-0">
              {currentUser.name[0]}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-serif font-black text-xl md:text-2xl text-secondary">{currentUser.name}</h3>
              <p className="text-xs text-cream/85 font-mono uppercase tracking-wider">Keluarga Setia AyamEyang</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-cream/70 pt-1 font-sans justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-secondary" /> {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-secondary" /> {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details & Orders history grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Personal info */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-4">
            <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-2 border-b border-primary/5">Informasi Akun</h4>
            
            <div className="text-xs space-y-3 font-sans">
              <div>
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wide block">Alamat Email</span>
                <p className="text-charcoal font-semibold">{currentUser.email}</p>
              </div>
              {currentUser.phone && (
                <div>
                  <span className="text-[10px] text-muted-text uppercase font-bold tracking-wide block">No Handphone</span>
                  <p className="text-charcoal font-semibold font-mono">{currentUser.phone}</p>
                </div>
              )}
              {currentUser.address && (
                <div>
                  <span className="text-[10px] text-muted-text uppercase font-bold tracking-wide block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Alamat Pengiriman Default</span>
                  </span>
                  <p className="text-charcoal font-semibold mt-1 leading-relaxed">{currentUser.address}</p>
                </div>
              )}
              <div className="pt-2 border-t border-primary/5">
                <span className="text-[10px] text-muted-text uppercase font-bold tracking-wide block">Hak Akses</span>
                <span className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mt-1.5 inline-block font-mono">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Pelanggan'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order history with live states updates */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-3">
              <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider">Riwayat Pesanan Kuliner Saya</h4>
              <button
                onClick={loadMyOrderHistory}
                disabled={isLoading}
                title="Refresh Riwayat"
                className="p-1 rounded-lg text-charcoal/40 hover:text-primary hover:bg-cream/40 disabled:opacity-30 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-3 animate-pulse">
                <div className="h-16 bg-primary/5 rounded-2xl" />
                <div className="h-16 bg-primary/5 rounded-2xl" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <ShoppingBag className="w-10 h-10 text-primary mx-auto opacity-35" />
                <p className="text-xs text-muted-text">Belum ada transaksi masakan yang tercatat.</p>
                <button
                  onClick={() => setPage('menu')}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Pesan Hidangan Eyang
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div key={ord.id} className="border border-primary/10 rounded-2xl p-4 text-xs font-sans space-y-3 relative hover:bg-cream/5 transition-colors">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-primary/5 pb-2.5">
                      <div>
                        <span className="font-mono text-primary font-bold uppercase block">{ord.id}</span>
                        <span className="text-[10px] text-muted-text block mt-0.5">
                          Metode: <strong className="uppercase">{ord.tableNumber ? `Dine-In Meja ${ord.tableNumber}` : 'Delivery'}</strong>
                        </span>
                      </div>
                      
                      {/* Status and Action controls */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${getStatusColor(ord.status)}`}>
                          {getStatusLabel(ord.status)}
                        </span>
                        
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            title="Batalkan Pesanan"
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Items List inside receipt card */}
                    <div className="space-y-1.5 pl-2 border-l-2 border-secondary">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-charcoal text-[11px] leading-relaxed">
                          <span>{item.name} <strong className="font-mono font-bold text-primary">x{item.quantity}</strong></span>
                          <span className="font-mono text-muted-text">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total Amount receipt */}
                    <div className="flex justify-between pt-2 border-t border-primary/5 text-primary text-xs font-bold font-serif">
                      <span className="text-charcoal/70">Total Tagihan Belanja:</span>
                      <span className="font-mono text-sm">Rp {ord.totalAmount.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Bottom notes if delivery */}
                    {ord.deliveryAddress && (
                      <p className="text-[10px] text-muted-text bg-cream/40 p-2 rounded-xl border border-primary/5 line-clamp-1">
                        Tujuan: {ord.deliveryAddress}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
