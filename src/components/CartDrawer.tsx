'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles, Lock } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingRemaining,
    discount,
    promoCode,
    applyPromo,
  } = useCart();
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, success: res.success });
  };

  const shippingFee = 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + shippingFee);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ backgroundColor: 'rgba(28, 25, 23, 0.65)', backdropFilter: 'blur(6px)', zIndex: 2100 }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="position-fixed top-0 end-0 h-100 bg-white d-flex flex-column shadow-2xl"
        style={{ width: '100%', maxWidth: '440px', transition: 'transform 0.3s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-sand">
          <div className="d-flex align-items-center gap-2">
            <ShoppingBag size={20} color="var(--gold-primary)" />
            <h5 className="mb-0 font-serif fs-5 fw-bold text-dark">Your Shopping Bag</h5>
            <span className="badge bg-white text-dark border ms-1">{cart.length}</span>
          </div>
          <button
            className="btn btn-link p-0 text-dark"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        <div className="px-4 py-2 border-bottom text-center" style={{ backgroundColor: '#FAF7F2' }}>
          <p className="mb-0 text-success fw-semibold" style={{ fontSize: '0.78rem' }}>
            🎉 Complimentary <strong>FREE Standard Delivery</strong> on all orders!
          </p>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3">
          {cart.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center py-5">
              <div
                className="rounded-circle p-4 mb-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'var(--gold-soft)', width: '80px', height: '80px' }}
              >
                <ShoppingBag size={36} color="var(--gold-primary)" />
              </div>
              <h5 className="font-serif fw-bold">Your Bag is Empty</h5>
              <p className="text-muted small px-3 mb-4">
                Discover timeless grace in our latest ethnic wear collection.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="btn-ira-gold"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="d-flex gap-3 pb-3 border-bottom position-relative"
              >
                <div
                  style={{
                    position: 'relative',
                    width: '74px',
                    height: '96px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#FAF7F2',
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    sizes="74px"
                    style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                  />
                </div>

                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start pe-3">
                      <Link
                        href={`/product/${item.product.slug || item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-decoration-none text-dark fw-semibold"
                        style={{ fontSize: '0.85rem' }}
                      >
                        {item.product.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="btn btn-link p-0 text-muted hover-danger"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <span className="badge border bg-light text-secondary mt-1" style={{ fontSize: '0.68rem' }}>
                      Size: {item.selectedSize}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <div
                      className="d-flex align-items-center border rounded"
                      style={{ height: '28px', backgroundColor: '#FDFBF7' }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                        className="btn btn-link p-1 text-dark"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                        className="btn btn-link p-1 text-dark"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="fw-bold" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem' }}>
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-top bg-white">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="d-flex gap-2 mb-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <Tag size={14} className="text-muted" />
                </span>
                <input
                  type="text"
                  placeholder="Promo Code (Try IRA10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="form-control border-start-0 text-uppercase"
                  style={{ fontSize: '0.78rem' }}
                />
                <button type="submit" className="btn btn-dark" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  APPLY
                </button>
              </div>
            </form>

            {promoMessage && (
              <p
                className={`small mb-2 ${promoMessage.success ? 'text-success' : 'text-danger'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {promoMessage.text}
              </p>
            )}

            {/* Calculations */}
            <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: '0.82rem' }}>
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="d-flex justify-content-between text-success mb-1" style={{ fontSize: '0.82rem' }}>
                <span>Coupon ({promoCode})</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: '0.82rem' }}>
              <span>Standard Delivery</span>
              <span>{shippingFee === 0 ? <strong className="text-success">FREE</strong> : `₹${shippingFee}`}</span>
            </div>

            <div className="d-flex justify-content-between text-dark fw-bold fs-6 pt-2 border-top mb-3">
              <span>Grand Total</span>
              <span style={{ color: 'var(--gold-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  openAuthModal();
                }}
                className="btn-ira-gold w-100 justify-content-center text-center py-3 mb-2 d-flex align-items-center gap-2"
              >
                <Lock size={16} />
                <span>SIGN IN TO BUY NOW</span>
              </button>
            ) : (
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-ira-gold w-100 justify-content-center text-center py-3 mb-2"
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </Link>
            )}

            <div className="text-center mt-2 d-flex align-items-center justify-content-center gap-1 text-muted" style={{ fontSize: '0.7rem' }}>
              <ShieldCheck size={14} color="var(--gold-primary)" />
              <span>Authentic Handcrafted • 100% Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
