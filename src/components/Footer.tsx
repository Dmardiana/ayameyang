/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import AyamEyangLogo from './AyamEyangLogo';

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const handleNavClick = (pageId: string) => {
    setPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-8 border-t-4 border-secondary no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AyamEyangLogo size={42} />
              <span className="font-serif font-bold text-lg text-white">AyamEyang</span>
            </div>
            <p className="text-xs text-cream/75 leading-relaxed font-sans">
              Menghadirkan kehangatan cita rasa legendaris Bandung melalui resep rahasia ayam pusaka warisan Eyang dengan lada menggoda. Disajikan dengan penuh cinta secara modern dan higienis.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] bg-primary text-secondary font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                100% Halal Thayyiban
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wider mb-5 uppercase border-b border-primary/20 pb-2">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Halaman Beranda' },
                { id: 'about', label: 'Kisah Tentang Eyang' },
                { id: 'menu', label: 'Eksplorasi Menu Lezat' },
                { id: 'reservasi', label: 'Reservasi Meja Makan' },
                { id: 'promo', label: 'Promo Spesial Aktif' },
                { id: 'cabang', label: 'Temukan Cabang Terdekat' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="text-cream/80 hover:text-secondary flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours Column */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wider mb-5 uppercase border-b border-primary/20 pb-2">
              Jam Operasional
            </h4>
            <ul className="space-y-3 text-xs text-cream/80">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Senin - Sabtu</span>
                  <span className="text-[11px] font-mono">10:00 - 16:00 WIB</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-red-400">
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold">Minggu</span>
                  <span className="text-[11px] font-mono">Tutup</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm tracking-wider mb-5 uppercase border-b border-primary/20 pb-2">
              KONTAK UTAMA
            </h4>
            <ul className="space-y-3 text-xs text-cream/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans">
                  Jalan Gatot Subroto, Karees Kulon No. 11/33, Bandung
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="font-mono">+62 859-5646-5878 / +62 818-0222-2979</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-primary shrink-0" />
                <span className="font-sans text-cream/90">@ayameyang</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright divider */}
        <div className="border-t border-primary/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-cream/60 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AyamEyang Restaurant Group. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-cream/60">
            <button onClick={() => handleNavClick('about')} className="hover:text-secondary transition-colors cursor-pointer">Ketentuan Layanan</button>
            <span>&bull;</span>
            <button onClick={() => handleNavClick('about')} className="hover:text-secondary transition-colors cursor-pointer">Kebijakan Privasi</button>
            <span>&bull;</span>
            <button onClick={() => handleNavClick('admin')} className="hover:text-secondary transition-colors font-mono tracking-wider cursor-pointer font-bold">PORTAL ADMIN</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
