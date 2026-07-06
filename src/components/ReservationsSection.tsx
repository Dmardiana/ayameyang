/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Reservation, User } from '../types';

interface ReservationsSectionProps {
  currentUser: User | null;
  setPage: (page: string) => void;
}

export default function ReservationsSection({ currentUser, setPage }: ReservationsSectionProps) {
  // Booking Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // App States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReservation, setSuccessReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');
  
  // History States
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Sync with current logged in user
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerEmail(currentUser.email);
      setCustomerPhone(currentUser.phone || '');
      loadReservationHistory();
    }
  }, [currentUser]);

  const loadReservationHistory = () => {
    if (!currentUser) return;
    setIsHistoryLoading(true);
    api.getReservations()
      .then(all => {
        // filter by email or userId
        const filtered = all.filter(r => r.userId === currentUser.id || r.customerEmail === currentUser.email);
        setMyReservations(filtered);
      })
      .catch(err => console.error(err))
      .finally(() => setIsHistoryLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !date) {
      setError('Harap lengkapi semua kolom bertanda bintang (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reservationPayload = {
        userId: currentUser?.id,
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        numberOfGuests,
        specialRequests
      };

      const result = await api.createReservation(reservationPayload);
      setSuccessReservation(result);
      
      // Reset form
      setDate('');
      setSpecialRequests('');
      setNumberOfGuests(2);
      
      // Reload history if logged in
      if (currentUser) {
        loadReservationHistory();
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim reservasi. Silakan hubungi langsung cabang kami.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Reservation['status']) => {
    if (status === 'confirmed') {
      return (
        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          Dikonfirmasi
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
          Dibatalkan
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
        Menunggu
      </span>
    );
  };

  return (
    <div className="py-12 bg-cream/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Meja Prioritas
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl text-primary mt-3 tracking-tight animate-fade-in">
            Reservasi Meja Anda
          </h2>
          <p className="text-charcoal/70 text-xs mt-2 leading-relaxed">
            Hindari antrean panjang dan pastikan meja terbaik Anda beserta keluarga telah siap disajikan dengan hidangan ayam legendaris favorit.
          </p>
        </div>

        {/* Success View Screen */}
        {successReservation ? (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-green-200 shadow-premium-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif font-black text-2xl text-primary">Reservasi Berhasil Diajukan!</h3>
              <p className="text-xs text-muted-text">
                Kode Reservasi Anda adalah: <strong className="font-mono text-primary text-sm uppercase">{successReservation.id}</strong>
              </p>
              <p className="text-xs text-charcoal/70 max-w-md mx-auto leading-relaxed font-sans">
                Terima kasih, Sayang. Reservasi Anda telah masuk ke sistem kami. Tim Eyang akan segera menghubungi Anda di nomor <strong className="font-mono">{successReservation.customerPhone}</strong> untuk melakukan konfirmasi meja kosong.
              </p>
            </div>

            {/* Summary details card */}
            <div className="bg-cream/40 rounded-2xl p-4 text-xs space-y-2 text-left font-sans border border-primary/5">
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span className="text-muted-text">Nama Pemesan:</span>
                <span className="font-semibold text-charcoal">{successReservation.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span className="text-muted-text">Jumlah Tamu:</span>
                <span className="font-semibold text-charcoal">{successReservation.numberOfGuests} Orang</span>
              </div>
              <div className="flex justify-between border-b border-primary/5 pb-2">
                <span className="text-muted-text">Tanggal & Jam:</span>
                <span className="font-semibold text-charcoal">{successReservation.date} | {successReservation.time} WIB</span>
              </div>
              {successReservation.specialRequests && (
                <div className="pt-1">
                  <span className="text-muted-text block">Catatan Khusus:</span>
                  <p className="text-charcoal font-medium italic mt-1 bg-white p-2 rounded-lg border border-primary/5">{successReservation.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => setSuccessReservation(null)}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-premium cursor-pointer"
              >
                Pesan Meja Lagi
              </button>
              <button
                onClick={() => setPage('menu')}
                className="bg-cream border border-primary/15 text-primary px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 cursor-pointer"
              >
                Lihat Menu Makanan
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-primary/5 space-y-6">
              <div className="border-b border-primary/10 pb-4">
                <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                  <ShieldCheck className="w-5.5 h-5.5" />
                  <span>Isi Data Booking Reservasi</span>
                </h3>
                <p className="text-xs text-muted-text mt-1">Isi formulir pendaftaran meja gratis dengan info akurat untuk dikonfirmasi.</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 2 Cols row: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-cream/20 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Nomor Telepon/WA *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full bg-cream/20 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full bg-cream/20 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                  />
                </div>

                {/* 3 Cols row: Date, Time, Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>Tanggal Datang *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-charcoal font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>Jam Booking *</span>
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-charcoal font-semibold cursor-pointer"
                    >
                      {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                        <option key={t} value={t}>{t} WIB</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>Jumlah Tamu *</span>
                    </label>
                    <select
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                      className="w-full bg-cream/20 border border-primary/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-charcoal font-semibold cursor-pointer"
                    >
                      {Array.from({ length: 20 }).map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} Orang</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special requests */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wide flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span>Permohonan Khusus / Catatan</span>
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Contoh: Memerlukan area bayi, meja di pojok ruangan, perayaan ulang tahun, dll..."
                    className="w-full bg-cream/20 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-hover disabled:bg-charcoal/20 text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-premium uppercase active:scale-98 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Mengirim Permohonan...' : 'Pesan Meja Sekarang'}
                </button>
              </form>
            </div>

            {/* Sidebar / History Section */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Guidance card */}
              <div className="bg-primary text-white rounded-3xl p-6 shadow-premium border-2 border-secondary relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 font-serif text-8xl translate-x-5 translate-y-5">
                  AE
                </div>
                <h4 className="font-serif font-bold text-lg text-secondary">Ketentuan Reservasi</h4>
                <ul className="text-xs text-cream/90 mt-3 space-y-2.5 leading-relaxed font-sans list-disc list-inside">
                  <li>Reservasi meja di AyamEyang adalah <strong>100% Gratis</strong> tanpa biaya booking.</li>
                  <li>Meja akan ditahan maksimal selama <strong>30 menit</strong> dari waktu reservasi yang disetujui.</li>
                  <li>Untuk acara perkumpulan atau gathering di atas 20 orang, dimohon memesan menu paket terlebih dahulu via halaman Kontak kami.</li>
                  <li>Kami akan meninjau ketersediaan meja kosong lalu melakukan konfirmasi lewat WhatsApp/Telepon dalam waktu singkat.</li>
                </ul>
              </div>

              {/* Personal Reservation History */}
              {currentUser && (
                <div className="bg-white rounded-3xl p-6 shadow-premium border border-primary/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                    <h4 className="font-serif font-bold text-sm text-primary">Riwayat Reservasi Saya</h4>
                    <button
                      onClick={loadReservationHistory}
                      disabled={isHistoryLoading}
                      title="Refresh"
                      className="p-1 rounded-lg text-charcoal/40 hover:text-primary hover:bg-cream/40 disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isHistoryLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {isHistoryLoading ? (
                    <div className="space-y-2 py-3">
                      <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
                      <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
                    </div>
                  ) : myReservations.length === 0 ? (
                    <p className="text-[11px] text-muted-text italic text-center py-4">Belum ada riwayat reservasi terdaftar atas email Anda.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {myReservations.map((res) => (
                        <div key={res.id} className="border border-primary/10 rounded-xl p-3 text-[11px] font-sans relative hover:bg-cream/10 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-mono text-primary font-bold uppercase">{res.id}</span>
                            {getStatusBadge(res.status)}
                          </div>
                          <p className="text-charcoal font-semibold">{res.numberOfGuests} Orang | Meja {res.tableNumber || '-'}</p>
                          <p className="text-muted-text text-[10px] mt-0.5">{res.date} pukul {res.time} WIB</p>
                          {res.specialRequests && (
                            <p className="text-muted-text text-[9px] italic mt-1 bg-cream/45 p-1 px-2 rounded border border-primary/5 line-clamp-1">{res.specialRequests}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Non-logged-in warning */}
              {!currentUser && (
                <div className="bg-cream/40 rounded-3xl p-6 border border-primary/10 text-center space-y-3 font-sans">
                  <h4 className="font-bold text-xs text-charcoal">Ingin Melihat Riwayat Booking?</h4>
                  <p className="text-[11px] text-muted-text leading-relaxed">
                    Masuk ke akun Anda terlebih dahulu untuk menelusuri atau mengelola riwayat reservasi meja Anda secara terpadu di masa mendatang.
                  </p>
                  <button
                    onClick={() => setPage('login')}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    Masuk Akun Saya
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
