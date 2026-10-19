'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);
  const [heartPulsing, setHeartPulsing] = useState(false);
  const inWish = isInWishlist(product.id);

  // Compute discount percentage if original price exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || 'M';
    addToCart(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartPulsing(true);
    toggleWishlist(product);
    setTimeout(() => setHeartPulsing(false), 600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div 
      className="ira-product-card-premium"
      style={{ animationDelay: `${(index % 5) * 0.08}s` }}
    >
      {/* Top Badges: Discount / Exclusive & Wishlist */}
      <div className="product-card-badges-row">
        {discountPercent ? (
          <span className="product-badge-discount">
            {discountPercent}% OFF
          </span>
        ) : (product.isFeatured || (product as any).featured) ? (
          <span className="product-badge-featured">
            <Sparkles size={10} className="me-1" /> EXCLUSIVE
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={handleWishlist}
          className={`wishlist-btn-premium ${inWish ? 'active' : ''} ${heartPulsing ? 'heart-pulse' : ''}`}
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart 
            size={15} 
            fill={inWish ? '#C53030' : 'none'} 
            color={inWish ? '#C53030' : '#4A4238'} 
            strokeWidth={inWish ? 0 : 2}
          />
        </button>
      </div>

      {/* Product Image & Hover Action Overlay */}
      <Link href={`/product/${product.slug || product.id}`} className="ira-product-thumb-premium d-block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />

        {/* Subtle Quick View button on hover (desktop only) */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="btn-overlay-quickview-circle"
            title="Quick Preview"
            aria-label="Quick View"
          >
            <Eye size={15} />
          </button>
        )}
      </Link>

      {/* Card Info & Details */}
      <div className="card-info-box p-3 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <span className="category-tag-subtle">
            {(product.categoryLabel || product.category).toUpperCase()}
          </span>
          <Link
            href={`/product/${product.slug || product.id}`}
            className="product-title-link text-truncate d-block mb-1 font-serif"
          >
            {product.title}
          </Link>
          <div className="d-flex align-items-baseline gap-2 mb-2">
            <span className="price-tag-gold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="price-tag-original">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action Row (Always visible for mobile & desktop) */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-1">
          <div className="d-flex align-items-center text-warning" style={{ fontSize: '0.74rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                className={i < Math.floor(product.rating || 5) ? 'text-warning' : 'text-muted'}
              />
            ))}
            <span className="ms-1 text-muted" style={{ fontSize: '0.72rem' }}>
              ({(product.rating || 4.8).toFixed(1)})
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`btn-icon-add-bag ${added ? 'btn-icon-added' : ''}`}
            title={added ? "Added to Bag" : "Add to Bag"}
            aria-label="Add to Bag"
            disabled={added}
          >
            {added ? (
              <Check size={14} />
            ) : (
              <ShoppingBag size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
