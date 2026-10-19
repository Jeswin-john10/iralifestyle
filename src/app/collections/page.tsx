import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import CollectionsList from '@/components/CollectionsList';

export const metadata = {
  title: 'Editorial Collections | IRA Lifestyle',
  description: 'Explore curated seasonal lookbooks and bridal capsules from IRA Lifestyle. Handcrafted festive wear and royal Indian silks.',
};

export default function CollectionsPage() {
  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Editorial Header */}
        <div className="text-center mb-5 pb-3">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
              CURATED LOOKBOOKS & COUTURE CAPSULES
            </span>
            <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
          </div>
          <h1 className="font-serif display-4 fw-normal text-dark mt-1">
            The IRA Collections
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '640px', fontSize: '0.92rem', lineHeight: '1.8' }}>
            Each capsule tells a distinct narrative of ancestral loom heritage, architectural tailoring, and unapologetic femininity &mdash; crafted for life&apos;s most memorable celebrations.
          </p>
        </div>

        {/* Collections Stack with Smooth Alternating Scroll Animations & Perfect Image Fit */}
        <CollectionsList />

        {/* Bespoke Styling Invitation Footer */}
        <div className="text-center mt-5 pt-4">
          <div 
            className="d-inline-flex flex-column align-items-center p-4 p-md-5 rounded-3 border"
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderColor: 'rgba(212, 185, 142, 0.4)',
              boxShadow: '0 10px 30px rgba(60, 45, 20, 0.04)',
              maxWidth: '720px'
            }}
          >
            <span className="text-uppercase fw-semibold mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--gold-primary)' }}>
              PRIVATE CLIENT CONCIERGE
            </span>
            <h3 className="font-serif fs-2 fw-normal text-dark mb-2">
              Looking for a Bespoke Ensemble?
            </h3>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.75', maxWidth: '560px' }}>
              Whether you desire custom blouse tailoring, personalized color palettes, or bridal party styling, our luxury stylists are at your service.
            </p>
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <Link href="/contact" className="btn-ira-gold">
                BOOK PRIVATE STYLIST <ArrowRight size={14} />
              </Link>
              <Link href="/shop" className="btn btn-outline-secondary px-4 py-2" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                BROWSE FULL CATALOG
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
