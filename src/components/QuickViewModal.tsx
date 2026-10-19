'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || 'M';
  const currentImg = selectedImage || product.image;
  const inWish = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, currentSize, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'rgba(28, 25, 23, 0.7)', backdropFilter: 'blur(6px)', zIndex: 2200 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded overflow-hidden shadow-2xl position-relative row g-0"
        style={{ maxWidth: '850px', width: '100%', border: '1px solid #E8E2D7' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn btn-link position-absolute top-0 end-0 m-3 text-dark p-1"
          style={{ zIndex: 10 }}
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Image Preview & Gallery */}
        <div className="col-12 col-md-6 position-relative bg-sand" style={{ minHeight: '380px' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
            <Image
              src={currentImg}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
            />
          </div>

          {product.gallery && product.gallery.length > 1 && (
            <div className="position-absolute bottom-0 start-0 w-100 p-2 d-flex gap-2 justify-content-center bg-gradient-dark">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`btn p-0 border rounded ${currentImg === img ? 'border-warning' : 'border-light'}`}
                  style={{ width: '42px', height: '52px', overflow: 'hidden', position: 'relative' }}
                >
                  <Image src={img} alt="thumb" fill sizes="42px" style={{ objectFit: 'cover', objectPosition: 'center 10%' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="col-12 col-md-6 p-4 d-flex flex-column justify-content-between">
          <div>
            <span className="text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              {product.categoryLabel}
            </span>
            <h4 className="font-serif fw-bold mt-1 text-dark">{product.title}</h4>

            {/* Rating */}
            <div className="d-flex align-items-center gap-1 my-2">
              <div className="d-flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}
                  />
                ))}
              </div>
              <span className="ms-1 fw-semibold" style={{ fontSize: '0.8rem' }}>
                ({product.rating.toFixed(1)})
              </span>
              <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>
                &bull; {product.reviewsCount} reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="d-flex align-items-baseline gap-2 my-2">
              <span className="fs-4 fw-bold" style={{ color: 'var(--gold-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through small">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-muted small mt-2 mb-3">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-3">
              <span className="d-block fw-semibold mb-2" style={{ fontSize: '0.8rem' }}>
                Select Size:
              </span>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`btn btn-sm ${currentSize === s ? 'btn-dark' : 'btn-outline-secondary'}`}
                    style={{ minWidth: '40px', fontSize: '0.78rem' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-top d-flex gap-2">
            <button
              onClick={handleAdd}
              disabled={added}
              className="btn-ira-gold flex-grow-1 justify-content-center"
            >
              {added ? (
                <>
                  <Check size={16} /> ADDED TO BAG
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> ADD TO SHOPPING BAG
                </>
              )}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`btn border p-2 ${inWish ? 'text-danger bg-light' : 'text-dark'}`}
              title="Add to Wishlist"
              aria-label="Wishlist toggle"
            >
              <Heart size={20} fill={inWish ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="text-center mt-2">
            <Link
              href={`/product/${product.slug || product.id}`}
              onClick={onClose}
              className="text-muted small text-decoration-underline"
            >
              View Full Garment Details & Care
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
