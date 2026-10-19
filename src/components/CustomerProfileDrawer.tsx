'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  LogOut, 
  Package, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ChevronRight, 
  MessageCircle, 
  Copy, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';

export default function CustomerProfileDrawer() {
  const { user, isProfileDrawerOpen, closeProfileDrawer, logout, updateProfile } = useAuth();
  const { wishlist } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState({
    phone: '',
    address: '',
    city: '',
    state: 'Kerala',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      setAddressForm({
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'Kerala',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isProfileDrawerOpen && user?.email) {
      setLoadingOrders(true);
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            const userOrders = data.orders.filter(
              (o: Order) => o.customer?.email?.toLowerCase() === user.email.toLowerCase()
            );
            setOrders(userOrders.length > 0 ? userOrders : data.orders.slice(0, 3));
          }
        })
        .catch((err) => console.warn('Could not load customer orders', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [isProfileDrawerOpen, user?.email]);

  if (!isProfileDrawerOpen || !user) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(addressForm);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const copyOrder = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Helper for tracking progress steps
  const getProgressStep = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'shipped') return 3;
    if (s === 'processing') return 2;
    if (s === 'confirmed') return 1;
    return 1; // Pending
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        zIndex: 3500,
        backgroundColor: 'rgba(21, 19, 17, 0.72)',
        backdropFilter: 'blur(8px)',
        transition: 'opacity 0.3s ease',
      }}
      onClick={closeProfileDrawer}
    >
      <div 
        className="position-fixed top-0 end-0 h-100 d-flex flex-column"
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#FAF8F5',
          boxShadow: '-8px 0 35px rgba(0, 0, 0, 0.35)',
          borderLeft: '1px solid rgba(197, 168, 128, 0.3)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= 1. ROYAL ATELIER HEADER ================= */}
        <div 
          className="p-3 p-sm-4 position-relative overflow-hidden text-white flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #2B241F 60%, #1A1715 100%)',
            borderBottom: '1px solid rgba(197, 168, 128, 0.35)',
          }}
        >
          {/* Gold Decorative Ambient Accent */}
          <div 
            className="position-absolute top-0 end-0 p-3 opacity-25"
            style={{ pointerEvents: 'none' }}
          >
            <Sparkles size={65} color="#C5A880" />
          </div>

          {/* Close Button positioned top-right with high z-index */}
          <button 
            onClick={closeProfileDrawer}
            className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle position-absolute"
            style={{
              top: '14px',
              right: '14px',
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#C5A880',
              border: '1px solid rgba(197, 168, 128, 0.35)',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            aria-label="Close Profile Drawer"
          >
            <X size={16} />
          </button>

          {/* Profile Details with safe right padding to avoid close button overlap */}
          <div className="d-flex align-items-center gap-3 pe-4 position-relative z-1">
            {user.avatar ? (
              <div 
                className="position-relative rounded-circle overflow-hidden flex-shrink-0" 
                style={{
                  width: '54px', 
                  height: '54px', 
                  border: '2px solid #C5A880',
                  boxShadow: '0 0 16px rgba(197, 168, 128, 0.4)',
                }}
              >
                <Image src={user.avatar} alt={user.name} fill sizes="54px" style={{ objectFit: 'cover' }} />
              </div>
            ) : (
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: '#C5A880',
                  color: '#151311',
                  fontSize: '1.25rem',
                  boxShadow: '0 0 16px rgba(197, 168, 128, 0.4)',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="overflow-hidden flex-grow-1">
              <h5 className="mb-1 fw-bold font-serif text-white text-truncate" style={{ fontSize: '1.15rem', letterSpacing: '0.02em', lineHeight: 1.25 }}>
                {user.name}
              </h5>
              
              <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                {user.provider === 'google' ? (
                  <span 
                    className="badge d-inline-flex align-items-center gap-1 px-2 py-0 flex-shrink-0" 
                    style={{ 
                      fontSize: '0.62rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FAF8F5', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Google Verified
                  </span>
                ) : (
                  <span 
                    className="badge d-inline-flex align-items-center gap-1 px-2 py-0 flex-shrink-0" 
                    style={{ 
                      fontSize: '0.62rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      color: '#FAF8F5', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px'
                    }}
                  >
                    <ShieldCheck size={10} color="#A3E635" /> Verified Client
                  </span>
                )}
                <span className="small text-truncate" style={{ color: '#D4C6B5', fontSize: '0.74rem' }}>
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. RESPONSIVE TWO-TAB CONTROLLER ================= */}
        <div 
          className="d-flex bg-white border-bottom flex-shrink-0"
          style={{ borderColor: 'rgba(197, 168, 128, 0.2)' }}
        >
          <button
            onClick={() => setActiveTab('orders')}
            className={`btn w-50 py-3 text-center text-uppercase fw-bold position-relative border-0 rounded-0 ${
              activeTab === 'orders' ? 'text-dark' : 'text-muted'
            }`}
            style={{
              fontSize: '0.76rem',
              letterSpacing: '0.08em',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Package size={15} color={activeTab === 'orders' ? '#9E7D47' : '#999'} />
              <span>My Orders ({orders.length})</span>
            </div>
            {activeTab === 'orders' && (
              <div 
                className="position-absolute bottom-0 start-0 end-0"
                style={{ height: '3px', backgroundColor: '#9E7D47' }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`btn w-50 py-3 text-center text-uppercase fw-bold position-relative border-0 rounded-0 ${
              activeTab === 'address' ? 'text-dark' : 'text-muted'
            }`}
            style={{
              fontSize: '0.76rem',
              letterSpacing: '0.08em',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <MapPin size={15} color={activeTab === 'address' ? '#9E7D47' : '#999'} />
              <span>Shipping Address</span>
            </div>
            {activeTab === 'address' && (
              <div 
                className="position-absolute bottom-0 start-0 end-0"
                style={{ height: '3px', backgroundColor: '#9E7D47' }}
              />
            )}
          </button>
        </div>

        {/* ================= 3. SCROLLABLE TAB CONTENT ================= */}
        <div className="flex-grow-1 p-3 p-sm-4 overflow-auto">
          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="d-flex flex-column gap-3">
              {loadingOrders ? (
                <div className="text-center py-5">
                  <div className="spinner-border spinner-border-sm text-secondary mb-2" role="status" />
                  <div className="text-muted small">Accessing your atelier orders...</div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 p-4 border" style={{ borderColor: '#E8E2D7' }}>
                  <div 
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px', backgroundColor: 'rgba(197, 168, 128, 0.15)' }}
                  >
                    <Package size={26} color="#9E7D47" />
                  </div>
                  <h6 className="font-serif fw-bold text-dark mb-1">No Orders Placed Yet</h6>
                  <p className="text-muted small mb-4">
                    Explore our private festive lookbooks and handwoven heritage silks.
                  </p>
                  <Link 
                    href="/shop" 
                    onClick={closeProfileDrawer} 
                    className="btn btn-sm text-dark fw-bold px-4 py-2"
                    style={{ backgroundColor: '#C5A880' }}
                  >
                    DISCOVER COLLECTIONS
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const step = getProgressStep(order.orderStatus || 'Confirmed');
                  const orderIdentifier = order.orderId || order._id || 'ORD-IRA-8316';
                  return (
                    <div 
                      key={orderIdentifier} 
                      className="bg-white rounded-3 p-3 p-sm-4 shadow-sm position-relative transition"
                      style={{ 
                        border: '1px solid rgba(197, 168, 128, 0.35)',
                      }}
                    >
                      {/* Top Bar with Order ID & Status */}
                      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                        <div>
                          <div className="d-flex align-items-center gap-1">
                            <span className="fw-bold font-serif text-dark" style={{ fontSize: '0.94rem' }}>
                              #{orderIdentifier}
                            </span>
                            <button
                              onClick={() => copyOrder(orderIdentifier)}
                              className="btn btn-xs btn-link text-muted p-0 ms-1"
                              title="Copy Order ID"
                            >
                              {copiedOrderId === orderIdentifier ? (
                                <Check size={13} color="#10B981" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          </div>
                          <span className="text-muted d-flex align-items-center gap-1 mt-1" style={{ fontSize: '0.72rem' }}>
                            <Calendar size={11} />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span 
                          className="badge px-3 py-1 rounded-pill fw-bold"
                          style={{
                            backgroundColor:
                              order.orderStatus === 'Delivered'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : order.orderStatus === 'Pending'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(197, 168, 128, 0.22)',
                            color:
                              order.orderStatus === 'Delivered'
                                ? '#065F46'
                                : order.orderStatus === 'Pending'
                                ? '#92400E'
                                : '#825E29',
                            border: '1px solid currentColor',
                            fontSize: '0.68rem',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {order.orderStatus || 'Confirmed'}
                        </span>
                      </div>

                      {/* Interactive Progress Stepper */}
                      <div className="p-3 rounded-2 bg-light mb-3">
                        <div className="d-flex justify-content-between position-relative mb-1">
                          {/* Progress track line */}
                          <div 
                            className="position-absolute top-50 start-0 end-0 translate-middle-y"
                            style={{ height: '2px', backgroundColor: '#E2DBD0', zIndex: 1 }}
                          />
                          <div 
                            className="position-absolute top-50 start-0 translate-middle-y"
                            style={{ 
                              height: '2px', 
                              backgroundColor: '#9E7D47', 
                              width: step === 4 ? '100%' : step === 3 ? '66%' : step === 2 ? '33%' : '15%',
                              zIndex: 1,
                              transition: 'width 0.4s ease'
                            }}
                          />

                          {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map((label, idx) => {
                            const isPassed = step >= idx + 1;
                            return (
                              <div 
                                key={label} 
                                className="d-flex flex-column align-items-center position-relative" 
                                style={{ zIndex: 2 }}
                              >
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    backgroundColor: isPassed ? '#9E7D47' : '#FFFFFF',
                                    border: isPassed ? '2px solid #9E7D47' : '2px solid #C4BCB0',
                                    color: '#FFFFFF',
                                    fontSize: '0.6rem',
                                  }}
                                >
                                  {isPassed && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span 
                                  className="mt-1" 
                                  style={{ 
                                    fontSize: '0.62rem', 
                                    fontWeight: isPassed ? 600 : 400,
                                    color: isPassed ? '#151311' : '#8A8275' 
                                  }}
                                >
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items Brief Summary */}
                      <div className="py-2 border-top border-bottom my-2" style={{ borderColor: '#EFEAE2' }}>
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <span>
                            {order.items?.length || 1} Garment Piece(s) • {order.paymentMethod || 'UPI'}
                          </span>
                          <span className="fw-bold" style={{ color: '#9E7D47', fontSize: '0.94rem' }}>
                            ₹{(order.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="mt-2 d-flex flex-column gap-1">
                            {order.items.slice(0, 2).map((item, i) => (
                              <div key={i} className="small text-muted d-flex align-items-center justify-content-between">
                                <span className="text-truncate text-dark" style={{ maxWidth: '200px' }}>
                                  • {item.title}
                                </span>
                                <span className="small">Qty: {item.quantity || 1} ({item.size})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-1">
                        <div className="d-flex align-items-center gap-1 text-success" style={{ fontSize: '0.72rem' }}>
                          <CheckCircle2 size={13} />
                          <span>Payment Verified</span>
                        </div>

                        {/* Direct WhatsApp Track Button */}
                        <a
                          href={`https://wa.me/919995466002?text=${encodeURIComponent(
                            `Hello IRA Lifestyle Concierge, I would like an update on my order #${orderIdentifier}. Customer Name: ${user.name}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center justify-content-center gap-1 py-1 px-3 w-100 w-sm-auto"
                          style={{ fontSize: '0.74rem', borderRadius: '4px' }}
                        >
                          <MessageCircle size={13} /> Track via WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Saved Wishlist Preview Row */}
              <Link 
                href="/wishlist" 
                onClick={closeProfileDrawer}
                className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-white border text-dark text-decoration-none shadow-sm hover-elevate transition"
                style={{ borderColor: 'rgba(197, 168, 128, 0.35)' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', backgroundColor: 'rgba(197, 168, 128, 0.15)' }}
                  >
                    <Heart size={15} color="#9E7D47" fill={wishlist.length > 0 ? '#9E7D47' : 'none'} />
                  </div>
                  <div>
                    <span className="small fw-semibold d-block">Saved Wishlist</span>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Private curation</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge px-2 py-1 text-dark border" style={{ backgroundColor: '#FAF6F0', fontSize: '0.7rem' }}>
                    {wishlist.length} Items
                  </span>
                  <ChevronRight size={15} className="text-muted" />
                </div>
              </Link>
            </div>
          )}

          {/* TAB: SHIPPING ADDRESS */}
          {activeTab === 'address' && (
            <div className="bg-white p-3 p-sm-4 rounded-3 border shadow-sm" style={{ borderColor: 'rgba(197, 168, 128, 0.35)' }}>
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <MapPin size={18} color="#9E7D47" />
                <div>
                  <h6 className="fw-bold font-serif mb-0 text-dark">Default Shipping Address</h6>
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Used for seamless 1-click boutique checkout.
                  </small>
                </div>
              </div>

              <form onSubmit={handleSaveAddress} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label text-muted small mb-1 fw-semibold">Primary Contact Phone</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted">+91</span>
                    <input
                      type="tel"
                      placeholder="99954 66002"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-muted small mb-1 fw-semibold">Street & Residence Address</label>
                  <textarea
                    rows={2}
                    placeholder="Villa / Suite name, Street, Landmark"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1 fw-semibold">City</label>
                    <input
                      type="text"
                      placeholder="Thrissur"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.84rem' }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-muted small mb-1 fw-semibold">Postal Pincode</label>
                    <input
                      type="text"
                      placeholder="680101"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="form-control form-control-sm"
                      style={{ fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-muted small mb-1 fw-semibold">State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn text-dark fw-bold w-100 justify-content-center py-2 mt-2 shadow-sm"
                  style={{ backgroundColor: '#C5A880' }}
                >
                  {addressSaved ? 'ADDRESS SAVED SUCCESSFULLY ✓' : 'SAVE SHIPPING ADDRESS'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ================= 4. DRAWER FOOTER ================= */}
        <div 
          className="p-3 px-sm-4 border-top bg-white d-flex align-items-center justify-content-between flex-shrink-0"
          style={{ 
            borderColor: 'rgba(197, 168, 128, 0.25)',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.03)',
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.74rem' }}>
            <Sparkles size={12} color="#9E7D47" />
            <span>Member since {user.joinedAt || '2026'}</span>
          </div>

          <button
            onClick={logout}
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 py-1 px-3"
            style={{ fontSize: '0.76rem', letterSpacing: '0.08em', borderRadius: '4px' }}
          >
            <LogOut size={13} /> SIGN OUT
          </button>
        </div>
      </div>
    </div>
  );
}
