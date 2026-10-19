'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  Sparkles,
  MessageSquare,
  Clock,
  ExternalLink
} from 'lucide-react';

function generateWhatsAppOrderMessage(order: any) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://iralifestyle.com';
  const itemsText = order.items
    ?.map(
      (item: any, i: number) =>
        `${i + 1}. *${item.title}*\n   • Size: ${item.size} | Qty: ${item.quantity} | ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n   • 🔗 *Product Link:* ${origin}/product/${item.productId}`
    )
    .join('\n\n');

  return `*✨ IRA LIFESTYLE - ORDER BILL & DETAILS ✨*
----------------------------------------
*Order ID:* #${order.orderId}
*Order Status:* 🟡 PENDING (Verification)
*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

*👤 Customer Details:*
• *Name:* ${order.customer.fullName}
• *Phone:* ${order.customer.phone}
• *Email:* ${order.customer.email}

*📍 Delivery Address:*
${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
Country: ${order.shippingAddress.country || 'India'}

*🛍️ Ordered Garments:*
${itemsText}

----------------------------------------
*Subtotal:* ₹${order.subtotal?.toLocaleString('en-IN')}
${order.discount ? `*Discount:* -₹${order.discount.toLocaleString('en-IN')}\n` : ''}*Delivery:* FREE EXPRESS
*Grand Total:* ₹${order.total?.toLocaleString('en-IN')}
*Order Bill Mode:* Direct Studio WhatsApp Order
----------------------------------------
_Tap any product link above to inspect the garment. Please verify this bill & confirm delivery schedule. Thank you!_`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, discount, clearCart } = useCart();
  const { user, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '',
    country: 'India',
    paymentMethod: 'Direct Studio Bill (WhatsApp Verified)',
  });

  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || 'Maharashtra',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);

  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const shippingFee = 0;
  const grandTotal = Math.max(0, cartSubtotal - discount + shippingFee);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="py-5 text-center min-vh-60 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#FAF7F2' }}>
        <h3 className="font-serif">No Items in Checkout</h3>
        <p className="text-muted small mb-4">Please add garments to your bag before proceeding to checkout.</p>
        <Link href="/shop" className="btn-ira-gold">EXPLORE COLLECTION</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);

    try {
      const orderPayload = {
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
        },
        items: cart.map((c) => ({
          productId: c.product.id,
          title: c.product.title,
          price: c.product.price,
          size: c.selectedSize,
          quantity: c.quantity,
          image: c.product.image,
        })),
        subtotal: cartSubtotal,
        discount,
        shipping: shippingFee,
        total: grandTotal,
        paymentMethod: form.paymentMethod,
        orderStatus: 'Pending',
        paymentStatus: 'pending',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
        clearCart();

        // Prepare WhatsApp message URL to +91 99954 66002
        const msg = generateWhatsAppOrderMessage(data.order);
        const waUrl = `https://wa.me/919995466002?text=${encodeURIComponent(msg)}`;
        setWhatsappUrl(waUrl);

        if (typeof window !== 'undefined') {
          window.open(waUrl, '_blank');
        }
      }
    } catch (err) {
      console.error('Order placement failed', err);
    } finally {
      setPlacing(false);
    }
  };

  if (placedOrder) {
    const waLink = whatsappUrl || `https://wa.me/919995466002?text=${encodeURIComponent(generateWhatsAppOrderMessage(placedOrder))}`;

    return (
      <div className="py-5 text-center min-vh-70 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-white p-4 p-md-5 rounded border shadow-lg mx-auto" style={{ maxWidth: '640px' }}>
          {/* Order Status Badge */}
          <div 
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
            style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFE69C', color: '#664D03', fontSize: '0.78rem', fontWeight: 600 }}
          >
            <Clock size={15} />
            <span>ORDER STATUS: PENDING VERIFICATION</span>
          </div>

          <h2 className="font-serif fs-2 text-dark mt-1 mb-2">Thank You, {placedOrder.customer.fullName}</h2>
          <p className="text-muted small mb-4" style={{ lineHeight: '1.7' }}>
            Your order <strong>#{placedOrder.orderId}</strong> has been registered with status <strong>Pending</strong>.
            All bill data has been prepared to verify directly with our team on WhatsApp.
          </p>

          {/* WhatsApp Direct Action Button */}
          <div className="mb-4">
            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success d-inline-flex align-items-center justify-content-center gap-2 py-3 px-4 w-100 shadow-sm"
              style={{ backgroundColor: '#25D366', borderColor: '#25D366', fontWeight: 600, fontSize: '0.92rem', borderRadius: '4px' }}
            >
              <MessageSquare size={19} />
              <span>SEND BILL TO WHATSAPP (+91 99954 66002)</span>
            </a>
            <small className="text-muted d-block mt-2" style={{ fontSize: '0.74rem' }}>
              Click above to send the bill details to WhatsApp and verify payment.
            </small>
          </div>

          {/* Itemized Bill Box */}
          <div className="p-3 p-md-4 bg-sand rounded border text-start mb-4" style={{ fontSize: '0.84rem' }}>
            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
              <span className="text-muted">Order ID:</span>
              <span className="fw-bold font-monospace text-dark">#{placedOrder.orderId}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Order Status:</span>
              <span className="badge" style={{ backgroundColor: '#FFF3CD', color: '#664D03', border: '1px solid #FFE69C' }}>
                Pending Verification
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Customer Phone:</span>
              <span className="fw-medium text-dark">{placedOrder.customer.phone}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Address:</span>
              <span className="text-end" style={{ maxWidth: '280px' }}>
                {placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city} - {placedOrder.shippingAddress.pincode}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Payment Mode:</span>
              <span className="badge bg-secondary">{placedOrder.paymentMethod}</span>
            </div>

            {/* Ordered Garments List */}
            <div className="pt-2 border-top mb-3">
              <strong className="d-block mb-2 text-dark small">Ordered Garments:</strong>
              <div className="d-flex flex-column gap-2">
                {placedOrder.items?.map((it: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-white border d-flex flex-column gap-1">
                    <div className="d-flex justify-content-between text-muted small">
                      <span className="text-dark fw-semibold">
                        {it.title} <span className="text-muted fw-normal">({it.size} &times; {it.quantity})</span>
                      </span>
                      <span className="fw-bold text-dark">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                    {it.productId && (
                      <div>
                        <Link 
                          href={`/product/${it.productId}`}
                          target="_blank"
                          className="text-decoration-none small d-inline-flex align-items-center gap-1"
                          style={{ color: 'var(--gold-primary)', fontSize: '0.74rem', fontWeight: 500 }}
                        >
                          <span>Check Product Link</span> <ExternalLink size={11} />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-between pt-2 border-top mt-2">
              <span className="fw-bold text-dark fs-6">Grand Total:</span>
              <span className="fw-bold fs-5" style={{ color: 'var(--gold-primary)' }}>
                ₹{placedOrder.total?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <Link href="/shop" className="btn btn-outline-secondary px-4 py-2" style={{ fontSize: '0.8rem', letterSpacing: '0.08em' }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link href="/cart" className="text-muted text-decoration-none small hover-gold d-flex align-items-center gap-1">
            <ArrowLeft size={14} /> Back to Bag
          </Link>
          <span className="mx-2 text-muted">/</span>
          <span className="fw-semibold text-dark small">Checkout &bull; WhatsApp Bill Verification</span>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="row gy-4">
            {/* Left: Shipping & Payment Details */}
            <div className="col-12 col-lg-7">
              {/* Shipping Address */}
              <div className="bg-white p-4 p-md-5 rounded border shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h4 className="font-serif fs-5 mb-0 text-dark">1. Delivery Address</h4>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => loginWithGoogle()}
                      className="btn btn-sm btn-outline-dark"
                      style={{ fontSize: '0.72rem' }}
                    >
                      Prefill with Google
                    </button>
                  )}
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Radhika Sharma"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 99954 66002"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address / House / Flat *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Flat 402, Royal Residency, High Street"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Thrissur / Kochi / Mumbai"
                      className="form-control"
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">State *</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="form-select"
                    >
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="680101"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Studio Bill & WhatsApp Order Dispatch */}
              <div 
                className="p-4 p-md-4 rounded border shadow-sm"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: 'rgba(197, 168, 128, 0.4)',
                  borderLeft: '4px solid var(--gold-primary)' 
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <MessageSquare size={19} color="#25D366" />
                  <h4 className="font-serif fs-5 mb-0 text-dark">Direct Studio Bill & WhatsApp Dispatch</h4>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.65' }}>
                  No extra payment gateways required. When you click <strong>&quot;BILL NOW&quot;</strong>, your verified order bill is generated with clickable product links and sent directly to our studio WhatsApp line (+91 99954 66002) for instant booking and dispatch confirmation.
                </p>
              </div>
            </div>

            {/* Right: Order Review */}
            <div className="col-12 col-lg-5">
              <div className="bg-white p-4 rounded border shadow-sm position-sticky" style={{ top: '100px' }}>
                <h5 className="font-serif fw-bold text-dark mb-3">Order Items ({cart.length})</h5>

                <div className="d-flex flex-column gap-3 mb-4 max-vh-50 overflow-auto">
                  {cart.map((c) => (
                    <div key={`${c.product.id}-${c.selectedSize}`} className="d-flex gap-3 align-items-center pb-2 border-bottom">
                      <div style={{ position: 'relative', width: '50px', height: '65px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={c.product.image} alt={c.product.title} fill sizes="50px" style={{ objectFit: 'cover', objectPosition: 'center 10%' }} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-semibold text-dark text-truncate" style={{ fontSize: '0.82rem', maxWidth: '200px' }}>
                          {c.product.title}
                        </h6>
                        <small className="text-muted">Size: {c.selectedSize} &bull; Qty: {c.quantity}</small>
                      </div>
                      <span className="fw-bold text-nowrap" style={{ fontSize: '0.85rem' }}>
                        ₹{(c.product.price * c.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between text-muted small mb-1">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between text-success small mb-1">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-success">FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="d-flex justify-content-between text-dark fw-bold fs-5 pt-3 border-top mb-3">
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--gold-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Bill Now & Send Bill Button */}
                <button
                  type="submit"
                  disabled={placing}
                  className="btn-ira-gold w-100 justify-content-center py-3 text-center mb-2 d-flex align-items-center gap-2"
                  style={{ fontSize: '0.94rem', letterSpacing: '0.08em', fontWeight: 600 }}
                >
                  <MessageSquare size={18} />
                  <span>{placing ? 'SAVING ORDER & PREPARING BILL...' : `BILL NOW • ₹${grandTotal.toLocaleString('en-IN')}`}</span>
                </button>

                <p className="text-muted small text-center mb-3" style={{ fontSize: '0.74rem', lineHeight: '1.5' }}>
                  Clicking <strong>BILL NOW</strong> will register your order, create your itemized bill with clickable product links, and share directly to our studio WhatsApp line (+91 99954 66002).
                </p>

                <div className="d-flex align-items-center justify-content-center gap-1 text-muted small text-center">
                  <Lock size={14} color="var(--gold-primary)" />
                  <span>256-Bit SSL Encrypted & Protected</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
