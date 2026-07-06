/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Sparkles, Heart, Clock } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="py-12 bg-cream/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Kisah Warisan
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl text-primary mt-3 tracking-tight">
            Kisah Kelezatan AyamEyang
          </h2>
          <p className="text-charcoal/70 text-xs mt-2 leading-relaxed">
            Perjalanan cita rasa istimewa AyamEyang dimulai pada tahun 2019 di kota Bandung saja dan tidak ada di kota lain, menghadirkan kelezatan khas yang tiada duanya.
          </p>
        </div>

        {/* 2 Cols Story row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 relative">
            <img
              src="https://images.unsplash.com/photo-1598908314732-07113901949e?q=80&w=800"
              alt="Dapur Warisan Eyang"
              className="rounded-3xl shadow-premium-lg border border-primary/10 w-full object-cover h-96"
            />
            <div className="absolute -bottom-6 -right-6 bg-secondary border-4 border-primary text-primary rounded-2xl p-4 shadow-premium max-w-[200px] text-center hidden sm:block">
              <span className="font-serif font-black text-2xl block leading-none">2019</span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-1 block">Tahun Berdiri</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 leading-relaxed">
            <h3 className="font-serif font-black text-xl md:text-2xl text-primary">Resep Pusaka Bandung</h3>
            <p className="text-xs text-charcoal/85">
              Dimulai pada tahun 2019 di kota Bandung saja dan tidak ada di kota lain, AyamEyang secara telaten meracik bumbu rempah murni di atas tungku tradisinya. Setiap porsi ayam dibumbui dengan jenis herba lokal murni kualitas terbaik tanpa tambahan bahan pengawet sedikit pun. Cita rasa kehangatan bumbu gurih berpadu dengan lada menggoda meresap sampai ke tulang ini cepat tersebar dari mulut ke mulut di seluruh penjuru kota Bandung.
            </p>
            <p className="text-xs text-charcoal/85">
              Kini, AyamEyang berkomitmen penuh melestarikan keaslian cita rasa pusaka tersebut dengan mengedepankan kualitas pelayanan restoran modern yang premium, bersih, nyaman, dan ramah keluarga. Rasa lezat masakan warisan Eyang yang tiada tandingannya ini dapat Anda nikmati secara eksklusif hanya di kota Bandung.
            </p>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-primary/10">
          <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-premium text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto border border-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">100% Halal Thayyiban</h4>
            <p className="text-[11px] text-muted-text leading-relaxed font-sans">Sertifikasi Halal resmi MUI pada semua rantai pasok bahan makanan segar pilihan kami.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-premium text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto border border-primary/10">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Rempah Murni Pilihan</h4>
            <p className="text-[11px] text-muted-text leading-relaxed font-sans">Semua bumbu ditumbuk manual dengan cabai segar hasil tani nusantara bermutu tinggi.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-premium text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto border border-primary/10">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Disajikan Dengan Cinta</h4>
            <p className="text-[11px] text-muted-text leading-relaxed font-sans">Sapaan hangat khas kekeluargaan yang ramah menyambut kedatangan Anda dan kerabat.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-premium text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto border border-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Resep Rahasia Sejak 2019</h4>
            <p className="text-[11px] text-muted-text leading-relaxed font-sans">Rahasia kekayaan cita rasa legendaris autentik yang tetap terjaga konsistensinya hanya di kota Bandung.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
