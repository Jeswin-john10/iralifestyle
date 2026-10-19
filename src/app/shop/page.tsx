'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/initialData';
import { useCart } from '@/context/CartContext';
import { Star, Heart, Eye, Filter, ArrowUpDown, Check } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { toggleWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

        {/* Filter & Sort Bar */}
        <div className="bg-white p-3 rounded border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm">
          {/* Category Chips */}
          <div className="d-flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.76rem', letterSpacing: '0.08em' }}
            >
              ALL ITEMS
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`btn btn-sm ${selectedCategory === cat.slug ? 'btn-dark' : 'btn-outline-secondary'}`}
                style={{ fontSize: '0.76rem', letterSpacing: '0.08em' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & Price Filter */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small text-nowrap">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="1500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="form-range"
                style={{ width: '110px' }}
              />
            </div>

            <div className="d-flex align-items-center gap-1">
              <ArrowUpDown size={14} className="text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select form-select-sm border"
                style={{ fontSize: '0.78rem', minWidth: '130px' }}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
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
