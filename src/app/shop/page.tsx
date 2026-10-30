'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, Heart, Eye, Filter, ArrowUpDown, Check, ChevronLeft, ChevronRight, X, RotateCcw } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { toggleWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Category horizontal scroll controls
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkCategoryScroll();
    window.addEventListener('resize', checkCategoryScroll);
    return () => window.removeEventListener('resize', checkCategoryScroll);
  }, [categories, products]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkCategoryScroll, 320);
    }
  };

  // Fetch categories from DB
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Fetch categories error', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products from DB
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = selectedCategory === 'all' 
          ? '/api/products' 
          : `/api/products?category=${selectedCategory}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Fetch products error', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  // Client-side filtering & sorting
  const filteredProducts = products
    .filter((p) => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="text-center mb-5">
          <nav className="mb-2 text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>
            <Link href="/" className="text-muted text-decoration-none hover-gold">HOME</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-dark fw-semibold">SHOP ALL</span>
          </nav>
          <h1 className="font-serif display-5 fw-normal text-dark">
            The Royal Wardrobe
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.88rem' }}>
            Immerse in contemporary cuts, royal fabrics, and timeless festive silhouettes hand-embroidered by Indian artisans.
          </p>
        </div>

        {/* Luxury Responsive Filter & Category Bar */}
        <div 
          className="bg-white rounded-3 border mb-4 shadow-sm position-relative overflow-hidden"
          style={{ borderColor: '#EAE2D5' }}
        >
          {/* TIER 1: Category Chips Navigation with hidden scrollbar and responsive touch swipe */}
          <div className="p-3 pb-2 position-relative">
            <div className="d-flex align-items-center position-relative">
              {/* Left Scroll Chevron (Desktop / Tablet) */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="btn btn-sm position-absolute start-0 rounded-circle d-none d-md-flex align-items-center justify-content-center p-0 shadow-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    border: '1px solid #DFD5C5',
                    color: '#221F1E',
                    zIndex: 5,
                    left: '-6px',
                  }}
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {/* Scrollable Track */}
              <div
                ref={categoryScrollRef}
                onScroll={checkCategoryScroll}
                className="hide-scrollbar d-flex align-items-center gap-2 overflow-auto w-100 py-1"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  paddingLeft: canScrollLeft ? '28px' : '2px',
                  paddingRight: canScrollRight ? '28px' : '2px',
                  transition: 'padding 0.2s ease',
                }}
              >
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="btn btn-sm text-nowrap transition"
                  style={{
                    fontSize: '0.78rem',
                    letterSpacing: '0.04em',
                    fontWeight: selectedCategory === 'all' ? 600 : 500,
                    borderRadius: '24px',
                    padding: '7px 16px',
                    backgroundColor: selectedCategory === 'all' ? '#1E1B18' : '#FBF8F2',
                    color: selectedCategory === 'all' ? '#FBF8F2' : '#4A423B',
                    border: `1px solid ${selectedCategory === 'all' ? '#C5A880' : '#E5DCD0'}`,
                    boxShadow: selectedCategory === 'all' ? '0 2px 8px rgba(166, 124, 67, 0.25)' : 'none',
                  }}
                >
                  ALL PIECES <span className="opacity-75 ms-1">({products.length})</span>
                </button>

                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id || cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className="btn btn-sm text-nowrap transition"
                      style={{
                        fontSize: '0.78rem',
                        letterSpacing: '0.04em',
                        fontWeight: isActive ? 600 : 500,
                        borderRadius: '24px',
                        padding: '7px 16px',
                        backgroundColor: isActive ? '#1E1B18' : '#FBF8F2',
                        color: isActive ? '#FBF8F2' : '#4A423B',
                        border: `1px solid ${isActive ? '#C5A880' : '#E5DCD0'}`,
                        boxShadow: isActive ? '0 2px 8px rgba(166, 124, 67, 0.25)' : 'none',
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Chevron (Desktop / Tablet) */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="btn btn-sm position-absolute end-0 rounded-circle d-none d-md-flex align-items-center justify-content-center p-0 shadow-sm"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    border: '1px solid #DFD5C5',
                    color: '#221F1E',
                    zIndex: 5,
                    right: '-6px',
                  }}
                  aria-label="Scroll categories right"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* TIER 2: Secondary Controls (Results Count, Price Slider, Sort Dropdown & Reset) */}
          <div 
            className="p-3 pt-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3"
            style={{ 
              backgroundColor: '#FAFAF7', 
              borderTop: '1px solid #EAE3D6' 
            }}
          >
            {/* Left: Summary & Active filter pills */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Showing <strong className="text-dark">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </span>

              {selectedCategory !== 'all' && (
                <span 
                  className="badge d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
                  style={{
                    backgroundColor: '#F3EFE8',
                    color: '#4A423B',
                    border: '1px solid #D8C7B0',
                    fontSize: '0.74rem',
                    fontWeight: 500,
                  }}
                >
                  {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="btn p-0 border-0 bg-transparent text-muted hover-gold ms-1"
                    style={{ lineHeight: 1 }}
                    aria-label="Remove category filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {maxPrice < 10000 && (
                <span 
                  className="badge d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill"
                  style={{
                    backgroundColor: '#F3EFE8',
                    color: '#4A423B',
                    border: '1px solid #D8C7B0',
                    fontSize: '0.74rem',
                    fontWeight: 500,
                  }}
                >
                  Under ₹{maxPrice.toLocaleString('en-IN')}
                  <button
                    type="button"
                    onClick={() => setMaxPrice(10000)}
                    className="btn p-0 border-0 bg-transparent text-muted hover-gold ms-1"
                    style={{ lineHeight: 1 }}
                    aria-label="Reset price filter"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {(selectedCategory !== 'all' || maxPrice < 10000 || sortBy !== 'featured') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxPrice(10000);
                    setSortBy('featured');
                  }}
                  className="btn btn-link p-0 text-decoration-none text-muted hover-gold d-inline-flex align-items-center gap-1 ms-1"
                  style={{ fontSize: '0.76rem', letterSpacing: '0.04em' }}
                >
                  <RotateCcw size={12} />
                  Reset all
                </button>
              )}
            </div>

            {/* Right: Controls (Price Slider & Sort By) */}
            <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3 w-100 w-md-auto flex-wrap flex-sm-nowrap">
              {/* Price Range Slider */}
              <div 
                className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3 border bg-white flex-grow-1 flex-sm-grow-0"
                style={{ borderColor: '#E3DAC9' }}
              >
                <div className="d-flex flex-column" style={{ minWidth: '95px' }}>
                  <span className="text-uppercase text-muted" style={{ fontSize: '0.62rem', letterSpacing: '0.08em' }}>
                    Max Price
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: '0.82rem' }}>
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="ira-range-slider form-range m-0"
                  style={{ width: '110px' }}
                  aria-label="Filter by maximum price"
                />
              </div>

              {/* Sort By Dropdown */}
              <div 
                className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3 border bg-white flex-grow-1 flex-sm-grow-0"
                style={{ borderColor: '#E3DAC9' }}
              >
                <ArrowUpDown size={14} style={{ color: '#A67C43' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select form-select-sm border-0 p-0 bg-transparent text-dark fw-medium"
                  style={{ 
                    fontSize: '0.82rem', 
                    minWidth: '130px', 
                    boxShadow: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label="Sort products by"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-5 text-center text-muted">
            <p>Curating IRA collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-5 text-center rounded border my-4">
            <p className="text-muted mb-3">No pieces match your selected filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setMaxPrice(10000); }}
              className="btn-ira-gold"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
            {filteredProducts.map((prod, idx) => (
              <div key={prod.id} className="col">
                <ProductCard
                  product={prod}
                  onQuickView={setQuickViewProduct}
                  index={idx}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
