'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Heart, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Gem,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/initialData';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/components/QuickViewModal';
import ProductCard from '@/components/ProductCard';
import CategoryShowcase from '@/components/CategoryShowcase';
import FeaturedCollection from '@/components/FeaturedCollection';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'IRA LIFESTYLE',
    title: 'Timeless Elegance',
    subtitle: 'For Every You',
    desc: 'Crafted for the modern woman — graceful, confident and effortlessly stylish. Discover our latest collection of ethnic and contemporary wear.',
    link: '/shop',
    btnText: 'EXPLORE COLLECTION',
    imageDesktop: '/images/hero_model_desktop.jpg',
    imageMobile: '/images/hero_model_mobile.jpg',
    objectPositionDesktop: 'center 20%',
    objectPositionMobile: 'center 8%',
    scriptTop: 'Grace',
    scriptBottom: 'IN EVERY THREAD',
  },
  {
    id: 2,
    tag: 'ROYAL HERITAGE',
    title: 'Pure Silk Symphony',
    subtitle: 'Woven Traditions',
    desc: 'Handcrafted Banarasi and Kanjivaram silks tailored for timeless celebrations, weddings and unforgettable festive moments.',
    link: '/shop/sarees',
    btnText: 'DISCOVER SAREES',
    imageDesktop: '/images/cat_saree_hd.jpg',
    imageMobile: '/images/cat_saree_hd.jpg',
    objectPositionDesktop: 'center 15%',
    objectPositionMobile: 'center 6%',
    scriptTop: 'Heritage',
    scriptBottom: 'reimagined',
  },
  {
    id: 3,
    tag: 'NEW ARRIVALS',
    title: 'Contemporary Grace',
    subtitle: 'Modern Silhouettes',
    desc: 'Exquisite festive co-ord sets and velvet ensembles designed to make an unforgettable statement wherever you go.',
    link: '/shop/coord-sets',
    btnText: 'VIEW CO-ORDS',
    imageDesktop: '/images/cat_coord_hd.jpg',
    imageMobile: '/images/cat_coord_hd.jpg',
    objectPositionDesktop: 'center 18%',
    objectPositionMobile: 'center 8%',
    scriptTop: 'Luxury',
    scriptBottom: 'redefined',
  },
];

const TRUST_BADGES = [
  {
    icon: Truck,
    title: 'FREE SHIPPING',
    desc: 'On orders above ₹999',
  },
  {
    icon: ShieldCheck,
    title: 'PREMIUM QUALITY',
    desc: 'Crafted with care',
  },
  {
    icon: Sparkles,
    title: 'ETHNIC HERITAGE',
    desc: 'Timeless traditions',
  },
  {
    icon: Heart,
    title: 'ELEGANT DESIGNS',
    desc: 'For every occasion',
  },
];

const STORY_PROPOSITIONS = [
  {
    icon: Gem,
    title: 'Premium Quality Fabrics',
    desc: 'Artisanal silks & chiffons',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Secure Portal',
    desc: 'Bank-verified encrypted gateway',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    desc: 'Express courier across India',
  },
  {
    icon: Headphones,
    title: 'Customer Support Always Here',
    desc: 'Dedicated luxury styling help',
  },
];

export default function HomePage() {
  const { toggleWishlist, isInWishlist } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.slice(0, 5));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  const [activeTrustIndex, setActiveTrustIndex] = useState(0);
  const [trustRevealed, setTrustRevealed] = useState(false);
  const trustScrollRef = useRef<HTMLDivElement>(null);
  const trustSectionRef = useRef<HTMLDivElement>(null);

  const [storyPropsRevealed, setStoryPropsRevealed] = useState(false);
  const storyPropsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (trustSectionRef.current) {
      observer.observe(trustSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStoryPropsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (storyPropsRef.current) {
      observer.observe(storyPropsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleTrustScroll = () => {
    if (!trustScrollRef.current) return;
    const { scrollLeft, clientWidth } = trustScrollRef.current;
    const cardStep = clientWidth * 0.78;
    const newIdx = Math.round(scrollLeft / cardStep);
    setActiveTrustIndex(Math.min(TRUST_BADGES.length - 1, Math.max(0, newIdx)));
  };

  const scrollToTrustBadge = (index: number) => {
    if (!trustScrollRef.current) return;
    const cards = trustScrollRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveTrustIndex(index);
    }
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      }
    }
    loadProducts();
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SECTION (PREMIUM DESKTOP & MOBILE PERFECTION) */}
      <section className="hero-premium-section pt-3 pt-lg-4 pb-0">
        {/* Botanical Leaf Branch Watermark on Left Edge */}
        <div className="hero-left-botanical-branch d-none d-md-block" aria-hidden="true">
          <svg viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M10 290 Q30 200 15 130 T45 20" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
            <path d="M22 230 C45 210 55 190 40 180 C30 190 20 210 22 230 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M16 170 C40 155 48 135 35 125 C25 135 16 150 16 170 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M20 110 C48 95 52 75 38 68 C28 78 18 95 20 110 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M30 60 C55 50 60 30 45 25 C35 35 28 48 30 60 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M14 260 C-5 240 -8 220 2 215 C10 225 15 245 14 260 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M18 200 C-2 185 -4 165 6 160 C14 170 18 188 18 200 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M22 140 C2 125 0 105 10 100 C18 110 22 128 22 140 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          </svg>
        </div>

        <div className="container position-relative">
          {/* DESKTOP LAYOUT (>= 992px) */}
          <div className="d-none d-lg-block pb-4">
            <div className="row align-items-center gy-4">
              {/* Left Hero Content */}
              <div className="col-12 col-lg-5 pe-lg-4 animate-fade-in-up">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-uppercase fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
                    {activeSlide.tag}
                  </span>
                  <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
                </div>

                <h1 className="font-serif display-4 fw-normal text-dark mb-3 lh-sm" style={{ letterSpacing: '-0.01em' }}>
                  {activeSlide.title} <br />
                  <span className="fst-italic" style={{ color: 'var(--gold-primary)' }}>{activeSlide.subtitle}</span>
                </h1>

                <p className="text-muted mb-4 pe-lg-4" style={{ fontSize: '0.92rem', lineHeight: '1.7', minHeight: '48px' }}>
                  {activeSlide.desc}
                </p>

                <div className="d-flex align-items-center gap-4 mb-4">
                  <Link href={activeSlide.link} className="btn-ira-gold">
                    {activeSlide.btnText} <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Slider Controls */}
                <div className="d-flex align-items-center gap-3 pt-2 text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.12em' }}>
                  <span className="fw-semibold text-dark">0{activeSlide.id} / 0{HERO_SLIDES.length}</span>
                  <span className="text-muted" style={{ width: '40px', height: '1px', backgroundColor: '#D8D1C5' }}></span>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={handlePrevSlide}
                      className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px' }}
                      aria-label="Previous slide"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button 
                      onClick={handleNextSlide}
                      className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px' }}
                      aria-label="Next slide"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Hero Image (Seamless Luxury Visual) */}
              <div className="col-12 col-lg-7 position-relative">
                <div className="hero-desktop-image-wrapper">
                  <Image
                    src={activeSlide.imageDesktop}
                    alt={`${activeSlide.title} - IRA Lifestyle`}
                    fill
                    priority
                    sizes="(max-width: 992px) 100vw, 60vw"
                    style={{ 
                      objectFit: 'cover', 
                      objectPosition: activeSlide.objectPositionDesktop || 'center 20%' 
                    }}
                  />

                  {/* Floating Script Accent */}
                  <div className="hero-floating-script animate-float">
                    <p className="script-title">{activeSlide.scriptTop}</p>
                    <span className="script-sub-uppercase">{activeSlide.scriptBottom}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT (< 992px) */}
          <div className="d-block d-lg-none pb-4">
            {/* Mobile Visual Banner (Properly Framed with Full Headroom) */}
            <div className="hero-mobile-image-wrapper mb-4">
              <Image
                src={activeSlide.imageMobile}
                alt={`${activeSlide.title} - IRA Lifestyle`}
                fill
                priority
                sizes="100vw"
                style={{ 
                  objectFit: 'cover', 
                  objectPosition: activeSlide.objectPositionMobile || 'center 8%' 
                }}
              />

              {/* Floating Script Accent on Mobile */}
              <div className="hero-floating-script" style={{ top: '16px', right: '18px' }}>
                <p className="script-title fs-3">{activeSlide.scriptTop}</p>
                <span className="script-sub-uppercase">{activeSlide.scriptBottom}</span>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="text-center px-2">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                  {activeSlide.tag}
                </span>
              </div>

              <h1 className="font-serif display-5 fw-normal text-dark mb-2 lh-sm">
                {activeSlide.title} <br />
                <span className="fst-italic" style={{ color: 'var(--gold-primary)' }}>{activeSlide.subtitle}</span>
              </h1>

              <p className="text-muted mb-4 small" style={{ lineHeight: '1.6' }}>
                {activeSlide.desc}
              </p>

              <div className="d-flex justify-content-center gap-3 mb-4">
                <Link href={activeSlide.link} className="btn-ira-gold w-100 py-3" style={{ maxWidth: '320px' }}>
                  {activeSlide.btnText} <ArrowRight size={16} />
                </Link>
              </div>

              {/* Mobile Slide Navigation */}
              <div className="d-flex align-items-center justify-content-center gap-3 text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.12em' }}>
                <span className="fw-semibold text-dark">0{activeSlide.id} / 0{HERO_SLIDES.length}</span>
                <span className="text-muted" style={{ width: '30px', height: '1px', backgroundColor: '#D8D1C5' }}></span>
                <div className="d-flex gap-2">
                  <button 
                    onClick={handlePrevSlide}
                    className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    aria-label="Previous slide"
                  >
                    <ArrowLeft size={13} />
                  </button>
                  <button 
                    onClick={handleNextSlide}
                    className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    aria-label="Next slide"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Mobile Animated Trust Snap-Scroll Carousel (Sequential Staggered Scroll Animation) */}
              <div ref={trustSectionRef} className="hero-trust-carousel-mobile">
                <div 
                  ref={trustScrollRef}
                  onScroll={handleTrustScroll}
                  className="hero-trust-scroll-track"
                >
                  {TRUST_BADGES.map((badge, idx) => {
                    const Icon = badge.icon;
                    return (
                      <div 
                        key={idx} 
                        className={`hero-trust-card-snap ${trustRevealed ? 'is-revealed' : ''} ${activeTrustIndex === idx ? 'active' : ''}`}
                        style={{ transitionDelay: `${idx * 0.12}s` }}
                        onClick={() => scrollToTrustBadge(idx)}
                      >
                        <div className="trust-icon-box">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="trust-title">{badge.title}</p>
                          <p className="trust-desc">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dots indicator for current badge */}
                <div className="hero-trust-dots">
                  {TRUST_BADGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToTrustBadge(idx)}
                      className={`hero-trust-dot ${activeTrustIndex === idx ? 'active' : ''}`}
                      aria-label={`Go to badge ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP TRUST BADGES STRIP (Bottom of Hero) */}
        <div className="hero-trust-bar-desktop d-none d-lg-block">
          <div className="container">
            <div className="row g-0 justify-content-between">
              {TRUST_BADGES.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={idx} 
                    className={`col-3 ${idx < TRUST_BADGES.length - 1 ? 'border-end' : ''}`}
                    style={{ borderColor: '#EAE3D6' }}
                  >
                    <div className="hero-trust-item justify-content-center">
                      <div className="hero-trust-icon-box">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.08em', color: 'var(--text-dark)' }}>
                          {badge.title}
                        </h6>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {badge.desc}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY (DESKTOP: 5 ARCH CARDS ROW | MOBILE: 3D FASHION RUNWAY) */}
      <CategoryShowcase />

      {/* 3. FEATURED COLLECTION SECTION (DESIGNER ETHNIC WEAR SCROLLING & LUXURY DESIGN) */}
      <FeaturedCollection 
        products={products.length > 0 ? products : INITIAL_PRODUCTS} 
        onQuickView={setQuickViewProduct} 
      />

      {/* 4. OUR STORY SECTION */}
      <section className="py-5" style={{ backgroundColor: '#FDFBF7' }}>
        <div className="container">
          <div className="row align-items-center gy-4">
            {/* Story Model Portrait */}
            <div className="col-12 col-md-4">
              <div 
                className="position-relative overflow-hidden rounded shadow"
                style={{
                  aspectRatio: '4 / 3.3',
                  backgroundColor: '#F3EFE8',
                  border: '1px solid rgba(212, 185, 142, 0.45)'
                }}
              >
                <Image
                  src="/images/story_portrait.jpg"
                  alt="IRA Lifestyle Heritage"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
                />
              </div>
            </div>

            {/* Story Center Text */}
            <div className="col-12 col-md-5 px-lg-4">
              <span className="text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
                &mdash; OUR STORY
              </span>
              <h2 className="font-serif fs-2 fw-normal text-dark mb-3">
                More Than Just Clothing
              </h2>
              <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: '1.75' }}>
                At IRA Lifestyle, we believe in the power of fashion to express your true self. 
                Our collections are crafted with elegance, comfort and a touch of modern charm &mdash; 
                because you deserve to feel beautiful, always.
              </p>
              <div className="mt-4">
                <Link href="/about" className="btn-ira-gold">
                  KNOW MORE <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Story Value Propositions with Sequential Scroll-In Animation */}
            <div className="col-12 col-md-3">
              <div 
                ref={storyPropsRef}
                className={`story-props-container ${storyPropsRevealed ? 'is-revealed' : ''} ps-lg-3`}
              >
                {STORY_PROPOSITIONS.map((prop, idx) => {
                  const Icon = prop.icon;
                  return (
                    <div 
                      key={idx} 
                      className="story-prop-card"
                      style={{ transitionDelay: `${idx * 0.12}s` }}
                    >
                      <div className="story-prop-icon-box">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h6 className="story-prop-title">{prop.title}</h6>
                        <small className="story-prop-desc">{prop.desc}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUOTE BANNER & NEWSLETTER SECTION (PREMIUM ELEGANCE MATCHING MOCKUP) */}
      <section className="quote-newsletter-luxury-section py-5 position-relative">
        {/* Botanical Floral Corner Watermarks */}
        <div className="botanical-corner botanical-corner-tl" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M0 0 C40 10 70 35 85 70 C70 55 45 45 10 40 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.5" fill="none" />
            <path d="M0 25 C25 35 45 55 55 85 C42 70 25 60 0 55 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
            <path d="M20 0 C35 25 55 45 85 55 C70 42 60 25 55 0 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
            <circle cx="45" cy="45" r="3" fill="#D4B98E" fillOpacity="0.4" />
          </svg>
        </div>

        <div className="botanical-corner botanical-corner-bl" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M0 120 C40 110 70 85 85 50 C70 65 45 75 10 80 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.5" fill="none" />
            <path d="M0 95 C25 85 45 65 55 35 C42 50 25 60 0 65 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
            <path d="M20 120 C35 95 55 75 85 65 C70 78 60 95 55 120 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
          </svg>
        </div>

        <div className="botanical-corner botanical-corner-tr" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M120 0 C80 10 50 35 35 70 C50 55 75 45 110 40 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.5" fill="none" />
            <path d="M120 25 C95 35 75 55 65 85 C78 70 95 60 120 55 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
            <circle cx="75" cy="45" r="3" fill="#D4B98E" fillOpacity="0.4" />
          </svg>
        </div>

        <div className="botanical-corner botanical-corner-br" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M120 120 C80 110 50 85 35 50 C50 65 75 75 110 80 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.5" fill="none" />
            <path d="M120 95 C95 85 75 65 65 35 C78 50 95 60 120 65 Z" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.45" fill="none" />
          </svg>
        </div>

        <div className="container position-relative z-2 py-4">
          <div className="row align-items-center gy-5">
            {/* Left: Silk Quote */}
            <div className="col-12 col-md-5 pe-md-4 text-center text-md-start">
              <blockquote className="font-editorial fst-italic display-6 text-dark mb-3 lh-sm" style={{ letterSpacing: '-0.01em' }}>
                <span className="quote-mark-gold me-1">&ldquo;</span>
                Style is a way of saying who you are without speaking.
                <span className="quote-mark-gold ms-1">&bdquo;</span>
              </blockquote>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <span style={{ width: '32px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.78rem', letterSpacing: '0.24em', color: 'var(--gold-primary)' }}>
                  IRA
                </span>
              </div>
            </div>

            {/* Middle Vertical Divider with Star Ornament */}
            <div className="col-12 col-md-1 d-none d-md-flex justify-content-center p-0">
              <div className="d-flex flex-column align-items-center" style={{ height: '160px' }}>
                <div style={{ width: '1px', flex: 1, background: 'linear-gradient(180deg, transparent, #D4B98E)' }}></div>
                <div style={{ color: 'var(--gold-primary)', padding: '8px 0', fontSize: '1.1rem', lineHeight: 1 }}>✦</div>
                <div style={{ width: '1px', flex: 1, background: 'linear-gradient(180deg, #D4B98E, transparent)' }}></div>
              </div>
            </div>

            {/* Right: Newsletter Signup */}
            <div className="col-12 col-md-6 ps-md-4">
              <div className="text-center text-md-start">
                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                  <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
                  <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
                    JOIN OUR STYLE JOURNEY
                  </span>
                  <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
                </div>

                <h3 className="font-serif display-6 fw-normal text-dark mb-2">
                  Get Exclusive Updates
                </h3>

                <p className="text-muted small mb-4" style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Be the first to know about new arrivals, special offers and style tips.
                </p>

                <form onSubmit={handleNewsletter} className="newsletter-unified-bar mx-auto mx-md-0">
                  <div className="d-flex align-items-center flex-grow-1 px-3 py-1">
                    <Mail size={17} style={{ color: 'var(--gold-primary)' }} className="me-2 flex-shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="form-control border-0 bg-transparent shadow-none p-0"
                      style={{ fontSize: '0.88rem', color: '#221F1E' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={newsletterStatus === 'loading'}
                    className="btn-newsletter-subscribe"
                  >
                    <span>{newsletterStatus === 'loading' ? 'SUBMITTING...' : 'SUBSCRIBE'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>

                {newsletterStatus === 'success' && (
                  <div className="d-flex align-items-center gap-1 text-success mt-2 small justify-content-center justify-content-md-start">
                    <CheckCircle2 size={16} />
                    <span>Welcome to the IRA family! Check your inbox for your welcome gift.</span>
                  </div>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-danger mt-2 small text-center text-md-start">Could not subscribe. Please try again.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
