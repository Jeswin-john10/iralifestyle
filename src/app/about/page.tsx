import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Award, 
  MapPin, 
  Compass, 
  Gem, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import AboutRoadmap from '@/components/AboutRoadmap';

export const metadata = {
  title: 'Our Story & Heritage | IRA Lifestyle',
  description: 'The story of Nikhil & Anju: a couple goal born in Guruvayoor, Thrissur, blessed by parents, and dedicated to timeless luxury Indian clothing.',
};

export default function AboutPage() {
  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* 1. HERO BANNER */}
        <div className="text-center mb-5 pb-2">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
              THE HOUSE OF IRA &bull; GURUVAYOOR, THRISSUR
            </span>
          </div>
          <h1 className="font-serif display-4 fw-normal text-dark mt-1">
            Built on Love, Blessed by Family
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '680px', fontSize: '0.94rem', lineHeight: '1.8' }}>
            Where Nikhil &amp; Anju&apos;s shared couple goal met the unconditional blessings of parents to create IRA Lifestyle &mdash; timeless elegance born in the cultural heart of Kerala.
          </p>
        </div>

        {/* 2. THE COUPLE STORY & GENESIS */}
        <div className="row align-items-center gy-5 mb-5 pb-5 border-bottom reveal-card">
          <div className="col-12 col-md-6">
            <div 
              className="position-relative rounded shadow overflow-hidden"
              style={{ aspectRatio: '4 / 3.6', backgroundColor: '#E8E2D7' }}
            >
              <Image
                src="/images/story_portrait.jpg"
                alt="Nikhil & Anju - Founders of IRA Lifestyle"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
              />
              <div 
                className="position-absolute bottom-0 start-0 w-100 p-3"
                style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17, 15, 13, 0.8) 100%)' }}
              >
                <div className="text-white d-flex align-items-center gap-2 small fw-light">
                  <MapPin size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span>The Founders&apos; Atelier &bull; Guruvayoor, Thrissur</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 ps-lg-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Heart size={14} style={{ color: 'var(--gold-primary)' }} fill="currentColor" />
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--gold-primary)' }}>
                OUR COUPLE GOAL &amp; ORIGIN
              </span>
            </div>
            <h2 className="font-serif fs-2 fw-normal text-dark mt-1 mb-3">
              Two Hearts, One Timeless Dream
            </h2>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              IRA Lifestyle took root in <strong>early 2024</strong> around a modest living room table in <strong>Guruvayoor, Thrissur</strong>. Founded by <strong>Nikhil and Anju</strong>, IRA began as a passionate couple goal &mdash; months of thoughtful planning, sketching, and dreaming hand-in-hand to build a homegrown label that celebrates everyday royal elegance.
            </p>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              Walking side-by-side through every step, Nikhil and Anju found their greatest superpower in the <strong>unconditional love and blessings of their parents</strong>. When they took the leap to turn their shared thoughts into a brand, their families stood as their unwavering anchor of encouragement and faith.
            </p>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              Today, IRA Lifestyle operates as a beloved <strong>online shopping brand</strong> delivering nationwide from Guruvayoor, with exciting blueprints underway to open our first <strong>flagship physical experience branches</strong> in Thrissur and Kochi. Every creation carries the warmth of couple teamwork, parental grace, and Kerala&apos;s rich cultural heritage.
            </p>
            <Link href="/shop" className="btn-ira-gold">
              EXPLORE OUR CREATIONS <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 3. THE BRAND ROADMAP & JOURNEY (NIKHIL & ANJU COUPLE GOALS WITH SMOOTH ALTERNATING SCROLL ANIMATIONS) */}
        <div className="pt-2">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
                THE FOUNDERS&apos; JOURNEY &amp; ROADMAP
              </span>
              <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
            </div>
            <h2 className="font-serif display-5 fw-normal text-dark mt-1">
              Milestones of a Couple&apos;s Dream
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '640px', fontSize: '0.9rem', lineHeight: '1.75' }}>
              Scroll to follow the unfolding chapters of Nikhil &amp; Anju &mdash; each milestone gliding in from right and left &mdash; from their humble beginnings in Guruvayoor to dressing women across the globe.
            </p>
          </div>

          {/* Interactive Roadmap Component */}
          <AboutRoadmap />
        </div>

        {/* 4. THE CORE VALUES OF OUR FAMILY BRAND */}
        <div className="text-center mb-5 mt-5 pt-3">
          <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
            OUR BEDROCK VALUES
          </span>
          <h2 className="font-serif fs-2 fw-normal text-dark mt-1">
            What Drives IRA Everyday
          </h2>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="p-4 bg-white rounded-3 border h-100 text-center shadow-sm">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--gold-soft)', color: 'var(--gold-primary)' }}>
                <Heart size={26} fill="currentColor" />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2">Couple Dedication</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.75' }}>
                Nikhil and Anju personally review every silhouette, fabric batch, and design sketch, ensuring that every garment reflects genuine love and perfection.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 bg-white rounded-3 border h-100 text-center shadow-sm">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--gold-soft)', color: 'var(--gold-primary)' }}>
                <Users size={26} />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2">Parental Blessings</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.75' }}>
                Every achievement is dedicated to the parents whose steadfast faith, prayers, and sacrifices turned a young couple&apos;s passion into a living legacy.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 bg-white rounded-3 border h-100 text-center shadow-sm">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--gold-soft)', color: 'var(--gold-primary)' }}>
                <Sparkles size={26} />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2">Guruvayoor Heritage</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.75' }}>
                Deeply rooted in the spiritual culture and traditional handloom pride of Thrissur, Kerala &mdash; carrying authentic elegance to modern wardrobes worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* 5. FOUNDERS' NOTE */}
        <div 
          className="bg-white p-5 rounded-3 border text-center shadow-sm my-5"
          style={{ borderColor: 'rgba(212, 185, 142, 0.45)' }}
        >
          <p className="font-editorial fst-italic display-6 text-dark mb-3 mx-auto" style={{ maxWidth: '820px', lineHeight: '1.45' }}>
            &ldquo;IRA Lifestyle is the living manifestation of our shared love, nurtured by our parents&apos; relentless faith and blessed by the sacred soil of Guruvayoor. We weave devotion, family values, and timeless grace into every thread.&rdquo;
          </p>
          <span className="text-uppercase fw-semibold d-block" style={{ fontSize: '0.84rem', letterSpacing: '0.18em', color: 'var(--gold-primary)' }}>
            &mdash; Nikhil &amp; Anju
          </span>
          <small className="text-muted" style={{ fontSize: '0.74rem', letterSpacing: '0.08em' }}>
            Founders, IRA Lifestyle &bull; Guruvayoor, Thrissur
          </small>
        </div>
      </div>
    </div>
  );
}
