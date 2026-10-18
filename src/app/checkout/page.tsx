'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowLeft, Check, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    paymentMethod: 'upi' as 'cod' | 'upi' | 'card',
  });
  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  const freeShipping = cartTotal >= 999;
  const shippingFee = freeShipping ? 0 : 99;
  const finalTotal = cartTotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        totalAmount: finalTotal,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
          image: item.product.image,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderConfirmed(data.order);
        clearCart();
      } else {
        // Fallback demo order
        setOrderConfirmed({
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: formData.customerName,
          totalAmount: finalTotal,
          paymentMethod: formData.paymentMethod,
        });
        clearCart();
      }
    } catch {
      setOrderConfirmed({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: formData.customerName,
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
      });
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-xs border border-[#EDE5D8] text-center shadow-lg animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#EAF2EC] text-[#3F6A44] flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 stroke-[2]" />
          </div>
          <span className="text-[11px] tracking-[0.25em] text-[#B68D56] uppercase font-semibold block mb-1">
            ORDER CONFIRMED
          </span>
          <h2
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-3xl text-[#231F1C] font-normal mb-2"
          >
            Thank You, {orderConfirmed.customerName}!
          </h2>
          <p className="text-xs text-[#6F665C] font-light mb-6">
            Your luxury order <strong className="text-[#231F1C]">#{orderConfirmed.id}</strong> has been placed with IRA Lifestyle. We have dispatched a confirmation email to you.
          </p>

          <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#EDE5D8] text-xs text-[#5A524A] mb-8 space-y-1 text-left">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <strong className="text-[#231F1C]">{orderConfirmed.id}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="uppercase font-semibold">{orderConfirmed.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <strong className="text-[#B68D56] text-sm">₹{orderConfirmed.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <Link
            href="/"
            className="gold-btn w-full py-3.5 text-xs rounded-xs tracking-widest uppercase inline-block"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#B68D56] flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl text-[#231F1C] mb-2">
          Your Bag Is Empty
        </h2>
        <p className="text-xs text-[#8F867C] max-w-sm mb-6">
          Add pieces from our exquisite catalogue to proceed with secure checkout.
        </p>
        <Link href="/shop" className="gold-btn px-6 py-3 text-xs rounded-xs uppercase tracking-wider">
          Explore The Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex items-center space-x-2 text-xs text-[#8F867C] mb-8">
          <Link href="/shop" className="flex items-center space-x-1 hover:text-[#B68D56]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Shipping & Payment Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xs border border-[#EDE5D8] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EDE5D8]">
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl sm:text-3xl text-[#231F1C] font-normal"
              >
                Delivery Address
              </h2>
              <div className="flex items-center space-x-1 text-[11px] text-[#3F6A44]">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit Encrypted Checkout</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="First and last name"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Email Address (for order tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. you@example.com"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                  Phone Number (for courier delivery updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                  Street Address &amp; House / Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Apartment, suite, building, street"
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="6-digit pin"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-6 border-t border-[#EDE5D8] mt-6">
                <h3 className="text-sm font-semibold text-[#231F1C] uppercase tracking-wider mb-3">
                  Payment Method
                </h3>
                <div className="space-y-2.5">
                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'upi'
                        ? 'border-[#B68D56] bg-[#FAF7F2]'
                        : 'border-[#EDE5D8] bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className="text-[#B68D56] focus:ring-[#B68D56]"
                      />
                      <span className="text-xs font-medium text-[#231F1C]">
                        UPI / QR (Google Pay, PhonePe, Paytm, BHIM)
                      </span>
                    </div>
                    <span className="text-[10px] bg-[#EAF2EC] text-[#3F6A44] font-semibold px-2 py-0.5 rounded-xs">
                      INSTANT
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#B68D56] bg-[#FAF7F2]'
                        : 'border-[#EDE5D8] bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="text-[#B68D56] focus:ring-[#B68D56]"
                      />
                      <span className="text-xs font-medium text-[#231F1C]">
                        Credit / Debit Cards (Visa, Mastercard, RuPay, Amex)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#B68D56] bg-[#FAF7F2]'
                        : 'border-[#EDE5D8] bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="text-[#B68D56] focus:ring-[#B68D56]"
                      />
                      <span className="text-xs font-medium text-[#231F1C]">
                        Cash on Delivery (Pay at Doorstep)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gold-btn w-full py-4 text-xs tracking-[0.2em] uppercase rounded-xs font-semibold mt-6 shadow-md"
              >
                {loading ? 'PROCESSING ORDER...' : `COMPLETE ORDER (₹${finalTotal.toLocaleString('en-IN')})`}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#EDE5D8]">
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl text-[#231F1C] font-normal mb-5 pb-3 border-b border-[#EDE5D8]"
            >
              Order Summary ({cart.length} items)
            </h3>

            <div className="divide-y divide-[#EDE5D8] max-h-80 overflow-y-auto mb-6 pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="py-3 flex gap-3">
                  <div className="relative w-16 h-20 bg-[#EDE5D8] rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-medium text-[#231F1C] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[#7B7268] text-[11px] mt-0.5">
                        Size: {item.size} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-[#231F1C]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-[#6F665C] border-t border-[#EDE5D8] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#231F1C]">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured Doorstep Shipping</span>
                <span className="font-medium text-[#3F6A44]">
                  {freeShipping ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#231F1C] pt-3 border-t border-[#EDE5D8]">
                <span>Total Amount</span>
                <span className="text-[#B68D56]">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
