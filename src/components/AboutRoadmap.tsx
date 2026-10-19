'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  Gem, 
  Award, 
  Heart, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Store,
  Compass,
  Building2,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface RoadmapStep {
  year: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  direction: 'right' | 'left';
  stats: string;
  location: string;
  highlights: string[];
}

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    year: '2024 (Early)',
    tag: 'THE SPARK & COUPLE GOAL',
    title: 'The Idea Born in Guruvayoor',
    subtitle: 'Where Two Hearts Conceived a Vision',
    desc: 'In early 2024, in the serene cultural town of Guruvayoor, Thrissur, Nikhil and Anju were inspired by a shared realization: Indian ethnic fashion deserved to feel both royally graceful and effortlessly comfortable. What began as a heartfelt couple goal transformed into passionate evening brainstorms, sketches, and a bold vision for IRA Lifestyle.',
    direction: 'right', // 1st comes from right
    stats: 'Brainstorming & Brand Inception',
    location: 'Guruvayoor, Thrissur',
    highlights: [
      'Nikhil & Anju united on building their dream label together',
      'Identified the need for everyday royal luxury without stiff weight',
      'Pledged zero compromise on fabric purity and ethical craftsmanship'
    ]
  },
  {
    year: '2024 (Mid)',
    tag: 'FAMILY ANCHOR & BLUEPRINT',
    title: 'Planning, Thinking & Parental Blessings',
    subtitle: 'Turning Passion into a Solid Architecture',
    desc: 'Sharing their dream with their parents, Nikhil & Anju were met with overwhelming love, prayers, and unconditional encouragement. With their families standing as an unshakable emotional fortress, the couple spent months meticulously planning the logistics, artisan alliances, and brand foundation.',
    direction: 'left', // 2nd comes from left
    stats: 'Unconditional Family Blessing',
    location: 'Thrissur, Kerala',
    highlights: [
      'Parents provided emotional strength and grounded guidance',
      'Drafted the roadmap for direct artisan-to-customer model',
      'Officially registered IRA Lifestyle as a proud homegrown brand'
    ]
  },
  {
    year: '2024 (Late)',
    tag: 'CRAFT & PROTOTYPES',
    title: 'Sourcing Silks & Perfecting Fits',
    subtitle: 'Hands-on Selection of Pure Heritage Textiles',
    desc: 'Nikhil and Anju personally traveled to handloom clusters &mdash; vetting pure Mulberry silks, Chanderi cottons, and Banarasi weaves. Side-by-side, they inspected every seam, drape, and stitch, finalizing inaugural samples that met their exacting couple standards.',
    direction: 'right', // 3rd comes from right
    stats: '100% Tested Natural Silks',
    location: 'Guruvayoor Studio & Weaving Clusters',
    highlights: [
      'Personally vetted over 80 textile batches for breathability',
      'Developed signature silhouettes with master pattern cutters',
      'Established bespoke champagne-gold aesthetic and packaging'
    ]
  },
  {
    year: 'Current Implementation',
    tag: 'LIVE & THRIVING',
    title: 'Online Shopping Brand Launch',
    subtitle: 'Direct from Guruvayoor to Wardrobes Nationwide',
    desc: 'The couple dream is now a vibrant reality: IRA Lifestyle operates as an exclusive online shopping boutique rooted in Guruvayoor, Thrissur. Offering express pan-India delivery, dedicated WhatsApp styling concierge (+91 99954 66002), and dressing modern women in effortless royalty.',
    direction: 'left', // 4th comes from left
    stats: 'Serving Patrons Across India',
    location: 'Guruvayoor HQ & Pan-India Logistics',
    highlights: [
      'Direct online shopping brand catering pan-India & global delivery',
      'Personalized WhatsApp styling and sizing consultations',
      'Rapidly growing community of delighted patrons celebrating festivities'
    ]
  },
  {
    year: 'Future: Experience Studios',
    tag: 'PHYSICAL BRANCHES BLUEPRINT',
    title: 'Opening Physical Flagship Branches',
    subtitle: 'Bringing Guruvayoor Hospitality into Walk-in Boutiques',
    desc: 'Nikhil & Anju are planning the next grand chapter: opening physical IRA Lifestyle flagship experience boutiques. Starting with our home soil of Kerala &mdash; in Thrissur and Kochi &mdash; where patrons can touch the artisanal fabrics, experience personalized bridal fittings, and feel the couple’s warmth in person.',
    direction: 'right', // 5th comes from right
    stats: 'Planned: Thrissur & Kochi Branches',
    location: 'Thrissur, Kochi & Calicut (Planned)',
    highlights: [
      'Dedicated bridal styling suites and made-to-measure lounges',
      'Kerala heritage-inspired luxury retail boutique architecture',
      'Bridging tactile boutique luxury with our seamless online store'
    ]
  },
  {
    year: 'Future: Pan-India & Global',
    tag: 'LONG-TERM VISION',
    title: 'Pan-India Footprint & International Ateliers',
    subtitle: 'Carrying Couple Pride to Global Horizons',
    desc: 'The ultimate vision: expanding IRA Lifestyle branches to major Indian fashion capitals like Bengaluru and Chennai, followed by pop-up ateliers in international hubs like Dubai and London. Showcasing that an honest couple dream born in Guruvayoor with parental grace can shine on the world stage.',
    direction: 'left', // 6th comes from left
    stats: 'Pan-India & International Reach',
    location: 'Bengaluru, Dubai & Global Fashion Cities',
    highlights: [
      'Multi-city physical boutique presence across South & North India',
      'Bringing authentic Indian handlooms to international patrons',
      'Forever anchored in family values, shared love, and gratitude'
    ]
  }
];

export default function AboutRoadmap() {
  const [visibleItems, setVisibleItems] = useState<{ [key: number]: boolean }>({});
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
            observer.disconnect(); // Once revealed, stay revealed
          }
        },
        { 
          threshold: 0.18, 
          rootMargin: '0px 0px -40px 0px' 
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="luxury-roadmap-wrapper my-5">
      {/* Central Illuminated Golden Guide Line */}
      <div className="roadmap-center-line" aria-hidden="true" />

      <div className="container position-relative">
        {ROADMAP_STEPS.map((step, idx) => {
          const isVisible = !!visibleItems[idx];
          const isEven = idx % 2 === 0; // Even items on right, odd on left (desktop)
          const slideClass = step.direction === 'right' ? 'roadmap-slide-right' : 'roadmap-slide-left';

          return (
            <div 
              key={step.year}
              ref={(el) => { itemRefs.current[idx] = el; }}
              className={`roadmap-item-row ${isVisible ? 'is-visible' : ''}`}
            >
              {/* Central Glowing Milestone Node */}
              <div 
                className="roadmap-node-marker" 
                title={`${step.year} - ${step.title}`}
                aria-hidden="true"
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
              </div>

              {/* Row Layout with alternating desktop columns */}
              <div className="row align-items-center">
                {/* Left Side Column */}
                <div className={`col-12 col-lg-6 ${isEven ? 'order-2 order-lg-1' : 'order-2 order-lg-1'}`}>
                  {!isEven ? (
                    // Odd: Card on the Left
                    <div 
                      className={`roadmap-card-box ${slideClass} ${isVisible ? 'is-visible' : ''} me-lg-4`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <span className="roadmap-tag-pill">{step.tag}</span>
                        <span className="roadmap-year-badge">{step.year}</span>
                      </div>

                      <h4 className="font-serif fw-bold text-dark mt-2 mb-1" style={{ fontSize: '1.24rem' }}>
                        {step.title}
                      </h4>
                      <div className="text-uppercase fw-semibold mb-3" style={{ fontSize: '0.74rem', letterSpacing: '0.12em', color: 'var(--gold-primary)' }}>
                        {step.subtitle}
                      </div>

                      <p className="text-muted mb-3" style={{ fontSize: '0.86rem', lineHeight: '1.75' }}>
                        {step.desc}
                      </p>

                      <div className="d-flex flex-column gap-2 pt-3 border-top" style={{ borderColor: 'rgba(212, 185, 142, 0.25)' }}>
                        {step.highlights.map((item, hIdx) => (
                          <div key={hIdx} className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: '#5C5449' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: '0.72rem', color: 'var(--gold-primary)' }}>
                        <span className="d-flex align-items-center gap-1">
                          <MapPin size={13} /> {step.location}
                        </span>
                        <span className="fw-semibold px-2 py-1 rounded" style={{ background: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.3)' }}>
                          {step.stats}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Even: Empty spacer on desktop to balance line
                    <div className="d-none d-lg-block text-end pe-lg-5">
                      <span className="text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.22em', color: 'rgba(166, 124, 67, 0.45)' }}>
                        MILESTONE 0{idx + 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side Column */}
                <div className={`col-12 col-lg-6 ${isEven ? 'order-1 order-lg-2' : 'order-1 order-lg-2'}`}>
                  {isEven ? (
                    // Even: Card on the Right
                    <div 
                      className={`roadmap-card-box ${slideClass} ${isVisible ? 'is-visible' : ''} ms-lg-4`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <span className="roadmap-tag-pill">{step.tag}</span>
                        <span className="roadmap-year-badge">{step.year}</span>
                      </div>

                      <h4 className="font-serif fw-bold text-dark mt-2 mb-1" style={{ fontSize: '1.24rem' }}>
                        {step.title}
                      </h4>
                      <div className="text-uppercase fw-semibold mb-3" style={{ fontSize: '0.74rem', letterSpacing: '0.12em', color: 'var(--gold-primary)' }}>
                        {step.subtitle}
                      </div>

                      <p className="text-muted mb-3" style={{ fontSize: '0.86rem', lineHeight: '1.75' }}>
                        {step.desc}
                      </p>

                      <div className="d-flex flex-column gap-2 pt-3 border-top" style={{ borderColor: 'rgba(212, 185, 142, 0.25)' }}>
                        {step.highlights.map((item, hIdx) => (
                          <div key={hIdx} className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: '#5C5449' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: '0.72rem', color: 'var(--gold-primary)' }}>
                        <span className="d-flex align-items-center gap-1">
                          <MapPin size={13} /> {step.location}
                        </span>
                        <span className="fw-semibold px-2 py-1 rounded" style={{ background: 'rgba(212, 185, 142, 0.12)', border: '1px solid rgba(212, 185, 142, 0.3)' }}>
                          {step.stats}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Odd: Empty spacer on desktop to balance line
                    <div className="d-none d-lg-block text-start ps-lg-5">
                      <span className="text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.22em', color: 'rgba(166, 124, 67, 0.45)' }}>
                        MILESTONE 0{idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Atelier Vision Footer Note */}
      <div className="container text-center mt-5 pt-3">
        <div 
          className="d-inline-flex flex-column align-items-center p-4 rounded-3 border"
          style={{ background: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(212, 185, 142, 0.45)', maxWidth: '680px' }}
        >
          <div className="d-flex align-items-center gap-2 mb-2" style={{ color: 'var(--gold-primary)' }}>
            <Heart size={18} fill="currentColor" />
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.18em' }}>
              OUR JOURNEY CONTINUES WITH YOU
            </span>
            <Heart size={18} fill="currentColor" />
          </div>
          <p className="text-muted small mb-3" style={{ lineHeight: '1.75' }}>
            From an idea conceived in 2024 to our current online shopping brand, and future physical branches in Thrissur &amp; beyond &mdash; every step is driven by Nikhil &amp; Anju&apos;s love and your support.
          </p>
          <Link href="/shop" className="btn-ira-gold">
            EXPLORE OUR CREATIONS <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
