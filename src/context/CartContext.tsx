'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, selectedSize: string, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  promoCode: string;
  discount: number;
  applyPromo: (code: string) => { success: boolean; message: string };
  shippingFee: number;
  freeShippingRemaining: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // 1. Load initial cart & wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('ira_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('ira_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // 2. Real-Time DB Wishlist Synchronization for Logged-In Customer
  useEffect(() => {
    let isMounted = true;

    async function syncDbWishlist() {
      if (!user) return;

      try {
        // If there were local guest items, merge them to MongoDB
        const localWishlistRaw = localStorage.getItem('ira_wishlist');
        const localWishlist: Product[] = localWishlistRaw ? JSON.parse(localWishlistRaw) : [];
        const localIds = localWishlist.map((p) => p.id).filter(Boolean);

        if (localIds.length > 0) {
          const syncRes = await fetch('/api/wishlist', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productIds: localIds,
              email: user.email,
              userId: user.id,
            }),
          });

          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (isMounted && syncData.wishlist) {
              setWishlist(syncData.wishlist);
              localStorage.setItem('ira_wishlist', JSON.stringify(syncData.wishlist));
              return;
            }
          }
        }

        // Fetch user's persistent wishlist from MongoDB Atlas
        const res = await fetch(
          `/api/wishlist?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`,
          { cache: 'no-store' }
        );

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.wishlist) {
            setWishlist(data.wishlist);
            localStorage.setItem('ira_wishlist', JSON.stringify(data.wishlist));
          }
        }
      } catch (err) {
        console.warn('Real-time DB wishlist sync error:', err);
      }
    }

    syncDbWishlist();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ira_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
  }, [cart]);

  // Save wishlist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('ira_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist', e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, selectedSize: string, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: selectedSize || (product.sizes?.[0] || 'M'),
          selectedColor: selectedColor || (product.colors?.[0] || 'Default'),
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId: string, selectedSize: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const toggleWishlist = (product: Product) => {
    // 1. Instant optimistic local update
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      try {
        localStorage.setItem('ira_wishlist', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save wishlist to localStorage', e);
      }
      return next;
    });

    // 2. Real-time DB persistence to MongoDB Atlas if user is authenticated
    if (user) {
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email: user.email,
          userId: user.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.wishlist) {
            setWishlist(data.wishlist);
            localStorage.setItem('ira_wishlist', JSON.stringify(data.wishlist));
          }
        })
        .catch((err) => {
          console.warn('MongoDB wishlist persistence error:', err);
        });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'IRA10' || clean === 'WELCOME10') {
      setPromoCode(clean);
      setDiscountPercent(0.10);
      return { success: true, message: '10% celebratory discount applied!' };
    }
    if (clean === 'ROYAL20') {
      if (cartSubtotal >= 3000) {
        setPromoCode(clean);
        setDiscountPercent(0.20);
        return { success: true, message: '20% Royal VIP discount applied!' };
      }
      return { success: false, message: 'Code ROYAL20 requires a minimum order of ₹3,000' };
    }
    return { success: false, message: 'Invalid or expired promo code' };
  };

  const discount = Math.round(cartSubtotal * discountPercent);
  const shippingFee = 0;
  const freeShippingRemaining = 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        promoCode,
        discount,
        applyPromo,
        shippingFee,
        freeShippingRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
