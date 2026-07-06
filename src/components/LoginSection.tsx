/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface LoginSectionProps {
  onLoginSuccess: (user: UserType) => void;
  setPage: (page: string) => void;
}

export default function LoginSection({ onLoginSuccess, setPage }: LoginSectionProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration extras
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isRegister) {
        // Register flow
        const newUser = await api.register({
          name,
          email,
          password,
          phone,
          address
        });
        setSuccess('Pendaftaran berhasil! Akun Anda telah siap, Sayang. Silakan login menggunakan email dan password.');
        setIsRegister(false);
        setPassword('');
      } else {
        // Login flow
        const session = await api.login({ email, password });
        onLoginSuccess(session.user);
        
        // Auto navigate depending on role
        if (session.user.role === 'admin') {
          setPage('admin');
        } else {
          setPage('home');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Gagal autentikasi akun. Silakan periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-cream/20 font-sans flex items-center justify-center min-h-[600px]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-primary/5 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary text-secondary rounded-2xl mx-auto flex items-center justify-center border-2 border-secondary font-serif font-black text-xl shadow-premium">
            AE
          </div>
          <h3 className="font-serif font-black text-xl text-primary mt-3">
            {isRegister ? 'Gabung Keluarga AyamEyang' : 'Selamat Datang Kembali'}
          </h3>
          <p className="text-xs text-muted-text max-w-xs mx-auto leading-relaxed">
            {isRegister 
              ? 'Daftarkan diri Anda untuk menikmati kemudahan pemesanan cepat dan promo khusus pelanggan.' 
              : 'Silakan masuk ke akun Anda untuk memantau pesanan aktif dan reservasi meja.'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3.5 rounded-xl text-xs flex items-center gap-2 border border-green-100">
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Nama Lengkap *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text/60" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-cream/20 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Nomor WA / Handphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text/60" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-cream/20 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Alamat Pengiriman Default</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kota"
                  className="w-full bg-cream/20 border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50 font-sans"
                />
              </div>
            </>
          )}

          {/* Email address */}
          <div>
            <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider">Alamat Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: budi@gmail.com"
                className="w-full bg-cream/20 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-charcoal mb-1 uppercase tracking-wider font-mono">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun"
                className="w-full bg-cream/20 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-charcoal/20 text-white py-3 rounded-xl font-bold text-xs tracking-wide shadow-premium uppercase active:scale-98 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isLoading 
              ? 'Memproses Kredensial...' 
              : (isRegister ? 'Buat Akun Sekarang' : 'Masuk Keluarga Besar')
            }
          </button>
        </form>

        {/* Toggle link */}
        <div className="pt-4 border-t border-primary/10 text-center text-xs">
          {isRegister ? (
            <p className="text-muted-text">
              Sudah memiliki akun terdaftar?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Masuk Di Sini
              </button>
            </p>
          ) : (
            <p className="text-muted-text">
              Belum bergabung dengan kami?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Daftar Akun Baru
              </button>
            </p>
          )}
        </div>

        {/* Demo Creds Reminder Info */}
        {!isRegister && (
          <div className="bg-cream/45 p-3.5 rounded-2xl text-[10px] text-charcoal/70 leading-relaxed font-sans border border-primary/10">
            <p className="font-bold text-primary uppercase tracking-wider mb-1">Kredensial Akun Percobaan:</p>
            <ul className="list-disc list-inside space-y-1 font-mono">
              <li><strong>Admin:</strong> admin@ayameyang.com / admin123</li>
              <li><strong>Pelanggan:</strong> budi@gmail.com / budi123</li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
