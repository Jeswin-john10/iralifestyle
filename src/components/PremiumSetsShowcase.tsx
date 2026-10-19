'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Delicate Gold Botanical Flourish SVG
function BotanicalBranch({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 100 45" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ width: '48px', height: '22px', ...style }}
    >
      <path 
        d="M2 22C28 22 55 20 98 22M22 22C18 14 12 10 4 11C11 17 17 21 22 22ZM42 21C38 10 30 5 18 7C28 14 36 19 42 21ZM65 21C61 9 52 3 39 5C49 13 58 19 65 21ZM86 21C81 10 73 4 60 7C71 14 80 19 86 21ZM34 22C39 30 46 36 57 34C48 28 41 24 34 22ZM56 22C62 32 70 38 82 36C72 29 64 24 56 22ZM78 22C83 31 90 36 98 35C91 29 84 25 78 22Z" 
        stroke="var(--gold-primary)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

// Corner Ambient Botanical Leaf
function CornerBotanical({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const styles: Record<string, React.CSSProperties> = {
    'top-left': { top: '10px', left: '-15px', transform: 'rotate(10deg)' },
    'top-right': { top: '10px', right: '-15px', transform: 'rotate(-10deg) scaleX(-1)' },
    'bottom-left': { bottom: '15px', left: '-20px', transform: 'rotate(-25deg)' },
    'bottom-right': { bottom: '15px', right: '-20px', transform: 'rotate(25deg) scaleX(-1)' },
  };

  return (
    <div 
      className="position-absolute pointer-events-none d-none d-md-block opacity-40"
      style={{ ...styles[position], zIndex: 0 }}
    >
      <svg width="130" height="150" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 115C25 80 50 40 85 15" stroke="var(--gold-primary)" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M35 88C22 80 15 65 24 52C32 66 35 78 35 88Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M52 65C40 54 35 38 46 28C53 42 53 54 52 65Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M72 40C62 28 58 14 70 5C76 18 74 30 72 40Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M42 78C56 72 68 80 66 94C56 86 48 82 42 78Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
        <path d="M60 52C74 46 84 52 82 66C72 60 66 56 60 52Z" stroke="var(--gold-primary)" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
}

// 4 Feature Icons
function FeatureCrown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.203a4 4 0 0 1-3.86 2.928H8.713a4 4 0 0 1-3.86-2.928L2.019 6.019a.5.5 0 0 1 .798-.519l4.277 3.664a1 1 0 0 0 1.516-.294z"/>
      <path d="M5 21h14"/>
    </svg>
  );
}

function FeatureLeaf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}

function FeatureDiamond() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/>
      <path d="M11 3 8 9l4 13 4-13-3-6"/>
      <path d="M2 9h20"/>
    </svg>
  );
}

function FeatureHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  );
}

export const PREMIUM_SETS_DATA = [
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    badgeTitle: 'PREMIUM SET',
    badgeSub: 'TOP + PANT\n+ DUPATTA',
    subtitle: 'THE FRESH SEASONAL EDIT OF PREMIUM SETS',
    image: '/images/cat_new_v2.jpg',
    slug: 'new-arrivals',
  },
  {
    id: 'co-ord-sets',
    name: 'Co-ord Sets',
    badgeTitle: 'PREMIUM SET',
    badgeSub: 'TOP + PANT\n+ DUPATTA',
    subtitle: 'MODERN COORDINATED LUXURY & STATEMENT SILHOUETTES',
    image: '/images/cat_coord_v2.jpg',
    slug: 'co-ord-sets',
  },
  {
    id: 'dresses',
    name: 'Designer Anarkalis',
    badgeTitle: 'PREMIUM SET',
    badgeSub: 'ANARKALI + PANT\n+ DUPATTA',
    subtitle: 'REGAL CRAFTSMANSHIP FOR YOUR SPECIAL CELEBRATIONS',
    image: '/images/cat_dress.jpg',
    slug: 'dresses',
  },
  {
    id: 'kurtis',
    name: 'Chanderi Kurti Sets',
    badgeTitle: 'PREMIUM SET',
    badgeSub: 'KURTI + PANT\n+ DUPATTA',
    subtitle: 'TIMELESS COMFORT WOVEN WITH ARTISANAL THREADS',
    image: '/images/cat_kurti.jpg',
    slug: 'kurtis',
  },
  {
    id: 'sarees',
    name: 'Kanjivaram Silk Sarees',
    badgeTitle: 'PREMIUM SET',
    badgeSub: 'PURE SILK SAREE\n+ DESIGNER BLOUSE',
    subtitle: 'NINE YARDS OF UNAPOLOGETIC OPULENCE & SHEER GRACE',
    image: '/images/cat_saree_v2.jpg',
    slug: 'sarees',
  },
];

export default function PremiumSetsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0); // Default to New Arrivals as in reference
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = PREMIUM_SETS_DATA.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch Swipe for Mobile
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
    setTimeout(() => setIsPaused(false), 3500);
  };

  const activeSet = PREMIUM_SETS_DATA[activeIndex];

  return (
    <section 
      className="position-relative overflow-hidden py-5"
      style={{
        background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 50%, #FAF7F2 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Corner Botanical Leaves (Exact match to reference art) */}
      <CornerBotanical position="top-left" />
      <CornerBotanical position="top-right" />
      <CornerBotanical position="bottom-left" />
      <CornerBotanical position="bottom-right" />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* 1. EDITORIAL HEADER */}
        <div className="text-center mb-4 mb-md-5">
          {/* Label with delicate rules */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <span style={{ width: '32px', height: '1px', backgroundColor: 'var(--gold-primary)', opacity: 0.7 }} />
            <span 
              className="text-uppercase fw-semibold" 
              style={{ fontSize: '0.72rem', letterSpacing: '0.24em', color: 'var(--gold-primary)' }}
            >
              PREMIUM COLLECTION
            </span>
            <span style={{ width: '32px', height: '1px', backgroundColor: 'var(--gold-primary)', opacity: 0.7 }} />
          </div>

          {/* Main Title */}
          <h2 
            className="font-serif text-dark fw-normal mb-2"
            style={{ 
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
              letterSpacing: '-0.02em',
              lineHeight: '1.15'
            }}
          >
            Premium Sets
          </h2>

          {/* Subtitle */}
          <p 
            className="text-uppercase fw-semibold mb-1" 
            style={{ fontSize: '0.75rem', letterSpacing: '0.26em', color: '#8C7758' }}
          >
            TIMELESS STYLE &bull; EFFORTLESS ELEGANCE
          </p>

          {/* Italic Script */}
          <p 
            className="font-editorial fst-italic text-muted mb-0" 
            style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}
          >
            Curated sets for every occasion
          </p>
        </div>

        {/* 2. THREE-DIMENSIONAL SHOWCASE STAGE */}
        <div 
          className="position-relative mx-auto"
          style={{
            maxWidth: '720px',
            minHeight: '440px',
            perspective: '1400px',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {PREMIUM_SETS_DATA.map((set, idx) => {
            let diff = (idx - activeIndex + total) % total;
            if (diff > total / 2) diff -= total;

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;

            // Transform styles to achieve exact 3D positioning from reference image
            let transform = '';
            let zIndex = 1;
            let opacity = 0;
            let pointerEvents: 'auto' | 'none' = 'none';

            if (isCenter) {
              transform = 'translateX(0) translateY(0) scale(1) rotateY(0deg)';
              zIndex = 10;
              opacity = 1;
              pointerEvents = 'auto';
            } else if (isLeft) {
              transform = 'translateX(-56%) translateY(20px) scale(0.82) rotateY(14deg)';
              zIndex = 5;
              opacity = 0.75;
              pointerEvents = 'auto';
            } else if (isRight) {
              transform = 'translateX(56%) translateY(20px) scale(0.82) rotateY(-14deg)';
              zIndex = 5;
              opacity = 0.75;
              pointerEvents = 'auto';
            } else {
              transform = `translateX(${diff > 0 ? '110%' : '-110%'}) translateY(40px) scale(0.65) rotateY(${diff > 0 ? -25 : 25}deg)`;
              zIndex = 1;
              opacity = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={set.id}
                onClick={() => {
                  if (!isCenter) setActiveIndex(idx);
                }}
                className="position-absolute"
                style={{
                  width: 'clamp(260px, 48vw, 360px)',
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents,
                  transition: 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                {/* Arched Frame with Golden Bevel & Drop Shadow */}
                <div 
                  className="position-relative overflow-hidden shadow-2xl"
                  style={{
                    aspectRatio: '1 / 1.34',
                    borderRadius: '170px 170px 18px 18px',
                    backgroundColor: '#EBE4D8',
                    border: '2px solid rgba(198, 160, 105, 0.75)',
                    boxShadow: isCenter 
                      ? '0 25px 60px rgba(166, 124, 67, 0.28), 0 10px 25px rgba(0,0,0,0.08)' 
                      : '0 12px 30px rgba(0,0,0,0.14)',
                  }}
                >
                  <Image
                    src={set.image}
                    alt={set.name}
                    fill
                    sizes="(max-width: 768px) 320px, 420px"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    priority={isCenter}
                  />

                  {/* Top-Right Floating Luxury Badge (Only on active center card as in reference) */}
                  {isCenter && (
                    <div 
                      className="position-absolute top-0 end-0 m-3 p-2 rounded text-center shadow-sm"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.88)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(198, 160, 105, 0.5)',
                        maxWidth: '120px',
                        zIndex: 3,
                      }}
                    >
                      <div className="d-flex justify-content-center mb-1">
                        <FeatureCrown />
                      </div>
                      <div 
                        className="fw-bold text-dark text-uppercase" 
                        style={{ fontSize: '0.72rem', letterSpacing: '0.08em', lineHeight: '1.2' }}
                      >
                        {set.badgeTitle}
                      </div>
                      <div 
                        className="text-muted text-uppercase mt-1" 
                        style={{ fontSize: '0.58rem', letterSpacing: '0.06em', whiteSpace: 'pre-line', lineHeight: '1.3' }}
                      >
                        {set.badgeSub}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Integrated Ivory Dock Panel (Directly attached to active center card as in reference) */}
                {isCenter && (
                  <div 
                    className="position-relative bg-white rounded-3 p-3 shadow-lg mt-n3 mx-auto"
                    style={{
                      maxWidth: '92%',
                      marginTop: '-32px',
                      border: '1.5px solid rgba(198, 160, 105, 0.65)',
                      backgroundColor: '#FCFAF6',
                      boxShadow: '0 12px 32px rgba(166, 124, 67, 0.2)',
                      zIndex: 12,
                    }}
                  >
                    <div className="row g-1 text-center align-items-center">
                      {/* 1. Premium Fabrics */}
                      <div className="col-3 border-end" style={{ borderColor: 'rgba(198, 160, 105, 0.3)' }}>
                        <div 
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1"
                          style={{ width: '30px', height: '30px', backgroundColor: 'rgba(198, 160, 105, 0.14)' }}
                        >
                          <FeatureCrown />
                        </div>
                        <span 
                          className="d-block text-uppercase fw-semibold" 
                          style={{ fontSize: '0.56rem', letterSpacing: '0.05em', color: '#5C5243', lineHeight: '1.2' }}
                        >
                          PREMIUM<br />FABRICS
                        </span>
                      </div>

                      {/* 2. Elegant Designs */}
                      <div className="col-3 border-end" style={{ borderColor: 'rgba(198, 160, 105, 0.3)' }}>
                        <div 
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1"
                          style={{ width: '30px', height: '30px', backgroundColor: 'rgba(198, 160, 105, 0.14)' }}
                        >
                          <FeatureLeaf />
                        </div>
                        <span 
                          className="d-block text-uppercase fw-semibold" 
                          style={{ fontSize: '0.56rem', letterSpacing: '0.05em', color: '#5C5243', lineHeight: '1.2' }}
                        >
                          ELEGANT<br />DESIGNS
                        </span>
                      </div>

                      {/* 3. Perfect Fit */}
                      <div className="col-3 border-end" style={{ borderColor: 'rgba(198, 160, 105, 0.3)' }}>
                        <div 
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1"
                          style={{ width: '30px', height: '30px', backgroundColor: 'rgba(198, 160, 105, 0.14)' }}
                        >
                          <FeatureDiamond />
                        </div>
                        <span 
                          className="d-block text-uppercase fw-semibold" 
                          style={{ fontSize: '0.56rem', letterSpacing: '0.05em', color: '#5C5243', lineHeight: '1.2' }}
                        >
                          PERFECT<br />FIT
                        </span>
                      </div>

                      {/* 4. For Every Occasion */}
                      <div className="col-3">
                        <div 
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1"
                          style={{ width: '30px', height: '30px', backgroundColor: 'rgba(198, 160, 105, 0.14)' }}
                        >
                          <FeatureHeart />
                        </div>
                        <span 
                          className="d-block text-uppercase fw-semibold" 
                          style={{ fontSize: '0.56rem', letterSpacing: '0.05em', color: '#5C5243', lineHeight: '1.2' }}
                        >
                          FOR EVERY<br />OCCASION
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Floating Navigation Chevron Pills (Positioned exactly on center card edges) */}
          <button
            onClick={prevSlide}
            className="btn rounded-circle d-flex align-items-center justify-content-center position-absolute shadow-lg hover-elevate transition"
            style={{
              width: '42px',
              height: '42px',
              left: 'clamp(8px, 8vw, 80px)',
              top: '44%',
              transform: 'translateY(-50%)',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(198, 160, 105, 0.45)',
              color: '#3A3226',
              zIndex: 25,
            }}
            aria-label="Previous set"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="btn rounded-circle d-flex align-items-center justify-content-center position-absolute shadow-lg hover-elevate transition"
            style={{
              width: '42px',
              height: '42px',
              right: 'clamp(8px, 8vw, 80px)',
              top: '44%',
              transform: 'translateY(-50%)',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(198, 160, 105, 0.45)',
              color: '#3A3226',
              zIndex: 25,
            }}
            aria-label="Next set"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 3. DYNAMIC BOTTOM CATEGORY & CALL-TO-ACTION */}
        <div className="text-center mt-5 pt-3">
          {/* Botanical Laurels Flanking Title (Exact match to reference art) */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
            <BotanicalBranch />
            <h3 
              className="font-serif text-dark fw-normal mb-0" 
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)' }}
            >
              {activeSet.name}
            </h3>
            <BotanicalBranch style={{ transform: 'scaleX(-1)' }} />
          </div>

          {/* Subtitle */}
          <p 
            className="text-uppercase fw-semibold mb-4" 
            style={{ fontSize: '0.72rem', letterSpacing: '0.22em', color: '#8C7758' }}
          >
            {activeSet.subtitle}
          </p>

          {/* Warm Caramel/Gold Pill CTA Button (Exact match to reference art) */}
          <div className="mb-4">
            <Link
              href={`/shop/${activeSet.slug}`}
              className="btn text-white fw-semibold d-inline-flex align-items-center gap-2 hover-elevate shadow-lg text-uppercase"
              style={{
                background: 'linear-gradient(135deg, #B58448 0%, #96672E 100%)',
                borderRadius: '32px',
                padding: '13px 36px',
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                border: 'none',
                boxShadow: '0 8px 24px rgba(166, 124, 67, 0.38)',
              }}
            >
              EXPLORE PREMIUM SETS <ArrowRight size={15} />
            </Link>
          </div>

          {/* 5 Subtle Pagination Dots */}
          <div className="d-flex align-items-center justify-content-center gap-2">
            {PREMIUM_SETS_DATA.map((set, i) => (
              <button
                key={set.id}
                onClick={() => setActiveIndex(i)}
                className="btn p-0 rounded-circle transition"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: i === activeIndex ? '#B58448' : '#D9CFBF',
                  border: 'none',
                }}
                aria-label={`Go to ${set.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
