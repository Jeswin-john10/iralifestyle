'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from 'lucide-react';

/* Decorative Botanical SVG Components (Antique Gold Foil Line Art) */
function BotanicalBranchTopLeft({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ pointerEvents: 'none', ...style }}
    >
      <defs>
        <linearGradient id="goldFloraGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF77" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#B38A4F" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Main curved stems */}
      <path
        d="M -20 -20 Q 60 70 120 180 T 160 270"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M -20 -20 Q 110 30 200 90 T 270 140"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Foliage leaves along stem 1 */}
      <path
        d="M 30 25 Q 70 20 85 45 Q 60 55 30 25 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.15"
      />
      <path
        d="M 55 58 Q 110 50 125 80 Q 90 92 55 58 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.18"
      />
      <path
        d="M 85 110 Q 150 115 160 150 Q 120 155 85 110 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.15"
      />
      <path
        d="M 115 165 Q 170 185 175 220 Q 140 215 115 165 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.15"
      />
      {/* Foliage leaves along stem 2 */}
      <path
        d="M 70 10 Q 100 -5 130 10 Q 110 25 70 10 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.15"
      />
      <path
        d="M 130 45 Q 185 30 205 60 Q 165 72 130 45 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.18"
      />
      <path
        d="M 175 75 Q 235 70 250 105 Q 210 115 175 75 Z"
        stroke="url(#goldFloraGradTL)"
        strokeWidth="1"
        fill="url(#goldFloraGradTL)"
        fillOpacity="0.15"
      />
      {/* Flower bud accents */}
      <circle cx="160" cy="270" r="3" fill="#D4AF77" fillOpacity="0.6" />
      <circle cx="270" cy="140" r="3" fill="#D4AF77" fillOpacity="0.6" />
      <circle cx="205" cy="60" r="2" fill="#D4AF77" fillOpacity="0.6" />
    </svg>
  );
}

function BotanicalBranchBottomRight({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ pointerEvents: 'none', ...style }}
    >
      <defs>
        <linearGradient id="goldFloraGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D4AF77" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#B38A4F" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M 300 300 Q 220 210 160 100 T 120 10"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 300 300 Q 190 250 100 190 T 30 140"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M 250 255 Q 210 260 195 235 Q 220 225 250 255 Z"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1"
        fill="url(#goldFloraGradBR)"
        fillOpacity="0.15"
      />
      <path
        d="M 225 222 Q 170 230 155 200 Q 190 188 225 222 Z"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1"
        fill="url(#goldFloraGradBR)"
        fillOpacity="0.18"
      />
      <path
        d="M 195 170 Q 130 165 120 130 Q 160 125 195 170 Z"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1"
        fill="url(#goldFloraGradBR)"
        fillOpacity="0.15"
      />
      <path
        d="M 165 115 Q 110 95 105 60 Q 140 65 165 115 Z"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1"
        fill="url(#goldFloraGradBR)"
        fillOpacity="0.15"
      />
      <path
        d="M 150 235 Q 95 250 75 220 Q 115 208 150 235 Z"
        stroke="url(#goldFloraGradBR)"
        strokeWidth="1"
        fill="url(#goldFloraGradBR)"
        fillOpacity="0.18"
      />
      <circle cx="120" cy="10" r="3" fill="#D4AF77" fillOpacity="0.6" />
      <circle cx="30" cy="140" r="3" fill="#D4AF77" fillOpacity="0.6" />
    </svg>
  );
}

function CardCornerFloraTopLeft() {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.38 }}
    >
      <path
        d="M 0 0 C 25 35 45 60 70 85"
        stroke="#9E753F"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <path
        d="M 12 10 Q 30 8 36 20 Q 25 24 12 10 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.12"
      />
      <path
        d="M 24 24 Q 48 20 54 34 Q 38 40 24 24 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.14"
      />
      <path
        d="M 40 45 Q 65 42 70 56 Q 52 62 40 45 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.12"
      />
    </svg>
  );
}

function CardCornerFloraBottomRight() {
  return (
    <svg
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', opacity: 0.38 }}
    >
      <path
        d="M 110 110 C 85 75 65 50 40 25"
        stroke="#9E753F"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <path
        d="M 98 100 Q 80 102 74 90 Q 85 86 98 100 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.12"
      />
      <path
        d="M 86 86 Q 62 90 56 76 Q 72 70 86 86 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.14"
      />
      <path
        d="M 70 65 Q 45 68 40 54 Q 58 48 70 65 Z"
        stroke="#9E753F"
        strokeWidth="0.8"
        fill="#9E753F"
        fillOpacity="0.12"
      />
    </svg>
  );
}

function RoyalCrownIcon({ size = 26, color = '#C5A880' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block' }}
    >
      <path
        d="M 3 18 L 21 18 L 19.5 8 L 15 12 L 12 5 L 9 12 L 4.5 8 Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
      <circle cx="12" cy="4" r="1.2" fill={color} />
      <circle cx="4.5" cy="7" r="1" fill={color} />
      <circle cx="19.5" cy="7" r="1" fill={color} />
      <line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ira@lifestyle2026');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid administrative credentials');
      }
    } catch {
      setError('Connection failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 position-relative d-flex align-items-center justify-content-center px-3 py-4 py-md-5 overflow-hidden"
      style={{
        backgroundColor: '#14100D',
        backgroundImage: `
          radial-gradient(circle at 50% 48%, rgba(68, 50, 34, 0.45) 0%, rgba(30, 22, 16, 0.85) 55%, rgba(16, 12, 10, 0.98) 100%),
          radial-gradient(circle at 20% 20%, rgba(197, 168, 128, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(197, 168, 128, 0.06) 0%, transparent 40%)
        `,
      }}
    >
      {/* Background Corner Botanical Foliage (Exact visual style from reference) */}
      <BotanicalBranchTopLeft
        className="d-none d-sm-block position-absolute"
        style={{ top: 0, left: 0, width: '380px', height: '380px', opacity: 0.8 }}
      />
      <BotanicalBranchTopLeft
        className="d-none d-lg-block position-absolute"
        style={{
          bottom: 0,
          left: 0,
          width: '320px',
          height: '320px',
          opacity: 0.65,
          transform: 'rotate(-90deg)',
        }}
      />
      <BotanicalBranchBottomRight
        className="d-none d-sm-block position-absolute"
        style={{ bottom: 0, right: 0, width: '380px', height: '380px', opacity: 0.8 }}
      />
      <BotanicalBranchBottomRight
        className="d-none d-lg-block position-absolute"
        style={{
          top: 0,
          right: 0,
          width: '320px',
          height: '320px',
          opacity: 0.65,
          transform: 'rotate(180deg)',
        }}
      />

      {/* Main Luxury Central Card */}
      <div
        className="position-relative w-100 rounded-3 shadow-2xl"
        style={{
          maxWidth: '470px',
          backgroundColor: '#FAF7F0',
          backgroundImage: 'linear-gradient(180deg, #FBF9F4 0%, #F5EFE3 100%)',
          border: '1px solid #D6BC92',
          boxShadow: '0 25px 65px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(214, 188, 146, 0.4)',
          borderRadius: '14px',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        {/* Subtle Inset Card Corner Botanical Watermarks */}
        <CardCornerFloraTopLeft />
        <CardCornerFloraBottomRight />

        <div className="p-4 p-sm-5 position-relative" style={{ zIndex: 2 }}>
          {/* Brand Header */}
          <div className="text-center mb-4">
            {/* Crown Motif */}
            <div className="mb-1 d-flex justify-content-center">
              <RoyalCrownIcon size={24} color="#C5A880" />
            </div>

            {/* Official IRA Monogram Logo */}
            <div
              className="position-relative mx-auto mb-2"
              style={{
                width: '64px',
                height: '70px',
                filter: 'drop-shadow(0 4px 10px rgba(166, 124, 67, 0.28))',
              }}
            >
              <Image
                src="/images/logo.png"
                alt="IRA Lifestyle Atelier"
                fill
                sizes="64px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {/* Typography */}
            <h1
              className="font-serif fw-bold text-dark mb-0 text-center"
              style={{
                fontSize: '1.9rem',
                letterSpacing: '0.28em',
                color: '#1A1613',
                lineHeight: 1.15,
                paddingLeft: '0.28em',
              }}
            >
              IRA
            </h1>
            <span
              className="d-block text-uppercase fw-semibold"
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.36em',
                color: '#8C6F49',
                marginTop: '4px',
                paddingLeft: '0.36em',
              }}
            >
              LIFESTYLE
            </span>

            {/* Decorative Divider: ADMINISTRATIVE PORTAL */}
            <div className="d-flex align-items-center justify-content-center gap-3 my-3">
              <div
                className="flex-grow-1"
                style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #C5A880)' }}
              />
              <span
                className="text-uppercase fw-bold"
                style={{
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  color: '#9E753F',
                  whiteSpace: 'nowrap',
                }}
              >
                ADMINISTRATIVE PORTAL
              </span>
              <div
                className="flex-grow-1"
                style={{ height: '1px', background: 'linear-gradient(90deg, #C5A880, transparent)' }}
              />
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div
              className="alert alert-danger py-2 px-3 small mb-3 text-center rounded-3 border-danger-subtle d-flex align-items-center justify-content-center gap-2"
              style={{ fontSize: '0.82rem', backgroundColor: '#FDF2F2' }}
            >
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            {/* Username Input */}
            <div>
              <label
                htmlFor="admin-username-input"
                className="form-label small fw-semibold text-dark mb-1.5"
                style={{ fontSize: '0.86rem', color: '#2B2520' }}
              >
                Admin username
              </label>
              <div
                className="d-flex align-items-center rounded-2 px-3 transition"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8D0C5',
                  height: '46px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <User size={18} style={{ color: '#9CA3AF', flexShrink: 0, marginRight: '10px' }} />
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-100 bg-transparent border-0 text-dark outline-none p-0"
                  style={{
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxShadow: 'none',
                    color: '#1C1917',
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="admin-password-input"
                className="form-label small fw-semibold text-dark mb-1.5"
                style={{ fontSize: '0.86rem', color: '#2B2520' }}
              >
                Password
              </label>
              <div
                className="d-flex align-items-center rounded-2 px-3 transition"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D8D0C5',
                  height: '46px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <Lock size={18} style={{ color: '#9CA3AF', flexShrink: 0, marginRight: '10px' }} />
                <input
                  id="admin-password-input"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-100 bg-transparent border-0 text-dark outline-none p-0"
                  style={{
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxShadow: 'none',
                    color: '#1C1917',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="btn btn-sm btn-link text-muted p-0 ms-2 text-decoration-none"
                  aria-label="Toggle password visibility"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mt-1">
              <label
                className="d-flex align-items-center gap-2 cursor-pointer mb-0 user-select-none"
                style={{ fontSize: '0.8rem', color: '#685F56' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-check-input mt-0"
                  style={{
                    borderColor: '#C5A880',
                    accentColor: '#9E7440',
                    cursor: 'pointer',
                  }}
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="btn btn-link p-0 text-decoration-none"
                style={{
                  fontSize: '0.8rem',
                  color: '#9E7440',
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Primary Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 py-3 mt-3 d-flex align-items-center justify-content-center gap-2 text-white fw-bold shadow-sm transition"
              style={{
                background: 'linear-gradient(180deg, #9E7440 0%, #835E30 100%)',
                border: '1px solid #755227',
                borderRadius: '8px',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                boxShadow: '0 4px 14px rgba(131, 94, 48, 0.35)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Divider */}
          <div className="d-flex align-items-center justify-content-center gap-2 my-4 pt-1">
            <div className="flex-grow-1" style={{ height: '1px', backgroundColor: '#E4DDD3' }} />
            <div className="d-flex align-items-center gap-1.5 px-2" style={{ color: '#7D7368', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} color="#9E753F" />
              <span>Your data is safe with us</span>
            </div>
            <div className="flex-grow-1" style={{ height: '1px', backgroundColor: '#E4DDD3' }} />
          </div>

          {/* Storefront Navigation & Demo Credentials Hint */}
          <div className="text-center d-flex flex-column gap-2.5">
            <Link
              href="/"
              className="text-decoration-none d-inline-flex align-items-center justify-content-center gap-1.5 mx-auto"
              style={{
                color: '#6B6055',
                fontSize: '0.82rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#9E7440')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6055')}
            >
              <span>←</span>
              <span>Return to IRA Lifestyle storefront</span>
            </Link>

            {/* Quick Demo Credentials Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDemoModal(!showDemoModal)}
                className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                style={{ fontSize: '0.72rem' }}
              >
                <Sparkles size={11} className="me-1" color="#C5A880" />
                {showDemoModal ? 'Hide demo access' : 'View demo atelier access credentials'}
              </button>

              {showDemoModal && (
                <div
                  className="mt-2 p-2.5 rounded text-start border transition shadow-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderColor: '#D6BC92',
                    fontSize: '0.76rem',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong className="text-dark">Official Studio Access:</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('admin');
                        setPassword('ira@lifestyle2026');
                      }}
                      className="btn btn-xs btn-outline-secondary py-0 px-1.5"
                      style={{ fontSize: '0.68rem' }}
                    >
                      Auto-fill
                    </button>
                  </div>
                  <div className="text-muted">Username: <code className="text-dark">admin</code></div>
                  <div className="text-muted">Password: <code className="text-dark">ira@lifestyle2026</code></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999 }}
        >
          <div
            className="bg-white p-4 rounded-3 border shadow-lg text-center"
            style={{ maxWidth: '380px', borderColor: '#D6BC92' }}
          >
            <div
              className="p-3 rounded-circle mx-auto mb-3 d-inline-flex"
              style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', color: '#9E7440' }}
            >
              <Info size={28} />
            </div>
            <h5 className="font-serif fw-bold text-dark mb-2">Administrative Security</h5>
            <p className="text-muted small mb-4">
              To safeguard IRA Lifestyle catalog and client customer records, administrative credentials can only be reset through direct master access or by contacting Nikhil & Anju at the Guruvayoor atelier.
            </p>
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('ira@lifestyle2026');
                  setForgotModal(false);
                }}
                className="btn btn-sm btn-dark flex-grow-1"
                style={{ backgroundColor: '#9E7440', borderColor: '#835E30' }}
              >
                Use Studio Password
              </button>
              <button
                type="button"
                onClick={() => setForgotModal(false)}
                className="btn btn-sm btn-outline-secondary flex-grow-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
