'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/initialData';
import { useCart } from '@/context/CartContext';
import { Star, Heart, Eye } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import ProductCard from '@/components/ProductCard';

function CategoryContent() {
  const params = useParams();
  const categorySlug = (params.category as string) || '';
  const { toggleWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>(() =>
    INITIAL_PRODUCTS.filter((p) => p.category.toLowerCase() === categorySlug.toLowerCase())
  );
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categoryMeta = CATEGORIES.find((c) => c.slug === categorySlug) || {
    name: categorySlug.toUpperCase(),
    tagline: 'Timeless luxury and craftsmanship',
  };

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?category=${categorySlug}`);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setLoading(false);
      }
    }
    if (categorySlug) {
      loadCategoryProducts();
    }
  }, [categorySlug]);

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div className="text-center mb-5">
          <nav className="mb-2 text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>
            <Link href="/" className="text-muted text-decoration-none hover-gold">HOME</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/shop" className="text-muted text-decoration-none hover-gold">SHOP</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-dark fw-semibold text-uppercase">{categoryMeta.name}</span>
          </nav>
          <h1 className="font-serif display-5 fw-normal text-dark text-uppercase">
            {categoryMeta.name}
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.88rem' }}>
            {categoryMeta.tagline}
          </p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="py-5 text-center text-muted">Curating items...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-5 text-center rounded border my-4">
            <p className="text-muted mb-3">No pieces currently listed in this category.</p>
            <Link href="/shop" className="btn-ira-gold">
              VIEW ALL COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
            {products.map((prod, idx) => (
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center text-muted">Loading collection...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
