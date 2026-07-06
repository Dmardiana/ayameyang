/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MapPin, Phone, Search, Globe, Star, Info, AlertCircle } from 'lucide-react';
import { Branch } from '../types';

interface BranchesSectionProps {
  branches: Branch[];
  isLoading: boolean;
}

export default function BranchesSection({ branches, isLoading }: BranchesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(branches[0]?.id || 'br_1');

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  return (
    <div className="py-12 bg-cream/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Lokasi Cabang
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl text-primary mt-3 tracking-tight">
            Kunjungi Kedai Terdekat
          </h2>
          <p className="text-charcoal/70 text-xs mt-2 leading-relaxed">
            Eyang siap menyambutmu dengan penuh kehangatan di seluruh kota besar Indonesia. Cari cabang terdekat dan dapatkan hidangan hangat yang lezat.
          </p>
        </div>

        {/* Branch Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Branch Search & Selector List */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-premium border border-primary/5 space-y-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kota atau alamat cabang..."
                className="w-full bg-cream/30 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
              />
            </div>

            {/* List */}
            {isLoading ? (
              <div className="space-y-2 py-3 animate-pulse">
                <div className="h-16 bg-primary/5 rounded-xl" />
                <div className="h-16 bg-primary/5 rounded-xl" />
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-text">
                <AlertCircle className="w-8 h-8 text-primary/45 mx-auto mb-2" />
                <span>Cabang tidak ditemukan.</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredBranches.map(b => {
                  const isSelected = selectedBranchId === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border flex gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-primary/5 border-primary shadow-premium'
                          : 'bg-cream/15 border-primary/5 hover:bg-cream/40'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-charcoal/40'}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-serif font-black text-xs ${isSelected ? 'text-primary' : 'text-charcoal'}`}>
                            {b.name}
                          </span>
                          {b.comingSoon ? (
                            <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                              Segera Hadir
                            </span>
                          ) : b.isMainBranch && (
                            <span className="bg-secondary/25 text-primary text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                              Pusat
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-text line-clamp-1 leading-relaxed">{b.address}</p>
                        {!b.comingSoon && (
                          <p className="text-[9px] text-charcoal/50 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary/60" />
                            <span>{b.phone}</span>
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Stunning Interactive Vector Map & Location Info */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Vector Map visualizer */}
            <div className="bg-white rounded-3xl p-5 shadow-premium border border-primary/5 overflow-hidden flex flex-col justify-center items-center text-center relative min-h-[280px]">
              <div className="absolute top-4 left-4 text-left">
                <h4 className="font-serif font-bold text-xs text-primary flex items-center gap-1.5">
                  <Globe className="w-4.5 h-4.5 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Peta Interaktif Cabang AyamEyang</span>
                </h4>
                <span className="text-[9px] text-muted-text font-mono">Garis Lintang & Bujur Nusantara</span>
              </div>

              {/* Vector Indonesia-style illustrative SVG Map with pinpoint nodes */}
              <svg viewBox="0 0 800 350" className="w-full max-w-xl h-auto my-6 drop-shadow-md">
                {/* Simulated islands */}
                <path d="M50,140 Q80,100 120,120 T180,130 T250,155 T320,190 T280,240 T200,220 T100,180 Z" fill="#FFF8F0" stroke="#B22222" strokeWidth="1.5" strokeOpacity="0.15" /> {/* Sumatra */}
                <path d="M220,220 Q280,220 340,240 T450,260 T550,270 T610,275 L600,285 T500,285 T400,280 T300,260 T210,230 Z" fill="#FFF8F0" stroke="#B22222" strokeWidth="1.5" strokeOpacity="0.15" /> {/* Jawa */}
                <path d="M240,60 Q300,40 360,70 T400,120 T350,160 T280,140 Z" fill="#FFF8F0" stroke="#B22222" strokeWidth="1.5" strokeOpacity="0.15" /> {/* Kalimantan */}
                <path d="M420,80 Q450,40 480,90 T510,130 T450,160 Z" fill="#FFF8F0" stroke="#B22222" strokeWidth="1.5" strokeOpacity="0.15" /> {/* Sulawesi */}
                
                {/* Branch nodes */}
                {branches.map((b, idx) => {
                  // Map coordinates to SVG pixels (Simulated Indonesian layout coordinates)
                  // Jakarta (lat: -6.2, lng: 106.8) -> pixels: x:290, y:235
                  // Yogyakarta (lat: -7.7, lng: 110.3) -> pixels: x:340, y:248
                  // Bandung (lat: -6.8, lng: 107.6) -> pixels: x:310, y:240
                  // Solo (lat: -7.5, lng: 110.8) -> pixels: x:355, y:250
                  // Surabaya (lat: -7.2, lng: 112.7) -> pixels: x:390, y:255
                  let x = 340;
                  let y = 248;
                  if (b.id === 'br_1') { x = 340; y = 248; } // Yogyakarta
                  if (b.id === 'br_2') { x = 290; y = 235; } // Jakarta
                  if (b.id === 'br_3') { x = 310; y = 240; } // Bandung
                  if (b.id === 'br_4') { x = 390; y = 255; } // Surabaya
                  if (b.id === 'br_5') { x = 355; y = 250; } // Solo

                  const isSelected = selectedBranchId === b.id;

                  return (
                    <g
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse rings for selected pin */}
                      {isSelected && (
                        <circle cx={x} cy={y} r="16" fill="#B22222" fillOpacity="0.15" className="animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />
                      )}
                      
                      {/* Anchor pin dot */}
                      <circle cx={x} cy={y} r={isSelected ? "7" : "5"} fill={isSelected ? "#B22222" : "#FFD166"} stroke="#B22222" strokeWidth="1.5" />
                      
                      {/* Hover text flag */}
                      <text x={x} y={y - 12} textAnchor="middle" className="text-[9px] font-bold font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity fill-primary pointer-events-none bg-white">
                        {b.name.replace('AyamEyang Cabang ', '').replace('AyamEyang ', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="flex gap-4 text-[10px] text-muted-text font-semibold border-t border-primary/5 pt-3 w-full justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary border border-secondary" />
                  <span>Pusat Kuliner</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-primary" />
                  <span>Cabang Franchise</span>
                </div>
              </div>
            </div>

            {/* Info panel of current selected branch */}
            {selectedBranch && (
              <div className="bg-primary text-white rounded-3xl p-6 shadow-premium border-2 border-secondary relative animate-fade-in">
                <div className="space-y-4">
                  {/* Title & Badge */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-serif font-black text-base text-secondary">{selectedBranch.name}</h4>
                      <p className="text-[10px] text-cream/70 font-mono mt-0.5">
                        Koordinat: {selectedBranch.lat.toFixed(4)}, {selectedBranch.lng.toFixed(4)}
                      </p>
                    </div>
                    {selectedBranch.comingSoon ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        Coming Soon
                      </span>
                    ) : selectedBranch.isMainBranch && (
                      <span className="bg-secondary text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        Main Branch
                      </span>
                    )}
                  </div>

                  {selectedBranch.comingSoon ? (
                    <div className="py-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto text-secondary animate-pulse">
                        <AlertCircle className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-serif font-bold text-sm text-secondary">Segera Hadir di Kota Anda!</p>
                        <p className="text-[11px] text-cream/70 max-w-sm mx-auto leading-relaxed">
                          Nantikan kehangatan cita rasa legendaris AyamEyang di kota Anda. Ikuti akun Instagram kami di <span className="font-bold text-secondary">@ayameyang</span> untuk memantau berita pembukaan cabang secara terupdate!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Detail stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                        <div className="space-y-2">
                          <div className="flex gap-2 items-start">
                            <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] text-cream/65 block font-bold uppercase tracking-wide">Alamat Lengkap</span>
                              <span className="font-sans text-[11px] text-cream">{selectedBranch.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2 items-start">
                            <Phone className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] text-cream/65 block font-bold uppercase tracking-wide">Nomor Telepon</span>
                              <span className="font-mono text-[11px] text-cream">{selectedBranch.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact/Map links */}
                      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://wa.me/62${selectedBranch.phone.replace(/[^0-9]/g, '').slice(1)}?text=Halo%20AyamEyang%20cabang%20${encodeURIComponent(selectedBranch.name)}%2C%20saya%20ingin%20tanya%20mengenai%20menu...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-secondary hover:bg-secondary-hover text-charcoal font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Hubungi WhatsApp Cabang</span>
                        </a>
                        
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedBranch.lat},${selectedBranch.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/15 hover:bg-white/25 border border-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Globe className="w-4 h-4 text-secondary" />
                          <span>Buka Google Maps</span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
