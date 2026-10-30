'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
        <linearGradient id="pageFloraGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A880" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M -10 -10 Q 35 45 70 100 T 90 125"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M -10 -10 Q 55 20 105 55 T 125 75"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 18 16 Q 42 12 52 28 Q 38 34 18 16 Z"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 34 38 Q 68 34 78 52 Q 56 60 34 38 Z"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradTL)"
        fillOpacity="0.18"
      />
      <path
        d="M 52 68 Q 90 70 96 92 Q 72 96 52 68 Z"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 44 8 Q 65 -2 82 8 Q 70 18 44 8 Z"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradTL)"
        fillOpacity="0.16"
      />
      <path
        d="M 80 30 Q 112 20 124 38 Q 100 46 80 30 Z"
        stroke="url(#pageFloraGradTL)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradTL)"
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
        <linearGradient id="pageFloraGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#C5A880" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#8C6533" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M 140 140 Q 95 85 60 30 T 40 5"
        stroke="url(#pageFloraGradBR)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 140 140 Q 75 110 25 75 T 5 55"
        stroke="url(#pageFloraGradBR)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 112 114 Q 88 118 78 102 Q 92 96 112 114 Z"
        stroke="url(#pageFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradBR)"
        fillOpacity="0.16"
      />
      <path
        d="M 96 92 Q 62 96 52 78 Q 74 70 96 92 Z"
        stroke="url(#pageFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradBR)"
        fillOpacity="0.18"
      />
      <path
        d="M 78 62 Q 40 60 34 38 Q 58 34 78 62 Z"
        stroke="url(#pageFloraGradBR)"
        strokeWidth="0.8"
        fill="url(#pageFloraGradBR)"
        fillOpacity="0.16"
      />
    </svg>
  );
}

export default function UserLoginPage() {
  const router = useRouter();
  const { user, loginWithGoogle, loginWithGoogleCredential, authError, clearAuthError } = useAuth();
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const googleBtnRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  React.useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '311866236884-h651r4g3vfeq4dlhsi5np4bj3btvqinq.apps.googleusercontent.com';

    const tryInitGis = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id && googleBtnRef.current) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response?.credential) {
                setGoogleLoading(true);
                try {
                  await loginWithGoogleCredential(response.credential);
                  router.push('/');
                } catch (e) {
                  console.error('GIS login error:', e);
                } finally {
                  setGoogleLoading(false);
                }
              }
            },
          });

          googleBtnRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 340,
          });
        } catch (e) {
          console.warn('GIS login button error:', e);
        }
      }
    };

    tryInitGis();
    const timer = setTimeout(tryInitGis, 400);
    return () => clearTimeout(timer);
  }, [loginWithGoogleCredential, router]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    clearAuthError();
    loginWithGoogle('/');
  };

  return (
    <div
      className="min-vh-100 position-relative d-flex align-items-center justify-content-center p-3 p-md-5"
      style={{
        backgroundColor: '#1E1813',
        backgroundImage: `
          linear-gradient(rgba(28, 22, 17, 0.72), rgba(20, 15, 11, 0.88)),
          url('/images/hero_desktop.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Return to Storefront link */}
      <Link
        href="/"
        className="position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 text-decoration-none px-3 py-2 rounded-pill shadow-sm transition"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          color: '#1C1917',
          fontSize: '0.82rem',
          fontWeight: 500,
          border: '1px solid #D6BC92',
          zIndex: 30,
        }}
      >
        <ArrowLeft size={15} />
        <span>Return to IRA Store</span>
      </Link>

      {/* Main Luxury Central Card */}
      <div
        className="position-relative w-100 rounded-4 shadow-2xl overflow-hidden my-auto"
        style={{
          maxWidth: '500px',
          backgroundColor: '#FAF7F0',
          backgroundImage: 'linear-gradient(180deg, #FBF8F2 0%, #F5EFE3 100%)',
          border: '1px solid #D6BC92',
          boxShadow: '0 30px 80px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(214, 188, 146, 0.35)',
          borderRadius: '16px',
          zIndex: 10,
        }}
      >
        <CardCornerFloraTopLeft />
        <CardCornerFloraBottomRight />

        <div className="px-4 py-5 p-sm-5 text-center position-relative" style={{ zIndex: 10 }}>
          {/* Privilege Badge */}
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

          {/* Heading */}
          <h1
            className="font-serif fw-bold text-dark mb-2"
            style={{
              fontSize: '2.55rem',
              color: '#1C1917',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            Welcome Back
          </h1>

          {/* Subtitle */}
          <p
            className="mb-4 mx-auto"
            style={{
              color: '#5C5248',
              fontSize: '0.96rem',
              lineHeight: 1.55,
              maxWidth: '380px',
            }}
          >
            Sign in to access your wardrobe, track orders &amp; enjoy 1-click express checkout.
          </p>

          {authError && (
            <div
              className="alert alert-danger p-3 rounded-3 mb-3 text-start"
              style={{ fontSize: '0.86rem', backgroundColor: '#FDF2F2', borderColor: '#F8B4B4', color: '#9B1C1C' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1">
                <strong>Authentication Notice:</strong>
                <button
                  type="button"
                  className="btn-close ms-2"
                  aria-label="Close"
                  onClick={clearAuthError}
                  style={{ fontSize: '0.7rem' }}
                />
              </div>
              <div className="small">
                {authError.includes('redirect_uri_mismatch') ? (
                  <div>
                    Google Cloud requires adding your local redirect URI:
                    <div className="mt-1 p-2 rounded bg-white text-dark border font-monospace" style={{ fontSize: '0.78rem' }}>
                      http://localhost:3000/api/auth/google/callback
                    </div>
                    <div className="mt-1 text-muted" style={{ fontSize: '0.74rem' }}>
                      Add this in Google Cloud Console &rarr; Credentials &rarr; Authorized redirect URIs.
                    </div>
                  </div>
                ) : (
                  authError
                )}
              </div>
            </div>
          )}

          {/* Official Google GIS Button (First Button Only) */}
          <div className="d-flex justify-content-center my-3" style={{ minHeight: '44px' }}>
            <div ref={googleBtnRef} />
          </div>

          {/* Fleuron Line Divider */}
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

          {/* Security Note */}
          <div className="d-flex align-items-center justify-content-center gap-2">
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
        </div>
      </div>
    </div>
  );
}
