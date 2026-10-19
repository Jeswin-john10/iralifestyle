'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Gem, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  Check, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone,
  Lock 
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, PinterestIcon } from './SocialIcons';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const pathname = usePathname() || '';

  // Do not render storefront footer inside the admin portal
  if (pathname.startsWith('/admin')) {
    return null;
  }
  const { openAuthModal, user, openProfileDrawer } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail('');
      }
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer 
      className="position-relative text-light overflow-hidden" 
      style={{ 
        backgroundColor: '#181513', 
        borderTop: '2px solid rgba(212, 185, 142, 0.45)',
        color: '#EAE3D6'
      }}
    >
      {/* Decorative Gold Ambient Glow */}
      <div 
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)',
          boxShadow: '0 0 25px rgba(212, 185, 142, 0.6)',
        }}
      />

      {/* 1. PILLARS OF LUXURY SERVICE RIBBON */}
      <div className="border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#13110F' }}>
        <div className="container py-4">
          <div className="row g-4 justify-content-between align-items-center">
            {/* Pillar 1 */}
            <div className="col-6 col-lg-3 d-flex align-items-center gap-3">
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.35)', color: 'var(--gold-primary)', width: '42px', height: '42px', flexShrink: 0 }}
              >
                <Gem size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                  Artisanal Craftsmanship
                </h6>
                <small style={{ color: '#A09789', fontSize: '0.72rem' }}>Pure handloom silks & zari</small>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="col-6 col-lg-3 d-flex align-items-center gap-3">
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.35)', color: 'var(--gold-primary)', width: '42px', height: '42px', flexShrink: 0 }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                  Verified Trusted Platform
                </h6>
                <small style={{ color: '#A09789', fontSize: '0.72rem' }}>Certified authenticity & luxury guarantee</small>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="col-6 col-lg-3 d-flex align-items-center gap-3">
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.35)', color: 'var(--gold-primary)', width: '42px', height: '42px', flexShrink: 0 }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                  Style Your Elegance
                </h6>
                <small style={{ color: '#A09789', fontSize: '0.72rem' }}>Curated couture for every occasion</small>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="col-6 col-lg-3 d-flex align-items-center gap-3">
              <div 
                className="p-2 rounded-circle d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.35)', color: 'var(--gold-primary)', width: '42px', height: '42px', flexShrink: 0 }}
              >
                <Headphones size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                  Luxury Styling Concierge
                </h6>
                <small style={{ color: '#A09789', fontSize: '0.72rem' }}>Bespoke fittings & sizing</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL FOOTER CONTENT */}
      <div className="container py-5">
        <div className="row gy-5 gx-lg-5">
          {/* Column 1: Brand Heritage & Atelier */}
          <div className="col-12 col-md-6 col-lg-4 pe-lg-4">
            <Link href="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none" aria-label="IRA Lifestyle Home">
              <div 
                className="position-relative" 
                style={{ 
                  width: '42px', 
                  height: '50px',
                  filter: 'brightness(1.15) drop-shadow(0 2px 8px rgba(212, 185, 142, 0.4))'
                }}
              >
                <Image 
                  src="/logo.png" 
                  alt="IRA Lifestyle" 
                  fill 
                  sizes="42px" 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
              <div className="d-flex flex-column">
                <span className="font-serif fw-normal fs-4 text-white" style={{ letterSpacing: '0.12em', lineHeight: '1' }}>
                  IRA
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.28em', color: 'var(--gold-primary)', fontWeight: 600 }}>
                  LIFESTYLE
                </span>
              </div>
            </Link>

            <p style={{ color: '#B0A798', fontSize: '0.86rem', lineHeight: '1.75' }} className="mb-4">
              IRA Lifestyle celebrates the poetic heritage of Indian ethnic couture &mdash; handcrafted silk lehengas, bridal anarkalis, and ethereal chiffon sarees reimagined for the contemporary woman.
            </p>

              <div className="d-flex flex-column gap-2" style={{ fontSize: '0.82rem', color: '#C8BFB0' }}>
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span>Online Shopping Brand &bull; Guruvayoor, Thrissur, Kerala</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Mail size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span>care@iralifestyle.com</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Phone size={15} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                  <span>+91 99954 66002 (Mon &ndash; Sat, 10 AM &ndash; 8 PM)</span>
                </div>
              </div>
          </div>

          {/* Column 2: Haute Collections */}
          <div className="col-6 col-md-3 col-lg-2">
            <span className="text-uppercase fw-semibold d-block mb-3" style={{ fontSize: '0.74rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
              COLLECTIONS
            </span>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.84rem' }}>
              <li>
                <Link href="/shop/dresses" className="text-decoration-none footer-link-luxury">
                  Designer Anarkalis
                </Link>
              </li>
              <li>
                <Link href="/shop/sarees" className="text-decoration-none footer-link-luxury">
                  Kanjivaram & Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop/kurtis" className="text-decoration-none footer-link-luxury">
                  Chanderi Kurti Sets
                </Link>
              </li>
              <li>
                <Link href="/shop/co-ord-sets" className="text-decoration-none footer-link-luxury">
                  Contemporary Co-ords
                </Link>
              </li>
              <li>
                <Link href="/shop/new-arrivals" className="text-decoration-none footer-link-luxury">
                  Fresh Arrivals 2026
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-decoration-none footer-link-luxury">
                  Curated Lookbooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Private Client Concierge */}
          <div className="col-6 col-md-3 col-lg-2">
            <span className="text-uppercase fw-semibold d-block mb-3" style={{ fontSize: '0.74rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
              CLIENT CARE
            </span>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.84rem' }}>
              <li>
                <button 
                  onClick={() => user ? openProfileDrawer() : openAuthModal()}
                  className="btn btn-link p-0 text-start text-decoration-none footer-link-luxury"
                >
                  My Wardrobe Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => user ? openProfileDrawer() : openAuthModal()}
                  className="btn btn-link p-0 text-start text-decoration-none footer-link-luxury"
                >
                  Track Order
                </button>
              </li>
              <li>
                <Link href="/contact" className="text-decoration-none footer-link-luxury">
                  Bespoke Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-decoration-none footer-link-luxury">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-decoration-none footer-link-luxury">
                  Artisanal Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-decoration-none footer-link-luxury">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: The IRA Circle (VIP Privilege Club) */}
          <div className="col-12 col-md-6 col-lg-4">
            <div 
              className="p-4 rounded-3 position-relative overflow-hidden"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 185, 142, 0.28)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
                  THE IRA CIRCLE
                </span>
              </div>
              <h5 className="font-serif text-white mb-2" style={{ fontSize: '1.25rem' }}>
                Join Private Previews
              </h5>
              <p style={{ color: '#A09789', fontSize: '0.82rem', lineHeight: '1.6' }} className="mb-3">
                Receive private invitations to seasonal capsule releases, trunk shows, and artisanal lookbooks.
              </p>

              <form onSubmit={handleSubscribe} className="d-flex gap-2 mb-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your private email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control footer-newsletter-luxury-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ira-gold py-2 px-3 text-nowrap"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}
                >
                  {loading ? '...' : <ArrowRight size={15} />}
                </button>
              </form>

              {subscribed && (
                <div className="d-flex align-items-center gap-1 text-success small mb-3" style={{ fontSize: '0.76rem' }}>
                  <Check size={14} />
                  <span>Privilege access granted. Welcome to the circle.</span>
                </div>
              )}

              {/* Social Channels */}
              <div className="d-flex align-items-center gap-3 pt-2 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.14em', color: '#8E8576' }} className="text-uppercase">
                  CONNECT:
                </span>
                <div className="d-flex align-items-center gap-2">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-icon-luxury"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={14} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-icon-luxury"
                    aria-label="Facebook"
                  >
                    <FacebookIcon size={14} />
                  </a>
                  <a 
                    href="https://pinterest.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-icon-luxury"
                    aria-label="Pinterest"
                  >
                    <PinterestIcon size={14} />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="social-icon-luxury"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & COMPLIANCE BAR */}
      <div 
        className="py-3 border-top" 
        style={{ 
          borderColor: 'rgba(255, 255, 255, 0.07)', 
          backgroundColor: '#110F0D',
          fontSize: '0.72rem',
          color: '#8E8576'
        }}
      >
        <div className="container text-center">
          <div>
            &copy; 2026 IRA Lifestyle Private Limited &bull; All Rights Reserved &bull; Elegance In Every Thread
          </div>
        </div>
      </div>
    </footer>
  );
}
