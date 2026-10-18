'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EDE5D8] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EDE5D8] flex items-center justify-between bg-white/70">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#B68D56]" />
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl font-medium tracking-wide text-[#231F1C]"
              >
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8F867C] hover:text-[#231F1C] rounded-full hover:bg-[#F2ECE0] transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="px-6 py-3.5 bg-[#F4EFE6] border-b border-[#EDE5D8]/80 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#5A524A] mb-2 font-medium">
                Add <span className="text-[#B68D56] font-semibold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more to qualify for <span className="font-semibold">FREE DELIVERY</span>!
              </p>
            ) : (
              <p className="text-[#3F6A44] mb-2 font-semibold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked Free Shipping.
              </p>
            )}
            <div className="w-full bg-[#E5DDCF] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#B68D56] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EDE5D8]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#B68D56] mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.4]" />
                </div>
                <h3
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="text-2xl text-[#231F1C] font-medium mb-1"
                >
                  Your bag is empty
                </h3>
                <p className="text-sm text-[#8F867C] max-w-xs mb-6 font-light">
                  Explore our luxury ethnic collections and find timeless elegance crafted for you.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="gold-btn px-6 py-3 text-xs tracking-widest uppercase rounded-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="py-4 flex gap-4">
                  <div className="relative w-20 h-28 bg-[#EDE5D8] rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-medium text-[#231F1C] hover:text-[#B68D56] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-[#9E948A] hover:text-[#C53030] p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#7B7268] mt-1 space-x-2">
                        <span>Size: <strong className="text-[#3D3731]">{item.size}</strong></span>
                        <span>•</span>
                        <span>{item.product.category}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-[#EDE5D8] rounded-sm bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="p-1 px-2 text-[#7B7268] hover:text-[#231F1C] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-[#231F1C] min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="p-1 px-2 text-[#7B7268] hover:text-[#231F1C] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#231F1C]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-[#EDE5D8] p-6 bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-[#6F665C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#231F1C]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-[#3F6A44]">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#EDE5D8] text-sm font-semibold text-[#231F1C]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#B68D56]">
                    ₹{(cartTotal + (remainingForFreeShipping === 0 ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="gold-btn w-full py-3.5 text-xs rounded-sm tracking-widest uppercase flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
