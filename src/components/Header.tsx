/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, User, LogOut, ShieldAlert, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { User as UserType } from '../types';
import AyamEyangLogo from './AyamEyangLogo';

interface HeaderProps {
  currentPage: string;
  setPage: (page: string) => void;
  cartCount: number;
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Header({ currentPage, setPage, cartCount, currentUser, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'menu', label: 'Menu Lezat' },
    { id: 'reservasi', label: 'Reservasi Meja' },
    { id: 'promo', label: 'Promo Spesial' },
    { id: 'cabang', label: 'Cabang Kami' },
    { id: 'kontak', label: 'Hubungi Kami' }
  ];

  const handleNavClick = (pageId: string) => {
    setPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <AyamEyangLogo size={52} />
            <div>
              <span className="font-serif font-black text-xl tracking-tight text-primary block leading-none">AyamEyang</span>
              <span className="text-[9px] tracking-widest uppercase font-sans font-bold text-secondary-hover mt-1 block">Lada Menggoda</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/5 border-b-2 border-primary'
                      : 'text-charcoal/70 hover:text-primary hover:bg-cream/40'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => handleNavClick('cart')}
              className={`relative p-2.5 rounded-full hover:bg-cream/50 transition-all cursor-pointer ${
                currentPage === 'cart' ? 'text-primary bg-primary/5' : 'text-charcoal/70 hover:text-primary'
              }`}
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-primary/15">
                <button
                  onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'profile')}
                  className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-bold text-sm">
                    {currentUser.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-charcoal block max-w-[100px] truncate">{currentUser.name}</span>
                    <span className="text-[9px] text-muted-text font-mono uppercase tracking-wider block">
                      {currentUser.role === 'admin' ? 'Admin' : 'Pelanggan'}
                    </span>
                  </div>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    title="Dashboard Admin"
                    className="p-2 rounded-full text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={onLogout}
                  title="Keluar"
                  className="p-2 rounded-full text-charcoal/50 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide hover:bg-primary-hover hover:scale-102 active:scale-98 transition-all border border-transparent shadow-sm cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>

          {/* Mobile Layout Left/Right toggles */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2.5 text-charcoal/70 hover:text-primary hover:bg-cream/40 rounded-full"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser && (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'profile')}
                className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20"
              >
                {currentUser.name[0]}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal/80 hover:text-primary rounded-lg hover:bg-cream/40"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-primary/10 px-4 py-4 space-y-2 animate-slide-down shadow-md">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-primary/5 text-primary border-l-4 border-primary' : 'text-charcoal/70 hover:bg-cream/30'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          
          {!currentUser && (
            <div className="pt-3 border-t border-primary/10 mt-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full bg-primary text-white text-center py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Masuk Akun</span>
              </button>
            </div>
          )}

          {currentUser && (
            <div className="pt-3 border-t border-primary/10 mt-2 space-y-2">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/5 flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Dashboard Admin</span>
                </button>
              )}
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal/70 hover:bg-cream/30"
              >
                Profil Saya
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
