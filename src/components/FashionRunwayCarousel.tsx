'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/data/initialData';

export default function FashionRunwayCarousel() {
  const [activeIndex, setActiveIndex] = useState(2); // Start with Sarees (or center index)
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const total = CATEGORIES.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Infinite Runway Auto-Play (Advances smoothly every 2.8s like models walking)
  useEffect(() => {
    if (isPaused) return;
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 2800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
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

  const activeCategory = CATEGORIES[activeIndex];

  return (
    <div
      className="fashion-runway-container position-relative overflow-hidden py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >


      {/* 3D Runway Stage */}
      <div
        className="runway-stage position-relative mx-auto"
        style={{
          height: '340px',
          maxWidth: '520px',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {CATEGORIES.map((cat, idx) => {
          // Calculate relative position (-2, -1, 0, 1, 2)
          let diff = (idx - activeIndex + total) % total;
          if (diff > total / 2) diff -= total;

          // Determine 3D transform, scale, z-index, and opacity
          let transform = '';
          let zIndex = 1;
          let opacity = 0;
          let pointerEvents: 'auto' | 'none' = 'none';
          let filter = 'brightness(0.75) blur(1px)';
          let isFront = diff === 0;

          if (diff === 0) {
            // FRONT VIEW (Active Center Model)
            transform = 'translateX(-50%) translateY(0px) scale(1.15) rotateY(0deg)';
            zIndex = 10;
            opacity = 1;
            filter = 'brightness(1) blur(0px)';
            pointerEvents = 'auto';
          } else if (diff === 1) {
            // RIGHT BACK VIEW (Next Model Stepping Out)
            transform = 'translateX(8%) translateY(14px) scale(0.84) rotateY(-20deg)';
            zIndex = 5;
            opacity = 0.75;
            filter = 'brightness(0.85) blur(0.5px)';
            pointerEvents = 'auto';
          } else if (diff === -1) {
            // LEFT BACK VIEW (Previous Model Stepping Back)
            transform = 'translateX(-108%) translateY(14px) scale(0.84) rotateY(20deg)';
            zIndex = 5;
            opacity = 0.75;
            filter = 'brightness(0.85) blur(0.5px)';
            pointerEvents = 'auto';
          } else {
            // HIDDEN BEHIND THE CURTAIN
            transform = `translateX(${diff > 0 ? '110%' : '-210%'}) translateY(25px) scale(0.6) rotateY(${diff > 0 ? -35 : 35}deg)`;
            zIndex = 1;
            opacity = 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={cat.id}
              onClick={() => {
                if (diff !== 0) {
                  setActiveIndex(idx);
                }
              }}
              className="runway-card-wrapper position-absolute top-0 start-50"
              style={{
                width: '190px',
                transform,
                zIndex,
                opacity,
                filter,
                pointerEvents,
                transition: 'all 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: isFront ? 'default' : 'pointer',
              }}
            >
              <div
                className={`arch-image-frame shadow-lg position-relative ${isFront ? 'border-gold-glow' : ''}`}
                style={{
                  aspectRatio: '1 / 1.35',
                  borderRadius: '110px 110px 10px 10px',
                  overflow: 'hidden',
                  backgroundColor: '#E8E2D7',
                  border: isFront ? '2px solid var(--gold-primary)' : '1px solid rgba(212, 185, 142, 0.4)',
                  boxShadow: isFront
                    ? '0 18px 36px rgba(166, 124, 67, 0.32), 0 0 20px rgba(212, 185, 142, 0.25)'
                    : '0 8px 20px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="240px"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  priority={isFront}
                />

                {/* Front spotlight reflection */}
                {isFront && (
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-2 text-center"
                    style={{
                      background: 'linear-gradient(to top, rgba(24, 21, 19, 0.85) 0%, transparent 100%)',
                    }}
                  >
                    <span className="text-white text-uppercase fw-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.14em' }}>
                      {cat.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Front Model Info & Quick Navigation */}
      <div className="text-center mt-2 px-3">
        <h4 className="font-serif text-dark mb-1" style={{ fontSize: '1.25rem', letterSpacing: '0.04em' }}>
          {activeCategory.name}
        </h4>
        <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '320px', fontSize: '0.8rem', lineHeight: '1.5' }}>
          {activeCategory.tagline}
        </p>

        <Link
          href={`/shop/${activeCategory.slug}`}
          className="btn-ira-gold py-2 px-4 shadow-sm"
          style={{ fontSize: '0.76rem', letterSpacing: '0.12em' }}
        >
          EXPLORE {activeCategory.name} <ArrowRight size={14} />
        </Link>
      </div>

      {/* Runway Navigation Arrows & Indicators */}
      <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
        <button
          onClick={prevSlide}
          className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center bg-white shadow-sm"
          style={{ width: '32px', height: '32px', borderColor: '#DFD5C5' }}
          aria-label="Previous category"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Dots */}
        <div className="d-flex align-items-center gap-2">
          {CATEGORIES.map((cat, i) => (
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
              aria-label={`Jump to ${cat.name}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center bg-white shadow-sm"
          style={{ width: '32px', height: '32px', borderColor: '#DFD5C5' }}
          aria-label="Next category"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
