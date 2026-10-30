import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | IRA Lifestyle',
  description: 'Official Terms & Conditions of IRA Lifestyle — India\'s trusted platform for artisanal ethnic couture, WhatsApp-assisted ordering, and verified patronage.',
};

export default function TermsPage() {
  const whatsappUrl = "https://wa.me/919995466002?text=Hello%20IRA%20Lifestyle%2C%20I%20have%20an%20inquiry%20regarding%20terms%20and%20patron%20policies.";

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-4 text-muted" style={{ fontSize: '0.76rem', letterSpacing: '0.1em' }}>
          <Link href="/" className="text-muted text-decoration-none hover-gold">HOME</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-dark fw-semibold">TERMS &amp; CONDITIONS</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-5 pb-2">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
              LEGAL &bull; HOUSE OF IRA
            </span>
          </div>
          <h1 className="font-serif display-5 fw-normal text-dark mt-1">
            Terms &amp; Conditions
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '680px', fontSize: '0.94rem', lineHeight: '1.8' }}>
            Welcome to IRA Lifestyle &mdash; India&apos;s verified, trusted atelier for luxury ethnic couture. These terms outline our commitments, authentic WhatsApp ordering process, and patron protections.
          </p>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Last Updated: January 2026 &bull; Guruvayoor, Thrissur, Kerala
          </small>
        </div>

        {/* Highlight Guarantee Banner */}
        <div 
          className="p-4 rounded-4 mb-5 border d-flex align-items-center gap-3 shadow-sm"
          style={{ backgroundColor: '#FAF3E8', borderColor: '#D6BC92' }}
        >
          <div 
            className="p-3 rounded-circle text-white flex-shrink-0"
            style={{ backgroundColor: '#8A6836' }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <h5 className="font-serif fw-bold text-dark mb-1">
              100% Verified &amp; Trusted Luxury Platform
            </h5>
            <p className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
              All creations on IRA Lifestyle are guaranteed original, handcrafted by master artisans, and backed by direct WhatsApp concierge service.
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm d-flex flex-column gap-5">
              
              {/* Section 1 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>01</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    About IRA Lifestyle &amp; Verified Brand Authenticity
                  </h4>
                </div>
                <p className="text-muted small mb-3" style={{ lineHeight: '1.8' }}>
                  IRA Lifestyle is an authentic ethnic fashion label and online shopping brand registered and headquartered in <strong>Guruvayoor, Thrissur, Kerala, India</strong>. We specialize in handcrafted Kasavu set sarees, silk anarkalis, festive lehengas, and contemporary ethnic ensembles.
                </p>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>
                  By accessing our website (<strong>iralifestyle.com</strong>), purchasing online, or interacting with our official representatives via WhatsApp (+91 99954 66002), you agree to be bound by these Terms and Conditions.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>02</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    WhatsApp-Assisted Ordering &amp; Digital Purchases
                  </h4>
                </div>
                <p className="text-muted small mb-3" style={{ lineHeight: '1.8' }}>
                  To provide an elevated royal shopping experience, IRA Lifestyle offers direct <strong>WhatsApp Order Concierge</strong> alongside our website checkout.
                </p>
                <div className="p-3.5 p-sm-4 rounded-3" style={{ backgroundColor: '#FAF8F4', border: '1px solid #EAE2D5' }}>
                  <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.86rem' }}>
                    How WhatsApp Orders Are Processed &amp; Validated:
                  </h6>
                  <ul className="text-muted small mb-0 ps-3 d-flex flex-column gap-2" style={{ lineHeight: '1.6' }}>
                    <li>
                      <strong>Official Concierge Number:</strong> Only orders and payments coordinated via our verified WhatsApp number (<strong>+91 99954 66002</strong>) and official email (<strong>www.iralifestyle@gmail.com</strong>) represent genuine IRA Lifestyle transactions.
                    </li>
                    <li>
                      <strong>Order Confirmation:</strong> An order is legally booked once our team shares the order summary on WhatsApp or generates a confirmation invoice upon online payment.
                    </li>
                    <li>
                      <strong>Personal Fitting Verification:</strong> Before parcel dispatch, our concierge verifies measurements, drape specifications, and shipping details to minimize returns and guarantee perfection.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>03</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    Handloom Character &amp; Artisanal Variations
                  </h4>
                </div>
                <p className="text-muted small mb-2" style={{ lineHeight: '1.8' }}>
                  Authentic handloom silks, Kasavu weaves, and hand-embroidered textiles possess natural texture subtleties, including slight yarn variations, slubs, and delicate variations in zari sheen. These characteristics are the universal hallmark of artisanal authenticity, distinguishing pure handcrafting from industrial mass-manufacturing.
                </p>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>
                  While our photoshoot color fidelity is calibrated with studio lighting, slight perceptual color variations may arise across different smartphone and computer display calibrations.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>04</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    Order Cancellations, Returns &amp; Replacements
                  </h4>
                </div>
                <p className="text-muted small mb-3" style={{ lineHeight: '1.8' }}>
                  Orders may be cancelled or modified prior to atelier dispatch by sending an immediate WhatsApp message with your Order ID. Once an item is dispatched with our shipping partner, cancellation is not possible.
                </p>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>
                  For items damaged in transit or manufacturing anomalies, patrons must inform our concierge within <strong>48 hours of delivery</strong> accompanied by an unboxing video. Full details are outlined on our <Link href="/shipping" className="text-decoration-underline fw-semibold hover-gold" style={{ color: '#8A6836' }}>Shipping &amp; Returns Policy</Link>.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>05</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    Patron Data Privacy &amp; Confidentiality
                  </h4>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>
                  We treat patron privacy with utmost reverence. Your phone numbers, WhatsApp correspondence, postal addresses, and styling measurements are used exclusively to fulfill your orders and enhance your wardrobe experience. We never sell, lease, or distribute patron data to external advertising aggregators.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill text-white fw-bold" style={{ backgroundColor: '#8A6836', fontSize: '0.75rem' }}>06</span>
                  <h4 className="font-serif fw-bold text-dark mb-0 fs-5">
                    Governing Law &amp; Jurisdiction
                  </h4>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: '1.8' }}>
                  These terms shall be governed by and construed in accordance with the laws of India. Any legal dispute, arbitration, or claims arising out of or related to purchases through IRA Lifestyle shall be subject exclusively to the courts of <strong>Thrissur, Kerala, India</strong>.
                </p>
              </div>

            </div>
          </div>

          {/* Right Sidebar: Quick Contact & Trust Summary */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-4">
              
              {/* Trust Badge Card */}
              <div className="bg-white p-4 rounded-4 border shadow-sm">
                <h5 className="font-serif fw-bold text-dark mb-3">
                  Why Patrons Trust IRA
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-2.5">
                    <ShieldCheck size={18} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="fw-semibold text-dark small d-block">100% Verified Quality</span>
                      <small className="text-muted">Hand-inspected before parcel sealing.</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-2.5">
                    <MessageCircle size={18} className="text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="fw-semibold text-dark small d-block">Direct Concierge Care</span>
                      <small className="text-muted">No automated bots &mdash; talk to our stylists.</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Concierge Support Box */}
              <div 
                className="p-4 rounded-4 text-white shadow"
                style={{ 
                  background: 'linear-gradient(135deg, #1C1917 0%, #2A241E 100%)',
                  border: '1px solid rgba(212, 185, 142, 0.4)'
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span className="text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                    PATRON GRIEVANCE &amp; CARE
                  </span>
                </div>
                <h5 className="font-serif text-white mb-2">
                  Have Questions on Our Terms?
                </h5>
                <p className="small mb-3" style={{ color: '#D4CEBF', lineHeight: '1.6' }}>
                  Our legal and customer concierge desk is delighted to address any inquiries regarding our garments, orders, or terms.
                </p>
                <div className="d-flex flex-column gap-2 mb-3" style={{ fontSize: '0.82rem', color: '#E5DFD3' }}>
                  <div><strong>Email:</strong> www.iralifestyle@gmail.com</div>
                  <div><strong>WhatsApp &amp; Phone:</strong> +91 99954 66002</div>
                  <div><strong>Operating Hours:</strong> Mon &ndash; Sat, 10 AM &ndash; 8 PM IST</div>
                  <div><strong>Atelier:</strong> Guruvayoor, Thrissur, Kerala</div>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100 py-2.5 rounded-3 d-inline-flex align-items-center justify-content-center gap-2 text-white fw-bold shadow-sm"
                  style={{
                    background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
                    border: 'none',
                    fontSize: '0.84rem'
                  }}
                >
                  <MessageCircle size={17} />
                  <span>MESSAGE CONCIERGE ON WHATSAPP</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
