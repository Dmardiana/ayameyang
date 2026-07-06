/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, Tag, MapPin, CreditCard, ChevronRight, CheckCircle2, Ticket, AlertCircle } from 'lucide-react';
import { MenuItem, Promo, OrderItem, PaymentMethod } from '../types';
import { api } from '../services/api';

interface CheckoutSectionProps {
  cart: { item: MenuItem; quantity: number }[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  promos: Promo[];
  currentUser: any;
  setPage: (page: string) => void;
}

export default function CheckoutSection({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  promos,
  currentUser,
  setPage
}: CheckoutSectionProps) {
  // Navigation inside section: 'cart' or 'checkout'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery'>('dine-in');

  // Promo code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Cart Calculations
  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  
  // Promo Calculation
  const discountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;
  
  const deliveryFee = orderType === 'delivery' ? 12000 : 0;
  const totalAmount = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    const promo = promos.find(p => p.code === code && p.isAvailable);
    if (!promo) {
      setPromoError('Kode promo tidak valid atau telah berakhir.');
      return;
    }

    if (subtotal < promo.minPurchase) {
      setPromoError(`Minimum pembelian Rp ${promo.minPurchase.toLocaleString('id-ID')} untuk menggunakan promo ini.`);
      return;
    }

    setAppliedPromo(promo);
    setPromoSuccess(`Kupon "${promo.code}" berhasil diterapkan! Diskon ${promo.discountPercent}% telah dikurangkan.`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoSuccess('');
    setPromoCodeInput('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setFormError('Harap lengkapi semua data wajib pemesan.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      setFormError('Alamat pengiriman wajib diisi untuk metode antar.');
      return;
    }

    if (orderType === 'dine-in' && !tableNumber) {
      setFormError('Nomor meja wajib diisi untuk makan di tempat.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = cart.map(entry => ({
        menuItemId: entry.item.id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity,
        image: entry.item.image
      }));

      const orderPayload = {
        userId: currentUser?.id,
        customerName,
        customerEmail,
        customerPhone,
        items: orderItems,
        totalAmount,
        paymentMethod,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        notes: notes || undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined
      };

      const result = await api.createOrder(orderPayload);
      setPlacedOrder(result);
      onClearCart();
      setStep('success');
    } catch (err: any) {
      setFormError(err.message || 'Gagal mengirim pesanan. Silakan coba sesaat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success' && placedOrder) {
    return (
      <div className="py-12 bg-cream/20 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-green-200 shadow-premium-lg text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-black text-2xl text-primary">Pesanan Diterima Dapur!</h3>
            <p className="text-xs text-muted-text">
              ID Pesanan Anda: <strong className="font-mono text-primary text-sm uppercase">{placedOrder.id}</strong>
            </p>
            <p className="text-xs text-charcoal/75 max-w-md mx-auto leading-relaxed">
              Terima kasih Sayang, pesananmu sudah Eyang catat dan saat ini koki sedang bergegas meracik bumbu segar di dapur.
            </p>
          </div>

          {/* Receipt Invoice details */}
          <div className="bg-cream/40 rounded-2xl p-5 text-xs text-left font-sans border border-primary/5 space-y-3">
            <h4 className="font-serif font-black text-charcoal tracking-wide border-b border-primary/10 pb-2">Rincian Transaksi</h4>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {placedOrder.items.map((it: OrderItem, i: number) => (
                <div key={i} className="flex justify-between text-charcoal">
                  <span>{it.name} <strong className="font-mono">x{it.quantity}</strong></span>
                  <span className="font-semibold text-charcoal">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/10 pt-2.5 space-y-2">
              <div className="flex justify-between text-muted-text">
                <span>Cara Bayar:</span>
                <span className="font-semibold text-charcoal uppercase">{placedOrder.paymentMethod}</span>
              </div>
              {placedOrder.tableNumber && (
                <div className="flex justify-between text-muted-text">
                  <span>Nomor Meja Dine-In:</span>
                  <span className="font-semibold text-charcoal">Meja {placedOrder.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-primary/5 pt-2 text-primary font-bold text-sm">
                <span>Total Tagihan:</span>
                <span className="font-mono">Rp {placedOrder.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => setPage('menu')}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-premium cursor-pointer"
            >
              Pesan Menu Lainnya
            </button>
            <button
              onClick={() => setPage('profile')}
              className="bg-cream border border-primary/15 text-primary px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 cursor-pointer"
            >
              Pantau Status Pesanan
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Proses Transaksi
          </span>
          <h2 className="font-serif font-black text-3xl text-primary mt-3 tracking-tight">
            {step === 'cart' ? 'Keranjang Belanja' : 'Checkout Pembayaran'}
          </h2>
          <p className="text-charcoal/70 text-xs mt-1.5 leading-relaxed">
            {step === 'cart' 
              ? 'Tinjau masakan pilihanmu sebelum dikirim langsung ke kompor koki dapur.' 
              : 'Lengkapi alamat pengantaran atau nomor meja untuk memulai memasak.'
            }
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 shadow-premium max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-primary mx-auto opacity-35 mb-4" />
            <h3 className="font-serif font-bold text-lg text-charcoal">Keranjangmu Masih Kosong</h3>
            <p className="text-xs text-muted-text mt-1.5 leading-relaxed max-w-sm mx-auto">
              Sepertinya kamu belum memilih sajian ayam pusaka resep Eyang yang harum lezat. Yuk masuk ke halaman menu sekarang!
            </p>
            <button
              onClick={() => setPage('menu')}
              className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary-hover shadow-premium cursor-pointer"
            >
              Belanja Menu Lezat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Step 1: LEFT AREA - Cart List / Form fields */}
            <div className="lg:col-span-8 space-y-6">
              {step === 'cart' ? (
                /* Cart Item List */
                <div className="bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-4">
                  <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5">Sajian Pilihan Anda</h3>
                  
                  <div className="divide-y divide-primary/5">
                    {cart.map((entry) => (
                      <div key={entry.item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src={entry.item.image}
                          alt={entry.item.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-primary/5 shadow-sm shrink-0"
                        />
                        <div className="flex-1 text-center sm:text-left space-y-0.5">
                          <h4 className="font-serif font-bold text-xs text-charcoal leading-snug">{entry.item.name}</h4>
                          <p className="text-[10px] text-primary font-mono">Rp {entry.item.price.toLocaleString('id-ID')}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center bg-cream/40 rounded-xl border border-primary/5 p-1.5 shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(entry.item.id, entry.quantity - 1)}
                            className="p-1.5 text-primary hover:bg-white rounded-lg active:scale-90 transition-all cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-charcoal px-3">{entry.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(entry.item.id, entry.quantity + 1)}
                            className="p-1.5 text-primary hover:bg-white rounded-lg active:scale-90 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price Total Column */}
                        <div className="font-mono text-xs font-bold text-primary w-24 text-center sm:text-right shrink-0">
                          Rp {(entry.item.price * entry.quantity).toLocaleString('id-ID')}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => onRemoveItem(entry.item.id)}
                          className="p-2 text-charcoal/30 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Checkout Form Screen */
                <div className="bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-6">
                  <div className="border-b border-primary/10 pb-3">
                    <h3 className="font-serif font-black text-lg text-primary">Detail Pengiriman & Pembayaran</h3>
                    <p className="text-[11px] text-muted-text mt-0.5">Lengkapi data agar pengantaran kurir tidak tersesat.</p>
                  </div>

                  {formError && (
                    <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="font-bold">{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Nama Penerima *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nama lengkap"
                          className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Email Pemesan *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Alamat email aktif"
                          className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Nomor Handphone *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Nomor telepon/WA"
                          className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                        />
                      </div>
                    </div>

                    {/* Order Type Toggle */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                          orderType === 'dine-in'
                            ? 'bg-primary/5 border-primary text-primary shadow-sm'
                            : 'bg-white border-primary/10 text-charcoal/70 hover:bg-cream/20'
                        }`}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Makan Di Tempat (Dine-In)</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                          orderType === 'delivery'
                            ? 'bg-primary/5 border-primary text-primary shadow-sm'
                            : 'bg-white border-primary/10 text-charcoal/70 hover:bg-cream/20'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Antar Ke Alamat (Delivery)</span>
                      </button>
                    </div>

                    {/* Conditional Delivery Address vs Table Number */}
                    {orderType === 'dine-in' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Nomor Meja Dine-In *</label>
                        <select
                          required
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-charcoal font-semibold cursor-pointer"
                        >
                          <option value="">-- Pilih Nomor Meja Anda --</option>
                          {Array.from({ length: 15 }).map((_, i) => (
                            <option key={i} value={String(i + 1)}>Meja Nomor {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Alamat Pengiriman Lengkap *</label>
                        <textarea
                          required
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                          className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50 font-sans"
                        />
                      </div>
                    )}

                    {/* Notes for kitchen */}
                    <div>
                      <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Catatan Tambahan untuk Dapur</label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Sambal dipisah ya Eyang, ayam goreng kremes minta agak kering, dll..."
                        className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div className="pt-2">
                      <label className="block text-[10px] font-bold text-charcoal mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>Metode Pembayaran *</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'cash', label: 'Bayar Tunai / Cash' },
                          { id: 'transfer', label: 'Transfer Manual' },
                          { id: 'midtrans', label: 'Midtrans Sandbox' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id as any)}
                            className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              paymentMethod === m.id
                                ? 'bg-primary/5 border-primary text-primary font-bold'
                                : 'bg-cream/10 border-primary/5 text-charcoal/70 hover:bg-cream/20'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action form button trigger */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:bg-charcoal/20 text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-premium uppercase active:scale-98 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      {isSubmitting ? 'Mengirim Transaksi...' : 'Konfirmasi & Selesaikan Pesanan'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* RIGHT AREA - Order Summary panel */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-5">
              <h3 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5">Rincian Belanja</h3>
              
              {/* Calculations lists */}
              <div className="text-xs space-y-2.5">
                <div className="flex justify-between text-muted-text">
                  <span>Subtotal Belanja:</span>
                  <span className="font-semibold text-charcoal">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-muted-text">
                    <span>Biaya Antar Kurir:</span>
                    <span className="font-semibold text-charcoal">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-green-700 font-semibold bg-green-50 p-2.5 rounded-xl border border-green-100">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 fill-green-100" />
                      <span>Diskon ({appliedPromo.code}):</span>
                    </span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="border-t border-primary/10 pt-3 flex justify-between font-serif font-black text-primary text-base">
                  <span>Total Bayar:</span>
                  <span className="font-mono">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Promo code apply area */}
              {step !== 'success' && (
                <div className="pt-4 border-t border-primary/5 space-y-2">
                  <span className="text-[10px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-primary" />
                    <span>Gunakan Kode Voucher</span>
                  </span>
                  
                  {promoError && (
                    <p className="text-[10px] text-red-600 font-semibold bg-red-50 p-2 rounded-lg">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <div className="flex items-center justify-between bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-100">
                      <span className="text-[10px] font-semibold">{promoSuccess}</span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-green-800 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider pl-2"
                      >
                        Hapus
                      </button>
                    </div>
                  )}

                  {!appliedPromo && (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Contoh: PROMOEYANG10"
                        className="flex-1 bg-cream/20 border border-primary/10 rounded-lg px-2.5 py-1.5 text-xs uppercase font-mono focus:outline-none"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Terapkan
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom buttons transitions */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-premium uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Lanjutkan Ke Checkout</span>
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              ) : (
                <button
                  onClick={() => setStep('cart')}
                  className="w-full bg-cream border border-primary/15 text-primary py-3 rounded-xl font-bold text-xs tracking-wide hover:bg-primary/5 transition-all cursor-pointer"
                >
                  Kembali Ke Keranjang
                </button>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
