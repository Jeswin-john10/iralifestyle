'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingRemaining,
    discount,
    promoCode,
    applyPromo,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromo(inputCode);
    setPromoMessage({ text: res.message, success: res.success });
  };

  const shippingFee = 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + shippingFee);

  if (cart.length === 0) {
    return (
      <div className="py-5 text-center min-vh-60 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="p-4 rounded-circle bg-white border mb-3">
          <ShoppingBag size={48} color="var(--gold-primary)" />
        </div>
        <h2 className="font-serif">Your Bag Is Currently Empty</h2>
        <p className="text-muted small mb-4">Discover our handcrafted ethnic wear collection and find your style.</p>
        <Link href="/shop" className="btn-ira-gold">EXPLORE COLLECTION</Link>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <h1 className="font-serif display-6 fw-normal text-dark mb-4">
          Shopping Bag ({cart.length})
        </h1>

        <div className="row gy-4">
          {/* Cart Items Table */}
          <div className="col-12 col-lg-8">
            <div className="bg-white rounded border p-4 shadow-sm">
              <div className="d-flex flex-column gap-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="row align-items-center pb-4 border-bottom g-3">
                    <div className="col-3 col-sm-2">
                      <div 
                        className="position-relative rounded overflow-hidden" 
                        style={{ aspectRatio: '3/4', backgroundColor: '#F8F5EE' }}
                      >
                        <Image src={item.product.image} alt={item.product.title} fill sizes="100px" style={{ objectFit: 'cover', objectPosition: 'center 10%' }} />
                      </div>
                    </div>

                    <div className="col-9 col-sm-5">
                      <span className="text-muted text-uppercase small" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                        {item.product.categoryLabel}
                      </span>
                      <h5 className="font-serif fs-6 mb-1 text-dark">{item.product.title}</h5>
                      <span className="badge bg-light text-secondary border">Size: {item.selectedSize}</span>
                    </div>

                    <div className="col-6 col-sm-3 d-flex align-items-center">
                      <div className="d-flex align-items-center border rounded bg-sand px-2" style={{ height: '34px' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)} className="btn btn-link p-1 text-dark">
                          <Minus size={13} />
                        </button>
                        <span className="px-2 fw-semibold" style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)} className="btn btn-link p-1 text-dark">
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="col-6 col-sm-2 text-end">
                      <span className="fw-bold d-block" style={{ color: 'var(--gold-primary)', fontSize: '0.96rem' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)} 
                        className="btn btn-link p-0 text-muted small mt-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3">
                <Link href="/shop" className="text-muted small text-decoration-underline">
                  &larr; Continue Exploring Products
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded border p-4 shadow-sm">
              <h5 className="font-serif fw-bold text-dark mb-3">Order Summary</h5>

              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="mb-3">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light border-end-0">
                    <Tag size={13} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    placeholder="Coupon Code (IRA10)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="form-control text-uppercase"
                  />
                  <button type="submit" className="btn btn-dark">APPLY</button>
                </div>
              </form>

              {promoMessage && (
                <p className={`small mb-3 ${promoMessage.success ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem' }}>
                  {promoMessage.text}
                </p>
              )}

              <div className="d-flex justify-content-between text-muted mb-2 small">
                <span>Bag Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between text-success mb-2 small">
                  <span>Celebratory Discount ({promoCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="d-flex justify-content-between text-muted mb-3 small">
                <span>Standard Express Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-success">FREE</strong> : `₹${shippingFee}`}</span>
              </div>

              <div className="d-flex justify-content-between text-dark fw-bold fs-5 pt-3 border-top mb-4">
                <span>Estimated Total</span>
                <span style={{ color: 'var(--gold-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <Link href="/checkout" className="btn-ira-gold w-100 justify-content-center py-3 text-center mb-3">
                PROCEED TO SECURE CHECKOUT <ArrowRight size={16} />
              </Link>

              <div className="text-center text-muted small d-flex align-items-center justify-content-center gap-1">
                <ShieldCheck size={15} color="var(--gold-primary)" />
                <span>Encrypted 256-bit Payment Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
