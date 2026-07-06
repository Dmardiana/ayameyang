/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Eye, ArrowUpDown, ChevronLeft, ChevronRight, MessageSquare, AlertCircle, Sparkles, X } from 'lucide-react';
import { MenuItem, MenuCategory, Review } from '../types';
import { api } from '../services/api';

interface MenuSectionProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  onAddToCart: (item: MenuItem) => void;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  currentUser: any;
}

export default function MenuSection({ menuItems, isLoading, onAddToCart, setMenuItems, currentUser }: MenuSectionProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'semua'>('semua');
  const [sortBy, setSortBy] = useState<'rating' | 'sold' | 'priceAsc' | 'priceDesc'>('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected item for Detail Modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedItemReviews, setSelectedItemReviews] = useState<Review[]>([]);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // New review form
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Sync reviewer name if user logged in
  useEffect(() => {
    if (currentUser) {
      setNewReviewName(currentUser.name);
    }
  }, [currentUser]);

  // Load reviews when modal opens
  useEffect(() => {
    if (selectedItem) {
      setIsReviewLoading(true);
      api.getReviews()
        .then(allReviews => {
          const filtered = allReviews.filter(r => r.menuId === selectedItem.id);
          setSelectedItemReviews(filtered);
        })
        .catch(err => console.error(err))
        .finally(() => setIsReviewLoading(false));
    }
  }, [selectedItem]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Filter and sort items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'sold') return b.soldCount - a.soldCount;
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  // Pagination bounds
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !newReviewName.trim() || !newReviewComment.trim()) return;

    setIsReviewSubmitting(true);
    setReviewSuccessMessage('');

    try {
      const reviewPayload = {
        customerName: newReviewName,
        rating: newReviewRating,
        comment: newReviewComment,
        menuId: selectedItem.id,
        menuName: selectedItem.name
      };

      const addedReview = await api.createReview(reviewPayload);
      setSelectedItemReviews(prev => [addedReview, ...prev]);

      // Refresh parent menu rating and updates locally
      const updatedMenus = await api.getMenus();
      setMenuItems(updatedMenus);

      // Update the currently viewed modal rating
      const updatedItem = updatedMenus.find(m => m.id === selectedItem.id);
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }

      setNewReviewComment('');
      setReviewSuccessMessage('Ulasan Anda berhasil dikirim! Terima kasih banyak, Sayang.');
      setTimeout(() => setReviewSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const categoriesList: { id: MenuCategory | 'semua'; label: string }[] = [
    { id: 'semua', label: 'Semua Hidangan' },
    { id: 'makanan', label: 'Olahan Makanan' },
    { id: 'minuman', label: 'Minuman Segar' },
    { id: 'dessert', label: 'Pencuci Mulut' }
  ];

  return (
    <section className="py-12 bg-cream/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono">
            Menu Nusantara
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl text-primary mt-3 tracking-tight">
            Cita Rasa Warisan Leluhur
          </h2>
          <p className="text-charcoal/70 text-xs mt-2 leading-relaxed">
            Semua olahan ayam resep pusaka dibumbui rempah murni tanpa bahan pengawet. Pilih sesuai selera dan rasakan kehangatannya.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-5 shadow-premium border border-primary/5 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-premium border border-transparent'
                    : 'bg-cream/40 text-charcoal/70 hover:bg-cream hover:text-primary border border-primary/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari masakan kesukaanmu..."
                className="w-full bg-cream/30 border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-text/50"
              />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-text/60 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-cream/30 border border-primary/10 rounded-xl pl-10 pr-8 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-charcoal appearance-none font-semibold cursor-pointer"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="sold">Menu Terlaris</option>
                <option value="priceAsc">Harga Termurah</option>
                <option value="priceDesc">Harga Termahal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-premium animate-pulse">
                <div className="h-48 bg-primary/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-primary/10 rounded w-2/3" />
                  <div className="h-3 bg-primary/5 rounded w-full" />
                  <div className="h-3 bg-primary/5 rounded w-5/6" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-primary/10 rounded w-1/3" />
                    <div className="h-9 bg-primary/10 rounded-xl w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {paginatedItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-primary/5 shadow-premium max-w-lg mx-auto">
                <AlertCircle className="w-12 h-12 text-primary mx-auto opacity-40 mb-3" />
                <h3 className="font-serif font-bold text-lg text-charcoal">Menu Tidak Ditemukan</h3>
                <p className="text-xs text-muted-text mt-1.5 leading-relaxed">
                  Kami tidak dapat menemukan masakan dengan kata kunci tersebut. Cobalah mengganti filter pencarian atau tanyakan rekomendasi ke Eyang AI.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('semua');
                  }}
                  className="mt-4 bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              /* Grid Items */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-primary/5 hover:border-primary/20 shadow-premium hover:shadow-premium-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden bg-primary/5 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Floating Category Badge */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                        {item.category}
                      </span>

                      {/* Stock availability status */}
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-charcoal/65 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-secondary font-bold text-xs tracking-wider uppercase border-2 border-secondary px-3.5 py-1.5 rounded-lg">
                            Habis Di dapur
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        {/* Rating & Sold count */}
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-0.5">{item.rating}</span>
                          </div>
                          <span className="text-muted-text/30">|</span>
                          <span className="text-muted-text text-[11px]">{item.soldCount} terjual</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif font-black text-sm text-charcoal leading-tight group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] text-muted-text line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Price & Actions footer */}
                      <div className="pt-4 flex items-center justify-between mt-auto">
                        <span className="font-mono font-bold text-sm text-primary">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>

                        <div className="flex gap-1.5">
                          {/* View Detail trigger */}
                          <button
                            onClick={() => setSelectedItem(item)}
                            title="Detail Menu"
                            className="bg-cream/40 hover:bg-primary/5 text-primary p-2 rounded-xl transition-all border border-primary/5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Add to Cart button */}
                          <button
                            disabled={!item.isAvailable}
                            onClick={() => onAddToCart(item)}
                            className="bg-primary hover:bg-primary-hover disabled:bg-charcoal/20 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Pesan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="bg-white border border-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-primary cursor-pointer"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <span className="font-mono text-xs font-bold text-charcoal bg-white px-4 py-2 rounded-xl border border-primary/5">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="bg-white border border-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-primary cursor-pointer"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* --- DETAIL MENU MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-premium-lg max-w-3xl w-full border border-primary/10 relative max-h-[90vh] flex flex-col md:flex-row animate-scale-in">
            
            {/* Image Area */}
            <div className="md:w-1/2 relative bg-primary/5 h-64 md:h-auto">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider font-mono">
                {selectedItem.category}
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="md:hidden absolute top-4 right-4 bg-white/90 text-charcoal hover:bg-white p-2 rounded-full shadow-md"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between max-h-[80vh] md:max-h-[90vh]">
              <div>
                {/* Close Button Desktop */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:block absolute top-4 right-4 bg-cream/80 text-charcoal hover:bg-primary hover:text-white p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Rating Header */}
                <div className="flex items-center gap-3 text-xs text-charcoal/70 mb-2">
                  <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-0.5">{selectedItem.rating}</span>
                  </div>
                  <span>&bull;</span>
                  <span className="font-mono text-primary font-bold">{selectedItem.soldCount} Terjual</span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-black text-xl text-primary leading-tight">
                  {selectedItem.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-charcoal/70 leading-relaxed mt-3 font-sans">
                  {selectedItem.description}
                </p>

                {/* Ingredients tag listing */}
                <div className="mt-4 pt-4 border-t border-primary/5">
                  <h4 className="font-serif font-bold text-xs text-charcoal mb-2">Komposisi Bahan</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Rempah Asli Nusantara', 'Minyak Nabati', 'Bahan Segar Pilihan', 'Tanpa Pengawet Buatan'].map((ing, i) => (
                      <span key={i} className="text-[10px] bg-cream text-primary border border-primary/10 px-2.5 py-1 rounded-full font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* REVIEWS SEGMENT */}
                <div className="mt-5 pt-4 border-t border-primary/5">
                  <h4 className="font-serif font-bold text-xs text-charcoal mb-2.5 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Ulasan Pelanggan ({selectedItemReviews.length})</span>
                  </h4>

                  {isReviewLoading ? (
                    <div className="space-y-2 py-2">
                      <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
                      <div className="h-10 bg-primary/5 rounded-xl animate-pulse" />
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                      {selectedItemReviews.length === 0 ? (
                        <p className="text-[10px] text-muted-text italic">Belum ada ulasan untuk hidangan ini. Jadilah yang pertama memberikan ulasan, Sayang!</p>
                      ) : (
                        selectedItemReviews.map((rev) => (
                          <div key={rev.id} className="bg-cream/20 p-2.5 rounded-xl border border-primary/5 text-[11px] leading-relaxed">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-charcoal">{rev.customerName}</span>
                              <div className="flex items-center text-amber-500 gap-0.5">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="font-bold text-[10px]">{rev.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted-text font-sans">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="mt-4 bg-cream/15 p-3 rounded-xl border border-primary/5 space-y-2">
                    <h5 className="font-bold text-[10px] text-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      <span>Berikan Ulasan Rasa</span>
                    </h5>
                    
                    {reviewSuccessMessage && (
                      <p className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg">{reviewSuccessMessage}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="Nama Anda"
                        disabled={!!currentUser}
                        className="bg-white border border-primary/10 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-75"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                        className="bg-white border border-primary/10 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary font-bold text-amber-500"
                      >
                        <option value="5">Bintang 5</option>
                        <option value="4">Bintang 4</option>
                        <option value="3">Bintang 3</option>
                        <option value="2">Bintang 2</option>
                        <option value="1">Bintang 1</option>
                      </select>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Komentar ulasan rasa..."
                        className="flex-1 bg-white border border-primary/10 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={isReviewSubmitting}
                        className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        Kirim
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Price & Cart Segment */}
              <div className="mt-6 pt-4 border-t border-primary/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-text block uppercase font-bold tracking-wider">Harga Hidangan</span>
                  <span className="font-mono font-bold text-lg text-primary">
                    Rp {selectedItem.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  disabled={!selectedItem.isAvailable}
                  onClick={() => {
                    onAddToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="bg-primary hover:bg-primary-hover disabled:bg-charcoal/20 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-premium active:scale-95 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-secondary" />
                  <span>Tambahkan Ke Keranjang</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
