'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="py-5 text-center min-vh-60 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="p-4 rounded-circle bg-white border mb-3">
          <Heart size={48} color="var(--gold-primary)" />
        </div>
        <h2 className="font-serif">Your Wishlist is Empty</h2>
        <p className="text-muted small mb-4">Save your favorite ethnic pieces to review and style them later.</p>
        <Link href="/shop" className="btn-ira-gold">EXPLORE COLLECTION</Link>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2', minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom">
          <div>
            <h1 className="font-serif fw-normal text-dark mb-1" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>
              Saved For Later <span className="text-muted" style={{ fontSize: '0.85em' }}>({wishlist.length})</span>
            </h1>
            <p className="text-muted small mb-0">Your curated private wardrobe wishlist</p>
          </div>
          <Link href="/shop" className="btn-ira-outline text-nowrap">
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
          {wishlist.map((prod, idx) => (
            <div key={prod.id} className="col">
              <div 
                className="ira-product-card-premium"
                style={{ animationDelay: `${(idx % 4) * 0.08}s` }}
              >
                <button
                  onClick={() => toggleWishlist(prod)}
                  className="wishlist-btn-premium active"
                  style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 6 }}
                  title="Remove from wishlist"
                  aria-label="Remove wishlist"
                >
                  <Trash2 size={15} color="#D32F2F" />
                </button>

                <Link href={`/product/${prod.slug || prod.id}`} className="ira-product-thumb-premium d-block">
                  <Image src={prod.image} alt={prod.title} fill sizes="250px" style={{ objectFit: 'cover', objectPosition: 'center top' }} />
                </Link>

                <div className="card-info-box p-3 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <span className="category-tag-subtle">
                      {prod.categoryLabel}
                    </span>
                    <Link
                      href={`/product/${prod.slug || prod.id}`}
                      className="product-title-link text-truncate d-block mb-1"
                    >
                      {prod.title}
                    </Link>
                    <span className="price-tag-gold d-block">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(prod, prod.sizes?.[0] || 'M', 1);
                      toggleWishlist(prod);
                    }}
                    className="btn btn-dark w-100 mt-3 py-2 text-uppercase d-flex align-items-center justify-content-center gap-2"
                    style={{ fontSize: '0.74rem', letterSpacing: '0.1em', backgroundColor: 'var(--text-dark)' }}
                  >
                    <ShoppingBag size={14} /> MOVE TO BAG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
