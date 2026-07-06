/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { api } from './services/api';
import { MenuItem, Promo, Branch, User } from './types';

// Page components
import Header from './components/Header';
import Footer from './components/Footer';
import EyangAIChat from './components/EyangAIChat';
import HomeSection from './components/HomeSection';
import MenuSection from './components/MenuSection';
import ReservationsSection from './components/ReservationsSection';
import BranchesSection from './components/BranchesSection';
import CheckoutSection from './components/CheckoutSection';
import LoginSection from './components/LoginSection';
import ProfileSection from './components/ProfileSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import AdminSection from './components/AdminSection';

import { Loader2 } from 'lucide-react';

export default function App() {
  // Global States
  const [page, setPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

  // Catalog States from Backend
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial Boot loader
  useEffect(() => {
    // 1. Fetch catalog data from Express server
    Promise.all([
      api.getMenus(),
      api.getPromos(),
      api.getBranches()
    ]).then(([menusRes, promosRes, branchesRes]) => {
      setMenuItems(menusRes);
      setPromos(promosRes);
      setBranches(branchesRes);
    }).catch(err => {
      console.error('Error fetching core catalog data:', err);
    }).finally(() => {
      setIsLoading(false);
    });

    // 2. Check if user is logged in (session restored)
    const storedUser = sessionStorage.getItem('ayameyang_session_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        sessionStorage.removeItem('ayameyang_session_user');
      }
    }
  }, []);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(entry => entry.item.id === item.id);
      if (existing) {
        return prevCart.map(entry =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });

    // Elegant toast or indicator trigger
    console.log(`Added item ${item.name} to cart.`);
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(entry =>
        entry.item.id === itemId
          ? { ...entry, quantity: newQty }
          : entry
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(entry => entry.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth session helpers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('ayameyang_session_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ayameyang_session_user');
    setPage('home');
  };

  const totalCartCount = cart.reduce((total, entry) => total + entry.quantity, 0);

  // Render current routing section
  const renderPageContent = () => {
    switch (page) {
      case 'home':
        return (
          <HomeSection
            menuItems={menuItems}
            promos={promos}
            setPage={setPage}
            onAddToCart={handleAddToCart}
          />
        );
      case 'about':
        return <AboutSection />;
      case 'menu':
        return (
          <MenuSection
            menuItems={menuItems}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            setMenuItems={setMenuItems}
            currentUser={currentUser}
          />
        );
      case 'reservasi':
        return (
          <ReservationsSection
            currentUser={currentUser}
            setPage={setPage}
          />
        );
      case 'promo':
        return (
          <div className="py-12 bg-cream/20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
                  Daftar Promo
                </span>
                <h2 className="font-serif font-black text-3xl text-primary mt-3">Promo Hemat Hari Ini</h2>
                <p className="text-xs text-muted-text mt-1.5">Makan lezat sekeluarga tak perlu khawatir dompet tipis dengan promo kupon berkah dari Eyang.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promos.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl overflow-hidden border border-primary/10 shadow-premium group">
                    <div className="relative h-48 overflow-hidden bg-primary/5">
                      <img src={p.bannerUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300" />
                      <div className="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm font-mono">
                        DISKON {p.discountPercent}%
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif font-bold text-sm text-charcoal">{p.title}</h3>
                        <p className="text-xs text-muted-text leading-relaxed mt-1 font-sans">{p.description}</p>
                      </div>
                      <div className="flex justify-between items-center bg-cream/35 p-3 rounded-2xl border border-primary/5">
                        <span className="text-[10px] text-muted-text uppercase font-bold">KODE KUPON:</span>
                        <span className="font-mono font-bold text-primary text-sm uppercase tracking-wider">{p.code}</span>
                      </div>
                      <div className="text-[10px] text-muted-text font-semibold flex justify-between">
                        <span>Min. Belanja:</span>
                        <span className="text-charcoal font-bold font-mono">Rp {p.minPurchase.toLocaleString('id-ID')}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(p.code);
                          alert(`Kode kupon "${p.code}" berhasil disalin!`);
                        }}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-premium uppercase cursor-pointer text-center block transition-all"
                      >
                        Salin Kode Kupon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'cabang':
        return (
          <BranchesSection
            branches={branches}
            isLoading={isLoading}
          />
        );
      case 'kontak':
        return <ContactSection />;
      case 'cart':
      case 'checkout':
        return (
          <CheckoutSection
            cart={cart}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            promos={promos}
            currentUser={currentUser}
            setPage={setPage}
          />
        );
      case 'login':
        return (
          <LoginSection
            onLoginSuccess={handleLoginSuccess}
            setPage={setPage}
          />
        );
      case 'profile':
        return (
          <ProfileSection
            currentUser={currentUser}
            setPage={setPage}
          />
        );
      case 'admin':
        return (
          <AdminSection
            currentUser={currentUser}
            setPage={setPage}
            setMenuItems={setMenuItems}
          />
        );
      default:
        return (
          <div className="py-20 text-center text-charcoal">
            <h2 className="font-serif font-black text-2xl">Halaman Tidak Ditemukan</h2>
            <button onClick={() => setPage('home')} className="mt-4 bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold">Kembali ke Beranda</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream/15 text-charcoal">
      {/* Header Sticky navigation */}
      <Header
        currentPage={page}
        setPage={setPage}
        cartCount={totalCartCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main app body screen router */}
      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="text-xs text-primary/75 font-mono tracking-wider animate-pulse">Menghangatkan Kuali AyamEyang...</span>
          </div>
        ) : (
          renderPageContent()
        )}
      </main>

      {/* Footer Segment */}
      <Footer setPage={setPage} />

      {/* Eyang AI Floating Chatbot Assistant */}
      <EyangAIChat />
    </div>
  );
}
