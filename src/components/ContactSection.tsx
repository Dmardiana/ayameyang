/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Instagram, Phone, MapPin, Send, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!name || !email || !subject || !message) {
      setError('Harap lengkapi seluruh kolom formulir hubungi kami.');
      setIsLoading(false);
      return;
    }

    try {
      await api.sendMessage({ name, email, subject, message });
      setSuccess('Pesan Anda berhasil terkirim ke tim manajemen AyamEyang! Terima kasih banyak, Sayang.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError('Gagal mengirimkan pesan. Silakan hubungi kami langsung via WhatsApp, Sayang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const faqs = [
    { q: 'Apakah menu AyamEyang aman untuk anak-anak?', a: 'Sangat aman, Sayang! Kami memiliki pilihan menu tidak pedas seperti Ayam Goreng Kremes Eyang yang gurih manis disukai anak-anak.' },
    { q: 'Apakah melayani pemesanan katering pernikahan?', a: 'Ya betul. Kami melayani prasmanan, nasi kotak, dan katering pesta dengan armada dapur terlatih.' },
    { q: 'Bagaimana cara mendaftar kemitraan franchise?', a: 'Silakan kirimkan permohonan kerja sama Anda melalui formulir kontak ini dengan subjek "Kemitraan Franchise" beserta proposal lokasi Anda.' }
  ];

  return (
    <div className="py-12 bg-cream/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Hubungi Kami
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl text-primary mt-3 tracking-tight">
            Tanya Eyang Secara Langsung
          </h2>
          <p className="text-charcoal/70 text-xs mt-2 leading-relaxed">
            Apakah Anda memiliki kritik, saran kerja sama kemitraan, atau pertanyaan khusus? Sampaikan kepada kami dan kami akan merespons dengan cepat.
          </p>
        </div>

        {/* 2 Cols Contacts layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Direct Info & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Cards Info */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-2.5 border-b border-primary/5">KONTAK UTAMA</h4>
              
              <ul className="text-xs space-y-4 leading-relaxed font-sans text-charcoal/80">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Jalan Gatot Subroto, Karees Kulon No. 11/33, Bandung</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4.5 h-4.5 text-primary shrink-0" />
                  <span className="font-mono">+62 859-5646-5878 / +62 818-0222-2979</span>
                </li>
                <li className="flex items-center gap-3">
                  <Instagram className="w-4.5 h-4.5 text-primary shrink-0" />
                  <span>@ayameyang</span>
                </li>
              </ul>
            </div>

            {/* Micro FAQ segment */}
            <div className="bg-white rounded-3xl p-5 md:p-6 shadow-premium border border-primary/5 space-y-4">
              <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-2.5 border-b border-primary/5 flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5" />
                <span>Pertanyaan Sering Diajukan</span>
              </h4>

              <div className="space-y-3.5">
                {faqs.map((f, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <span className="font-bold text-primary block font-serif">Q: {f.q}</span>
                    <p className="text-charcoal/70 leading-relaxed font-sans">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-premium border border-primary/5 space-y-5">
            <h4 className="font-serif font-bold text-sm text-primary uppercase tracking-wider pb-3 border-b border-primary/5 flex items-center gap-1.5">
              <MessageSquare className="w-4.5 h-4.5 text-primary" />
              <span>Formulir Pengiriman Pesan</span>
            </h4>

            {success && (
              <div className="bg-green-50 text-green-700 p-3.5 rounded-xl text-xs flex items-center gap-2 border border-green-100">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-bold">{success}</span>
              </div>
            )}

            {error && (
              <p className="bg-red-50 text-red-700 p-3 rounded-lg text-xs">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full bg-cream/15 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-text/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full bg-cream/15 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Subjek Pesan *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Kemitraan Franchise, Keluhan Pelayanan, dll..."
                  className="w-full bg-cream/15 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Detail Isi Pesan *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan Anda secara rinci di sini, Sayang..."
                  className="w-full bg-cream/15 border border-primary/10 rounded-xl px-3 py-2 text-xs focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-premium flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-secondary" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
