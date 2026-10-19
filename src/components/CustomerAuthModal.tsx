'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* Subtle Botanical Branch Watermarks for Card Corners */
function CardCornerFloraTopLeft() {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.55 }}
    >
      <defs>
        <linearGradient id="modalFloraGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A880" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M -10 -10 Q 35 45 70 100 T 90 125"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M -10 -10 Q 55 20 105 55 T 125 75"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Delicate leaves */}
      <path
        d="M 18 16 Q 42 12 52 28 Q 38 34 18 16 Z"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 34 38 Q 68 34 78 52 Q 56 60 34 38 Z"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradTL)"
        fillOpacity="0.18"
      />
      <path
        d="M 52 68 Q 90 70 96 92 Q 72 96 52 68 Z"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 44 8 Q 65 -2 82 8 Q 70 18 44 8 Z"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 80 30 Q 112 20 124 38 Q 100 46 80 30 Z"
        stroke="url(#modalFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradTL)"
        fillOpacity="0.16"
      />
    </svg>
  );
}

function CardCornerFloraBottomRight() {
  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', opacity: 0.55 }}
    >
      <defs>
        <linearGradient id="modalFloraGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#C5A880" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M 140 140 Q 95 85 60 30 T 40 5"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 140 140 Q 75 110 25 75 T 5 55"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 112 114 Q 88 118 78 102 Q 92 96 112 114 Z"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradBR)"
        fillOpacity="0.16"
      />
      <path
        d="M 96 92 Q 62 96 52 78 Q 74 70 96 92 Z"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradBR)"
        fillOpacity="0.18"
      />
      <path
        d="M 78 62 Q 40 60 34 38 Q 58 34 78 62 Z"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradBR)"
        fillOpacity="0.16"
      />
      <path
        d="M 86 122 Q 65 132 48 122 Q 60 112 86 122 Z"
        stroke="url(#modalFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#modalFloraGradBR)"
        fillOpacity="0.16"
      />
    </svg>
  );
}

function BotanicalPrivilegeIcon({ size = 15, color = '#8C6839' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 7 7 12 2 12C7 12 12 17 12 22C12 17 17 12 22 12C17 12 12 7 12 2Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.25"
      />
      <circle cx="12" cy="12" r="2.2" fill={color} />
    </svg>
  );
}

function FleuronOrnament({ size = 18, color = '#A88653' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L13.8 8.5L20 11L13.8 13.5L12 20L10.2 13.5L4 11L10.2 8.5L12 2Z"
        stroke={color}
        strokeWidth="1.3"
        fill={color}
        fillOpacity="0.3"
      />
      <circle cx="12" cy="11" r="1.6" fill={color} />
    </svg>
  );
}

export default function CustomerAuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithEmail } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 550));
      await loginWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      await loginWithEmail(email, name, phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
      style={{
        zIndex: 2000,
        backgroundColor: 'rgba(24, 18, 14, 0.68)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={closeAuthModal}
    >
      {/* Modal Dialog Card */}
      <div
        className="position-relative w-100 rounded-4 shadow-2xl overflow-hidden animate-scale-up"
        style={{
          maxWidth: '490px',
          backgroundColor: '#FAF7F0',
          backgroundImage: 'linear-gradient(180deg, #FBF8F2 0%, #F5EFE3 100%)',
          border: '1px solid #D6BC92',
          boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(214, 188, 146, 0.35)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Botanical Card Corner Foliage Watermarks */}
        <CardCornerFloraTopLeft />
        <CardCornerFloraBottomRight />

        {/* Circular Close Button (Top-Right) */}
        <button
          onClick={closeAuthModal}
          className="btn position-absolute top-0 end-0 m-3 m-sm-4 rounded-circle d-flex align-items-center justify-content-center p-0 transition"
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid #DFD5C5',
            color: '#4A423B',
            zIndex: 20,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          }}
          aria-label="Close dialog"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C5A880';
            e.currentTarget.style.color = '#1A1613';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#DFD5C5';
            e.currentTarget.style.color = '#4A423B';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
          }}
        >
          <X size={17} strokeWidth={2} />
        </button>

        {/* Card Content Area */}
        <div className="px-4 py-5 p-sm-5 text-center position-relative" style={{ zIndex: 10 }}>
          {/* 1. Privilege Badge */}
          <div className="d-flex justify-content-center mb-3">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill"
              style={{
                border: '1px solid #C5A880',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                boxShadow: '0 2px 6px rgba(197, 168, 128, 0.12)',
              }}
            >
              <BotanicalPrivilegeIcon size={14} color="#8C6839" />
              <span
                className="text-uppercase fw-bold"
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  color: '#8C6839',
                  whiteSpace: 'nowrap',
                }}
              >
                IRA CLIENT PRIVILEGE
              </span>
            </div>
          </div>

          {/* 2. Headline */}
          <h2
            className="font-serif fw-bold text-dark mb-2"
            style={{
              fontSize: '2.45rem',
              color: '#1C1917',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            {tab === 'signin' ? 'Welcome Back' : 'Join IRA Lifestyle'}
          </h2>

          {/* 3. Subtitle */}
          <p
            className="mb-4 mx-auto"
            style={{
              color: '#5C5248',
              fontSize: '0.94rem',
              lineHeight: 1.55,
              maxWidth: '380px',
            }}
          >
            Sign in to access your wardrobe, track orders &amp; enjoy 1-click express checkout.
          </p>

          {/* 4. PRIMARY GOOGLE SIGN-IN BUTTON (Exact match to reference) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-100 btn d-flex align-items-center justify-content-center gap-3 py-3 px-4 rounded-3 transition shadow-sm mb-3"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DFD7CC',
              borderRadius: '10px',
              color: '#1F1B18',
              fontSize: '1.02rem',
              fontWeight: 500,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.04)',
              cursor: googleLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C5A880';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(197, 168, 128, 0.22)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#DFD7CC';
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {googleLoading ? (
              <span className="spinner-border spinner-border-sm text-secondary" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* 5. Decorative Fleuron Line Divider (Exact match to reference) */}
          <div className="d-flex align-items-center justify-content-center gap-3 my-4">
            <div
              className="flex-grow-1"
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #D6BC92)',
              }}
            />
            <div className="d-flex align-items-center justify-content-center">
              <FleuronOrnament size={18} color="#A88653" />
            </div>
            <div
              className="flex-grow-1"
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, #D6BC92, transparent)',
              }}
            />
          </div>

          {/* 6. Security Note (Exact match to reference) */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <ShieldCheck size={18} color="#10B981" />
            <span
              style={{
                color: '#6C6257',
                fontSize: '0.76rem',
                letterSpacing: '0.02em',
                fontWeight: 500,
              }}
            >
              256-Bit Encrypted • Strictly Private Client Data
            </span>
          </div>

          {/* 7. Graceful Email / Phone Option Toggle */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="btn btn-sm btn-link text-decoration-none p-0"
              style={{ color: '#8C6839', fontSize: '0.8rem', fontWeight: 500 }}
            >
              {showEmailForm ? 'Hide email login' : 'Or sign in with email address →'}
            </button>

            {/* Collapsible Email / Password Form */}
            {showEmailForm && (
              <form
                onSubmit={handleEmailSubmit}
                className="mt-3 p-3 rounded-3 text-start transition border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  borderColor: '#DFD7CC',
                }}
              >
                {tab === 'signup' && (
                  <div className="mb-2.5">
                    <label className="form-label small fw-semibold text-dark mb-1" style={{ fontSize: '0.8rem' }}>
                      Full Name
                    </label>
                    <div className="position-relative">
                      <UserIcon
                        size={15}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Ananya Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control ps-5"
                        style={{ fontSize: '0.86rem', borderColor: '#DFD5C5', backgroundColor: '#FFFFFF' }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-2.5">
                  <label className="form-label small fw-semibold text-dark mb-1" style={{ fontSize: '0.8rem' }}>
                    Email Address
                  </label>
                  <div className="position-relative">
                    <Mail
                      size={15}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    />
                    <input
                      type="email"
                      required
                      placeholder="client@luxury.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control ps-5"
                      style={{ fontSize: '0.86rem', borderColor: '#DFD5C5', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                <div className="mb-2.5">
                  <label className="form-label small fw-semibold text-dark mb-1" style={{ fontSize: '0.8rem' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <Lock
                      size={15}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control ps-5"
                      style={{ fontSize: '0.86rem', borderColor: '#DFD5C5', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                {tab === 'signup' && (
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark mb-1" style={{ fontSize: '0.8rem' }}>
                      Phone (for order updates)
                    </label>
                    <div className="position-relative">
                      <Phone
                        size={15}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control ps-5"
                        style={{ fontSize: '0.86rem', borderColor: '#DFD5C5', backgroundColor: '#FFFFFF' }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="btn w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 text-white fw-bold shadow-sm"
                  style={{
                    background: 'linear-gradient(180deg, #9E7440 0%, #835E30 100%)',
                    border: '1px solid #755227',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  {loading ? (
                    'AUTHENTICATING...'
                  ) : tab === 'signin' ? (
                    <>
                      <span>SIGN IN WITH EMAIL</span>
                      <ArrowRight size={14} />
                    </>
                  ) : (
                    <>
                      <span>CREATE CLIENT ACCOUNT</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="text-center mt-2 pt-1">
                  {tab === 'signin' ? (
                    <button
                      type="button"
                      onClick={() => setTab('signup')}
                      className="btn btn-link p-0 text-muted"
                      style={{ fontSize: '0.75rem' }}
                    >
                      New client? <span style={{ color: '#8C6839', fontWeight: 600 }}>Create account</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTab('signin')}
                      className="btn btn-link p-0 text-muted"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Already have an account? <span style={{ color: '#8C6839', fontWeight: 600 }}>Sign in</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
