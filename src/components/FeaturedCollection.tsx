'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface FeaturedCollectionProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function FeaturedCollection({ products, onQuickView }: FeaturedCollectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll Entrance Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track horizontal scroll progress and arrow states
  const handleScroll = () => {
    if (!scrollTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollTrackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(100);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
    setScrollProgress(progress);
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    const track = scrollTrackRef.current;
    if (!track) return;
    handleScroll();
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [products]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollTrackRef.current) return;
    const cardWidth = 260; // Approximate card scroll step
    const offset = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const displayProducts = products.length >= 5 ? products.slice(0, 5) : products;

  return (
    <section 
      ref={sectionRef}
      className={`featured-collection-section py-5 position-relative overflow-hidden ${isRevealed ? 'section-revealed' : ''}`}
      style={{ backgroundColor: '#FAF7F2', borderTop: '1px solid #ECE4D6', borderBottom: '1px solid #ECE4D6' }}
    >
      <div className="container-fluid px-3 px-xl-5">
        {/* Mobile / Tablet Carousel Navigation Controls Bar */}
        <div className="d-flex d-xl-none justify-content-between align-items-center mb-3 px-2">
          <div className="d-flex align-items-center gap-2">
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--gold-primary)' }}>
              FEATURED COLLECTION
            </span>
            <span style={{ width: '28px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={() => scrollByAmount('left')}
              disabled={!canScrollLeft}
              className="featured-nav-btn"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollByAmount('right')}
              disabled={!canScrollRight}
              className="featured-nav-btn"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Showcase Layout (Editorial Card + Product Sequence) */}
        <div className="featured-showcase-row">
          {/* Left Editorial Card */}
          <div className="featured-editorial-col">
            <div className="featured-editorial-card p-4 p-md-5 d-flex flex-column justify-content-between position-relative h-100">
              {/* Top Tagline & Title */}
              <div className="position-relative z-2">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                    FEATURED COLLECTION
                  </span>
                  <span style={{ width: '36px', height: '1px', backgroundColor: 'var(--gold-primary)' }}></span>
                </div>

                <h2 className="font-serif display-6 fw-normal text-dark mb-3 lh-sm" style={{ letterSpacing: '-0.01em' }}>
                  Designer <br />
                  Ethnic Wear
                </h2>

                <div className="featured-gold-divider mb-3"></div>

                <p className="text-muted small mb-4" style={{ lineHeight: '1.75', fontSize: '0.88rem' }}>
                  Elegant pieces for your most special moments. Tradition meets modern grace.
                </p>
              </div>

              {/* Bottom CTA Button */}
              <div className="position-relative z-2 mt-auto pt-3">
                <Link href="/shop" className="btn-ira-gold px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm">
                  <span>SHOP NOW</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Botanical Lotus Outline Watermark Art in Bottom Right */}
              <div className="featured-lotus-watermark animate-botanical-drift" aria-hidden="true">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lotus-svg"
                >
                  <path d="M100 160 C90 140 65 120 55 95 C45 70 58 45 80 32 C92 58 98 88 100 160 Z" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
                  <path d="M100 160 C110 140 135 120 145 95 C155 70 142 45 120 32 C108 58 102 88 100 160 Z" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
                  <path d="M100 160 C88 135 50 115 30 105 C16 98 16 78 38 70 C60 62 80 82 100 160 Z" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
                  <path d="M100 160 C112 135 150 115 170 105 C184 98 184 78 162 70 C140 62 120 82 100 160 Z" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.45" fill="none" />
                  <path d="M100 160 C96 115 92 80 100 18 C108 80 104 115 100 160 Z" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.55" fill="none" />
                  <path d="M35 160 C60 155 140 155 165 160" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 3" />
                  <path d="M100 160 L100 195" stroke="#D4B98E" strokeWidth="1.2" strokeOpacity="0.4" />
                  <path d="M100 175 C85 170 75 180 65 190" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.35" />
                  <path d="M100 185 C115 180 125 190 135 195" stroke="#D4B98E" strokeWidth="1" strokeOpacity="0.35" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right 5 Product Cards Horizontal Sequence / Scroll Track */}
          <div className="featured-products-col">
            <div 
              ref={scrollTrackRef}
              className="featured-scroll-track"
            >
              {displayProducts.map((prod, idx) => (
                <div 
                  key={prod.id} 
                  className="featured-product-card-wrap"
                  style={{ '--card-index': idx } as React.CSSProperties}
                >
                  <ProductCard
                    product={prod}
                    onQuickView={onQuickView}
                    index={idx}
                  />
                </div>
              ))}
            </div>

            {/* Dynamic Gold Scroll Progress Indicator Bar */}
            <div className="featured-scroll-progress-wrapper mt-3 px-1 d-flex align-items-center gap-3">
              <div className="featured-scroll-track-bg">
                <div 
                  className="featured-scroll-bar-fill"
                  style={{ width: `${Math.max(20, scrollProgress)}%` }}
                />
              </div>
              <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                SWIPE COLLECTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
