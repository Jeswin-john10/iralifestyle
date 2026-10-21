'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    id: 'davani',
    label: 'DAVANI',
    slug: 'davani-set',
    href: '/shop/davani-set',
    image: '/images/cat_davani.jpg',
    tagline: 'Traditional Kerala dhavani half saree sets',
    objectPosition: 'center top',
  },
  {
    id: 'set-saree',
    label: 'SET SAREE',
    slug: 'set-saree',
    href: '/shop/set-saree',
    image: '/images/cat_set_saree.jpg',
    tagline: 'Pure Kerala Kasavu golden border set sarees',
    objectPosition: 'center top',
  },
  {
    id: 'set-mund',
    label: 'SET MUND',
    slug: 'set-mund',
    href: '/shop/set-mund',
    image: '/images/cat_set_mundu.jpg',
    tagline: 'Authentic Kerala traditional two-piece set mundu',
    objectPosition: 'center top',
  },
  {
    id: 'churidar',
    label: 'CHURIDAR',
    slug: 'churidar-set',
    href: '/shop/churidar-set',
    image: '/images/cat_churidar.jpg',
    tagline: 'Handcrafted churidar sets with fine artisanal dupattas',
    objectPosition: 'center top',
  },
  {
    id: 'mundu',
    label: 'MUNDU',
    slug: 'cream-double-mund',
    href: '/shop/cream-double-mund',
    image: '/images/cat_mundu.jpg',
    tagline: 'Authentic Kerala Kasavu double mundu for men',
    objectPosition: 'center top',
  },
];

// Delicate Corner Botanical Leaf Flourish SVG
function CornerBotanical({ position = 'top-left' }: { position?: 'top-left' | 'bottom-right' }) {
  const isTopLeft = position === 'top-left';

  return (
    <div 
      className={`position-absolute pointer-events-none d-none d-md-block ${isTopLeft ? 'animate-botanical-drift' : 'animate-botanical-drift-reverse'}`}
      style={{
        ...(isTopLeft ? { top: '15px', left: '10px' } : { bottom: '15px', right: '10px', transform: 'scaleX(-1) scaleY(-1)' }),
        zIndex: 0,
        opacity: 0.55,
      }}
    >
      <svg width="150" height="150" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 125C30 90 55 45 95 15" stroke="var(--gold-primary)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M38 95C24 86 16 70 26 56C35 72 38 84 38 95Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M58 70C44 58 38 40 50 28C58 44 58 58 58 70Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M80 42C68 28 62 12 76 3C82 18 80 32 80 42Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M48 85C64 78 78 86 75 102C64 94 54 90 48 85Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M68 56C84 50 95 58 92 74C81 66 74 62 68 56Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
}

export default function CategoryShowcase() {
  // Mobile Runway State
  const [activeIndex, setActiveIndex] = useState(2); // Start with center item (Sarees)
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = CATEGORY_ITEMS.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Desktop Scroll-triggered Sequential Card Animation State
  const [desktopCardsRevealed, setDesktopCardsRevealed] = useState(false);
  const desktopGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDesktopCardsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (desktopGridRef.current) {
      observer.observe(desktopGridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mobile Infinite Auto-Movement (Every 2.8s like models walking on a fashion show runway)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > 40) {
        nextSlide();
      } else if (distance < -40) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsPaused(false), 3000);
  };

  const activeMobileCat = CATEGORY_ITEMS[activeIndex];

  return (
    <section 
      className="position-relative py-5 overflow-hidden" 
      style={{ backgroundColor: '#FAF7F2' }}
    >
      {/* Corner Botanical Foliage (Matches Reference Art) */}
      <CornerBotanical position="top-left" />
      <CornerBotanical position="bottom-right" />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* SECTION HEADER (EXACT REPLICA OF USER REFERENCE IMAGE) */}
        <div className="text-center mb-4 mb-lg-5 reveal-up">
          {/* Top Delicate Gold Rules & Label */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold-primary)', opacity: 0.8 }} />
            <span 
              className="text-uppercase fw-semibold" 
              style={{ fontSize: '0.72rem', letterSpacing: '0.24em', color: 'var(--gold-primary)' }}
            >
              THE IRA EDIT &mdash; SHOP BY CATEGORY
            </span>
            <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold-primary)', opacity: 0.8 }} />
          </div>

          {/* Grand Editorial Title */}
          <h2 
            className="font-serif text-dark fw-normal mb-0" 
            style={{ 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', 
              letterSpacing: '-0.01em',
              lineHeight: '1.2'
            }}
          >
            Find Your Style
          </h2>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP MODE: 5 ELEGANT ARCHED CARDS WITH SMOOTH SCROLL ENTRANCE */}
        {/* ============================================================== */}
        <div 
          ref={desktopGridRef}
          className={`d-none d-lg-flex justify-content-center align-items-stretch gap-3 gap-xl-4 pb-2 ${desktopCardsRevealed ? 'is-revealed' : ''}`}
        >
          {CATEGORY_ITEMS.map((cat, idx) => (
            <div 
              key={cat.id} 
              className={`text-center arch-card-animated ${desktopCardsRevealed ? 'is-revealed' : ''}`}
              style={{ 
                flex: '1 1 0', 
                maxWidth: '220px', 
                transitionDelay: `${idx * 0.14}s` 
              }}
            >
              <Link href={cat.href} className="d-block text-decoration-none group-arch">
                {/* Deluxe Arched Frame with Inner Inset Gold Outline */}
                <div 
                  className="position-relative overflow-hidden arch-frame-luxury"
                  style={{
                    aspectRatio: '1 / 1.62',
                    borderRadius: '140px 140px 6px 6px',
                    backgroundColor: '#EBE4D8',
                    border: '1.5px solid rgba(198, 160, 105, 0.75)',
                    boxShadow: '0 8px 24px rgba(166, 124, 67, 0.1)',
                    transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Inner Fine Gold Border Inset Accent */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                    style={{
                      borderRadius: '136px 136px 4px 4px',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      margin: '4px',
                      width: 'calc(100% - 8px)',
                      height: 'calc(100% - 8px)',
                      zIndex: 2,
                    }}
                  />

                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="230px"
                    style={{ objectFit: 'cover', objectPosition: cat.objectPosition || 'center top' }}
                    className="arch-img-zoom"
                  />
                </div>

                {/* Elegant Label Below Card with Arrow (Exact match to reference) */}
                <div 
                  className="mt-3 d-flex align-items-center justify-content-center gap-2 arch-label-text"
                  style={{
                    fontSize: '0.78rem',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: '#654F33',
                    textTransform: 'uppercase',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span>{cat.label}</span>
                  <span className="arch-arrow" style={{ transition: 'transform 0.25s ease' }}>&rarr;</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ============================================================== */}
        {/* MOBILE MODE: 3D FASHION SHOW INFINITE RUNWAY SHOWCASE           */}
        {/* ============================================================== */}
        <div 
          className="d-block d-lg-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >


          {/* 3D Runway Stage */}
          <div 
            className="position-relative mx-auto"
            style={{
              height: '350px',
              maxWidth: '440px',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {CATEGORY_ITEMS.map((cat, idx) => {
              let diff = (idx - activeIndex + total) % total;
              if (diff > total / 2) diff -= total;

              const isCenter = diff === 0;
              let transform = '';
              let zIndex = 1;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (diff === 0) {
                // FRONT VIEW (Active Center Model)
                transform = 'translateX(-50%) translateY(0px) scale(1.15) rotateY(0deg)';
                zIndex = 10;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                // RIGHT BACK VIEW
                transform = 'translateX(6%) translateY(14px) scale(0.82) rotateY(-20deg)';
                zIndex = 5;
                opacity = 0.72;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                // LEFT BACK VIEW
                transform = 'translateX(-106%) translateY(14px) scale(0.82) rotateY(20deg)';
                zIndex = 5;
                opacity = 0.72;
                pointerEvents = 'auto';
              } else {
                // HIDDEN BEHIND
                transform = `translateX(${diff > 0 ? '110%' : '-210%'}) translateY(25px) scale(0.6) rotateY(${diff > 0 ? -35 : 35}deg)`;
                zIndex = 1;
                opacity = 0;
                pointerEvents = 'none';
              }

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(idx);
                  }}
                  className="position-absolute top-0 start-50"
                  style={{
                    width: '185px',
                    transform,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
                    cursor: isCenter ? 'default' : 'pointer',
                  }}
                >
                  <div 
                    className="position-relative overflow-hidden shadow-lg"
                    style={{
                      aspectRatio: '1 / 1.55',
                      borderRadius: '120px 120px 8px 8px',
                      backgroundColor: '#EBE4D8',
                      border: isCenter ? '2px solid var(--gold-primary)' : '1px solid rgba(198, 160, 105, 0.45)',
                      boxShadow: isCenter 
                        ? '0 18px 40px rgba(166, 124, 67, 0.32), 0 0 20px rgba(212, 185, 142, 0.3)' 
                        : '0 8px 18px rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="220px"
                      style={{ objectFit: 'cover', objectPosition: cat.objectPosition || 'center top' }}
                      priority={isCenter}
                    />

                    {/* Front Spotlight Label */}
                    {isCenter && (
                      <div 
                        className="position-absolute bottom-0 start-0 w-100 p-2 text-center"
                        style={{
                          background: 'linear-gradient(to top, rgba(24, 21, 19, 0.88) 0%, transparent 100%)',
                        }}
                      >
                        <span className="text-white text-uppercase fw-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.14em' }}>
                          {cat.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Model Info & Exploration Button */}
          <div className="text-center mt-3 px-3">
            <h4 className="font-serif text-dark mb-1" style={{ fontSize: '1.25rem', letterSpacing: '0.04em' }}>
              {activeMobileCat.label}
            </h4>
            <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '320px', fontSize: '0.8rem', lineHeight: '1.5' }}>
              {activeMobileCat.tagline}
            </p>

            <Link
              href={activeMobileCat.href}
              className="btn-ira-gold py-2 px-4 shadow-sm"
              style={{ fontSize: '0.76rem', letterSpacing: '0.12em' }}
            >
              EXPLORE {activeMobileCat.label} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Navigation Controls: Arrows & Dots */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
            <button
              onClick={prevSlide}
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center bg-white shadow-sm"
              style={{ width: '32px', height: '32px', borderColor: '#DFD5C5' }}
              aria-label="Previous model"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="d-flex align-items-center gap-2">
              {CATEGORY_ITEMS.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveIndex(i)}
                  className="btn p-0 rounded-pill transition"
                  style={{
                    width: i === activeIndex ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: i === activeIndex ? 'var(--gold-primary)' : '#DFD5C5',
                    border: 'none',
                  }}
                  aria-label={`Jump to ${cat.label}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center bg-white shadow-sm"
              style={{ width: '32px', height: '32px', borderColor: '#DFD5C5' }}
              aria-label="Next model"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
