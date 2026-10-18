'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart, wishlistCount } =
    useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#EDE5D8] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EDE5D8] flex items-center justify-between bg-white/70">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 text-[#B68D56] fill-[#B68D56]" />
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl font-medium tracking-wide text-[#231F1C]"
              >
                Saved Wishlist ({wishlistCount})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-[#8F867C] hover:text-[#231F1C] rounded-full hover:bg-[#F2ECE0] transition-colors"
              aria-label="Close Wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EDE5D8]">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#B68D56] mb-4">
                  <Heart className="w-8 h-8 stroke-[1.4]" />
                </div>
                <h3
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="text-2xl text-[#231F1C] font-medium mb-1"
                >
                  Your wishlist is empty
                </h3>
                <p className="text-sm text-[#8F867C] max-w-xs mb-6 font-light">
                  Save pieces you love to revisit or purchase later.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="gold-btn px-6 py-3 text-xs tracking-widest uppercase rounded-sm"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-28 bg-[#EDE5D8] rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${product.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="text-sm font-medium text-[#231F1C] hover:text-[#B68D56] transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-[#9E948A] hover:text-[#C53030] p-1 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#7B7268] mt-1">
                        {product.category}
                      </div>

                      <div className="text-sm font-semibold text-[#231F1C] mt-2">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product);
                      }}
                      className="gold-btn w-full py-2 text-[11px] rounded-sm tracking-wider uppercase flex items-center justify-center space-x-1.5 mt-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
