import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  MessageCircle, 
  Sparkles, 
  Package, 
  CheckCircle2,
  MapPin 
} from 'lucide-react';

export const metadata = {
  title: 'Shipping, Delivery & Returns | IRA Lifestyle',
  description: 'Learn about our trusted WhatsApp order concierge, premium artisan packaging, pan-India courier partners, and transparent returns policy at IRA Lifestyle.',
};

export default function ShippingPage() {
  const whatsappUrl = "https://wa.me/919995466002?text=Hello%20IRA%20Lifestyle%2C%20I%20have%20an%20inquiry%20regarding%20shipping%20and%20order%20status.";

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-4 text-muted" style={{ fontSize: '0.76rem', letterSpacing: '0.1em' }}>
          <Link href="/" className="text-muted text-decoration-none hover-gold">HOME</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-dark fw-semibold">SHIPPING &amp; RETURNS</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-5 pb-2">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
              FULFILLMENT &bull; ATELIER DIRECT DISPATCH
            </span>
          </div>
          <h1 className="font-serif display-5 fw-normal text-dark mt-1">
            Shipping, Delivery &amp; Returns
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '680px', fontSize: '0.94rem', lineHeight: '1.8' }}>
            From our Guruvayoor atelier straight to your wardrobe &mdash; all orders are verified via our trusted WhatsApp concierge, hand-inspected for perfection, and delivered across India with utmost care.
          </p>
        </div>

        {/* 3 Trust Pillars Cards */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className="p-4 rounded-3 h-100 bg-white border shadow-sm text-center">
              <div 
                className="p-3 rounded-circle d-inline-flex mb-3"
                style={{ backgroundColor: 'rgba(212, 185, 142, 0.15)', color: 'var(--gold-primary)' }}
              >
                <MessageCircle size={26} />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                WhatsApp Verified Orders
              </h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Order directly or confirm via WhatsApp. Our royal concierge personally verifies size, color, and delivery address.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 rounded-3 h-100 bg-white border shadow-sm text-center">
              <div 
                className="p-3 rounded-circle d-inline-flex mb-3"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}
              >
                <ShieldCheck size={26} />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                100% Trusted Platform
              </h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Authentic Kerala handlooms &amp; designer couture. Pre-dispatch steam press and rigorous 3-point quality check.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-4 rounded-3 h-100 bg-white border shadow-sm text-center">
              <div 
                className="p-3 rounded-circle d-inline-flex mb-3"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#2563EB' }}
              >
                <RotateCcw size={26} />
              </div>
              <h5 className="font-serif fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                Hassle-Free Exchanges
              </h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                In the rare case of transit damage or sizing issue, notify our WhatsApp concierge within 48 hours for immediate replacement.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="row g-4 mb-5">
          {/* Left Column: Shipping Policy */}
          <div className="col-12 col-lg-7">
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Truck size={20} style={{ color: 'var(--gold-primary)' }} />
                <h3 className="font-serif fw-bold text-dark mb-0 fs-4">
                  1. Shipping &amp; Dispatch Process
                </h3>
              </div>
              <div className="text-muted small d-flex flex-column gap-3" style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
                <p>
                  Every garment created by <strong>IRA Lifestyle</strong> is treated as a piece of art. Once you place an order on our website or via our WhatsApp Concierge, our team prepares your bespoke parcel directly at our atelier in Guruvayoor, Thrissur.
                </p>

                <div className="p-3 rounded-3" style={{ backgroundColor: '#FAF8F4', border: '1px solid #EAE2D5' }}>
                  <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} className="text-success" />
                    How Buying via WhatsApp Works:
                  </h6>
                  <ul className="mb-0 ps-3 d-flex flex-column gap-1">
                    <li>Click <strong>&ldquo;Buy on WhatsApp&rdquo;</strong> on any product or complete checkout on the website.</li>
                    <li>Our concierge sends you an instant order summary, confirms your measurements, and coordinates secure payment.</li>
                    <li>Once confirmed, you receive an invoice and real-time dispatch updates directly on your WhatsApp number.</li>
                  </ul>
                </div>

                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Estimated Postal Delivery Timelines:</h6>
                  <ul className="mb-0 ps-3">
                    <li><strong>Kerala Postal Circle (PIN 67xxxx &ndash; 69xxxx):</strong> 2 &ndash; 3 business days via Speed Post</li>
                    <li><strong>South India Postal Circles (Tamil Nadu, Karnataka, Andhra, Telangana):</strong> 3 &ndash; 4 business days</li>
                    <li><strong>Metros &amp; Tier-1 Cities (Delhi, Mumbai, Bengaluru, Kolkata, Chennai):</strong> 3 &ndash; 5 business days</li>
                    <li><strong>Rest of India &amp; Rural PIN Codes:</strong> 5 &ndash; 7 business days via India Post Network</li>
                    <li><strong>Urgent / Bridal Occasion Dispatch:</strong> Priority Speed Post or Air Cargo available on request via WhatsApp</li>
                  </ul>
                </div>

                <div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>Shipping Charges:</h6>
                  <p className="mb-0">
                    We take pride in transparent pricing. We offer <strong>Complimentary Insured Shipping</strong> on prepaid orders across all Indian postal codes. For special express courier requests, actual carrier charges apply.
                  </p>
                </div>

                {/* Postal-Wise Pincode Verification Highlight */}
                <div className="p-3.5 rounded-3 border" style={{ backgroundColor: '#FAF3E8', borderColor: '#D6BC92' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <MapPin size={18} style={{ color: '#8A6836' }} />
                    <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.88rem' }}>
                      Postal-Wise Shipping Across 19,000+ PIN Codes:
                    </h6>
                  </div>
                  <p className="small text-muted mb-2" style={{ lineHeight: '1.6' }}>
                    Through our service with <strong>India Post Speed Post</strong>, IRA Lifestyle delivers to every registered postal code in India &mdash; from bustling metropolitan districts to the most tranquil village post offices.
                  </p>
                  <p className="small mb-0 fw-semibold text-dark">
                    💡 Check your PIN code: Simply message your 6-digit PIN code to our WhatsApp Concierge at <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-decoration-underline" style={{ color: '#8A6836' }}>+91 99954 66002</a> for instant estimated delivery date confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Packaging & Handling */}
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Package size={20} style={{ color: 'var(--gold-primary)' }} />
                <h3 className="font-serif fw-bold text-dark mb-0 fs-4">
                  2. Luxury Atelier Packaging
                </h3>
              </div>
              <p className="text-muted small mb-3" style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
                To ensure your garment reaches you in pristine condition, every order is folded in archival tissue, enclosed in a protective moisture-proof seal, and placed inside our signature rigid IRA presentation box with tamper-evident security tape.
              </p>
              <div className="d-flex align-items-center gap-2 text-dark small fw-semibold">
                <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                <span>Ready for gifting or personal ceremonial celebration.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Returns & Exchanges */}
          <div className="col-12 col-lg-5">
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <RotateCcw size={20} style={{ color: 'var(--gold-primary)' }} />
                <h3 className="font-serif fw-bold text-dark mb-0 fs-4">
                  3. Returns &amp; Exchanges Policy
                </h3>
              </div>
              <div className="text-muted small d-flex flex-column gap-3" style={{ lineHeight: '1.8', fontSize: '0.9rem' }}>
                <p>
                  As each IRA piece is curated in limited batches with genuine handlooms, pure zari, and artisanal stitching, we do everything possible to ensure complete satisfaction prior to dispatch.
                </p>

                <div className="border-start border-3 ps-3" style={{ borderColor: 'var(--gold-primary)' }}>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.88rem' }}>
                    Transit Damage or Wrong Item Received:
                  </h6>
                  <p className="mb-0">
                    If your package arrived damaged or you received an incorrect piece, please contact our WhatsApp concierge within <strong>48 hours of delivery</strong> with a brief parcel unboxing video. We will immediately arrange a replacement or full refund.
                  </p>
                </div>

                <div className="border-start border-3 ps-3" style={{ borderColor: '#059669' }}>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.88rem' }}>
                    Size Exchange Assistance:
                  </h6>
                  <p className="mb-0">
                    If you require a size adjustment on standard pieces, our concierge will assist in exchanging for your desired size, subject to boutique stock availability.
                  </p>
                </div>

                <div className="border-start border-3 ps-3" style={{ borderColor: '#9CA3AF' }}>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.88rem' }}>
                    Non-Returnable Conditions:
                  </h6>
                  <p className="mb-0">
                    Items that have been worn, washed, perfume-sprayed, altered, or returned without original tags &amp; luxury boxes are not eligible for exchange.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Concierge CTA Card */}
            <div 
              className="p-4 rounded-4 text-white position-relative overflow-hidden shadow"
              style={{ 
                background: 'linear-gradient(135deg, #1C1917 0%, #2A241E 100%)',
                border: '1px solid rgba(212, 185, 142, 0.4)'
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                <span className="text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                  PERSONAL CARE
                </span>
              </div>
              <h4 className="font-serif text-white mb-2 fs-5">
                Have a Question About Your Delivery?
              </h4>
              <p className="small mb-3" style={{ color: '#D4CEBF', lineHeight: '1.6' }}>
                Our private concierge is available on WhatsApp Monday through Saturday, 10 AM to 8 PM IST.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-100 py-2.5 rounded-3 d-inline-flex align-items-center justify-content-center gap-2 text-white fw-bold shadow-sm"
                style={{
                  background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
                  border: 'none',
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em'
                }}
              >
                <MessageCircle size={18} />
                <span>CHAT WITH US ON WHATSAPP</span>
              </a>

              <div className="mt-3 pt-3 border-top border-secondary small d-flex flex-column gap-1" style={{ fontSize: '0.76rem', color: '#B6AE9F' }}>
                <div>&bull; Phone: +91 99954 66002</div>
                <div>&bull; Email: www.iralifestyle@gmail.com</div>
                <div>&bull; Atelier: Guruvayoor, Thrissur, Kerala</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
