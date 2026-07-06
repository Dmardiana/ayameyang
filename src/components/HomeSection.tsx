/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, Star, Calendar, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { MenuItem, Promo } from '../types';

interface HomeSectionProps {
  menuItems: MenuItem[];
  promos: Promo[];
  setPage: (page: string) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function HomeSection({ menuItems, promos, setPage, onAddToCart }: HomeSectionProps) {
  const featuredMenu = menuItems.filter(item => item.isAvailable).slice(0, 4);
  const featuredPromos = promos.filter(p => p.isAvailable).slice(0, 3);

  const testimonials = [
    { name: 'Kusuma Wardani', role: 'Ibu Rumah Tangga', rating: 5, comment: 'Ayam Kremesnya benar-benar mengingatkan saya pada masakan Almarhumah Nenek. Bumbunya meresap sampai ke tulang, kremesannya sangat renyah!' },
    { name: 'Raden Mas Budi', role: 'Pecinta Kuliner', rating: 5, comment: 'Sangat menyukai Ayam Bakar Taliwang di sini. Pedasnya nendang, bumbunya tebal, dan daging ayamnya lembut sekali. Layanan ramah!' },
    { name: 'Siti Rahmawati', role: 'Pegawai Swasta', rating: 5, comment: 'Warungnya bersih sekali, suasananya tenang dengan lagu gending jawa yang menenangkan. Sangat cocok untuk makan malam bersama keluarga.' }
  ];

  return (
    <div className="font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-charcoal text-cream overflow-hidden py-20 lg:py-28 border-b-4 border-secondary no-print">
        {/* Background decorative Unsplash overlay */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/25 border border-secondary text-secondary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-secondary" />
                <span>Sajian Istimewa Bandung Sejak 2019</span>
              </span>
              
              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                Cita Rasa Kehangatan <br />
                <span className="text-secondary font-serif">Resep Pusaka Eyang</span>
              </h1>
              
              <p className="text-cream/80 text-xs md:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                Sajian istimewa daging ayam segar pilihan yang diolah secara higienis menggunakan 17 rempah murni warisan leluhur. Meresap sempurna, renyah di luar, lembut di dalam.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => setPage('menu')}
                  className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-xl font-bold text-xs tracking-wide uppercase shadow-premium hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-secondary" />
                  <span>Pesan Menu Online</span>
                </button>
                
                <button
                  onClick={() => setPage('reservasi')}
                  className="bg-white/10 hover:bg-white/25 border border-white/20 text-white px-7 py-3.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Reservasi Meja Gratis</span>
                </button>
              </div>

              {/* USP mini banners */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-white/10">
                <div>
                  <span className="block font-serif font-black text-lg text-secondary">100%</span>
                  <span className="text-[10px] text-cream/60">Halal Thayyiban</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-lg text-secondary">17+</span>
                  <span className="text-[10px] text-cream/60">Rempah Murni</span>
                </div>
                <div>
                  <span className="block font-serif font-black text-lg text-secondary">15 Mins</span>
                  <span className="text-[10px] text-cream/60">Sajian Hangat</span>
                </div>
              </div>
            </div>

            {/* Right Graphic card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative z-10 w-full rounded-3xl overflow-hidden shadow-premium-lg border-2 border-secondary h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800"
                  alt="Sajian Ayam Eyang Utama"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] bg-secondary text-primary font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                    Terlaris
                  </span>
                  <h4 className="font-serif font-black text-base text-secondary">Ayam Bakar Madu Pusaka</h4>
                  <p className="text-[10px] text-cream/80">Disajikan hangat dengan sambal terasi matang ulek buatan tangan.</p>
                </div>
              </div>
              {/* Outer decorative yellow ring */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/15 rounded-full blur-xl animate-pulse" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROMO HIGHLIGHTS SECTION */}
      {featuredPromos.length > 0 && (
        <section className="py-12 bg-white border-b border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 border-b border-primary/5 pb-3">
              <div>
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest font-mono">Penawaran Menarik</span>
                <h3 className="font-serif font-black text-xl md:text-2xl text-primary mt-1">Kupon Voucher Spesial</h3>
              </div>
              <button
                onClick={() => setPage('promo')}
                className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat Semua Promo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPromos.map(p => (
                <div
                  key={p.id}
                  className="bg-cream/15 rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-40 overflow-hidden shrink-0">
                    <img
                      src={p.bannerUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-secondary text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-mono uppercase tracking-wider">
                      {p.discountPercent}% OFF
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-xs text-charcoal leading-tight">{p.title}</h4>
                      <p className="text-[10px] text-muted-text mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="pt-3 flex items-center justify-between mt-auto">
                      <div className="bg-white border border-primary/25 border-dashed rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                        {p.code}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.code);
                          alert(`Kode promo "${p.code}" berhasil disalin! Gunakan saat checkout, Sayang.`);
                        }}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Salin Kupon
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED MENU SECTION */}
      <section className="py-16 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
              Sajian Unggulan
            </span>
            <h3 className="font-serif font-black text-2xl md:text-3xl text-primary mt-3">Rekomendasi Terlaris Dapur Eyang</h3>
            <p className="text-xs text-muted-text mt-1.5">Sajian ayam pusaka yang paling digemari dan dipesan berulang kali oleh cucu kesayangan Eyang.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/15 shadow-premium hover:shadow-premium-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden shrink-0 bg-primary/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 text-primary text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating}</span>
                      <span className="text-muted-text/30">|</span>
                      <span className="text-muted-text text-[10px] font-medium">{item.soldCount} terjual</span>
                    </div>

                    <h4 className="font-serif font-black text-xs text-charcoal leading-tight mt-1 truncate">
                      {item.name}
                    </h4>
                    
                    <p className="text-[11px] text-muted-text line-clamp-2 leading-relaxed mt-0.5 font-sans">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between mt-auto">
                    <span className="font-mono font-bold text-xs text-primary">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>

                    <button
                      onClick={() => onAddToCart(item)}
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Pesan</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setPage('menu')}
              className="bg-cream border border-primary/15 text-primary px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/5 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Eksplorasi Seluruh Menu Nusantara</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-16 bg-white border-t border-primary/5 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
              Ulasan Cinta
            </span>
            <h3 className="font-serif font-black text-2xl md:text-3xl text-primary mt-3">Kata Cucunda Tercinta</h3>
            <p className="text-xs text-muted-text mt-1.5">Kebahagiaan dan kepuasan pelanggan adalah berkah utama bagi dedikasi seluruh dapur kami.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-cream/15 rounded-2xl p-5 border border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-serif font-bold text-xs text-charcoal">{t.name}</span>
                    <span className="text-[10px] text-muted-text font-sans">{t.role}</span>
                  </div>
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-charcoal/75 leading-relaxed font-sans italic">
                  "{t.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
