'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 reveal-up">
          <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.22em', color: 'var(--gold-primary)' }}>
            WE WOULD LOVE TO ASSIST YOU
          </span>
          <h1 className="font-serif display-4 fw-normal text-dark mt-1">
            Client Concierge & Support
          </h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.9rem' }}>
            Have questions about customized sizing, bridal consultations, or current orders? Our dedicated styling concierge is here to help.
          </p>
        </div>

        <div className="row gy-5 reveal-card">
          {/* Left Column: Contact Cards */}
          <div className="col-12 col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div className="p-4 bg-white rounded border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-sand" style={{ color: 'var(--gold-primary)' }}>
                    <Phone size={20} />
                  </div>
                  <h6 className="mb-0 font-serif fs-5 text-dark">Telephone & WhatsApp</h6>
                </div>
                <p className="text-muted small mb-1">Direct Styling Consultation & Support:</p>
                <a href="tel:+919995466002" className="fw-semibold text-dark text-decoration-none d-block mb-1">
                  +91 99954 66002
                </a>
                <a 
                  href="https://wa.me/919995466002" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-outline-success mt-2 d-inline-flex align-items-center gap-1"
                >
                  <MessageSquare size={14} /> Chat on WhatsApp
                </a>
              </div>

              <div className="p-4 bg-white rounded border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-sand" style={{ color: 'var(--gold-primary)' }}>
                    <Mail size={20} />
                  </div>
                  <h6 className="mb-0 font-serif fs-5 text-dark">Email Inquiries</h6>
                </div>
                <p className="text-muted small mb-1">Customer Care & Orders:</p>
                <a href="mailto:care@iralifestyle.com" className="fw-semibold text-dark text-decoration-none">
                  care@iralifestyle.com
                </a>
              </div>

              <div className="p-4 bg-white rounded border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-sand" style={{ color: 'var(--gold-primary)' }}>
                    <MapPin size={20} />
                  </div>
                  <h6 className="mb-0 font-serif fs-5 text-dark">Online Shopping Brand</h6>
                </div>
                <p className="text-muted small mb-1" style={{ lineHeight: '1.6' }}>
                  IRA Lifestyle &bull; Guruvayoor, Thrissur, Kerala, India
                </p>
                <small className="text-muted" style={{ fontSize: '0.74rem' }}>
                  Direct online boutique catering across India &amp; international express delivery
                </small>
              </div>

              <div className="p-4 bg-white rounded border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="p-2 rounded bg-sand" style={{ color: 'var(--gold-primary)' }}>
                    <Clock size={20} />
                  </div>
                  <h6 className="mb-0 font-serif fs-5 text-dark">Customer Support Hours</h6>
                </div>
                <p className="text-muted small mb-0">
                  Monday &ndash; Saturday: 10:00 AM &ndash; 8:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="col-12 col-lg-7">
            <div className="bg-white p-4 p-md-5 rounded border shadow-sm">
              <h3 className="font-serif fs-2 fw-normal text-dark mb-2">
                Send Us a Message
              </h3>
              <p className="text-muted small mb-4">
                Fill out the form below and our styling team will respond within 24 hours.
              </p>

              {status === 'success' ? (
                <div className="p-4 text-center bg-sand rounded border">
                  <CheckCircle2 size={40} className="text-success mb-2" />
                  <h4 className="font-serif text-dark">Thank You for Connecting</h4>
                  <p className="text-muted small mb-3">
                    Your message has been safely received. A dedicated stylist from IRA Lifestyle will reach out shortly.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="btn-ira-gold"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="form-control"
                        placeholder="e.g. Radhika Sharma"
                        style={{ borderRadius: '2px', borderColor: '#E8E2D7' }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="form-control"
                        placeholder="radhika@example.com"
                        style={{ borderRadius: '2px', borderColor: '#E8E2D7' }}
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="form-control"
                        placeholder="+91 99954 66002"
                        style={{ borderRadius: '2px', borderColor: '#E8E2D7' }}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="form-control"
                        placeholder="Custom sizing / Bridal inquiry"
                        style={{ borderRadius: '2px', borderColor: '#E8E2D7' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-dark">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="form-control"
                      placeholder="Please write your inquiry in detail..."
                      style={{ borderRadius: '2px', borderColor: '#E8E2D7' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-ira-gold py-3 justify-content-center mt-2"
                  >
                    {status === 'loading' ? 'TRANSMITTING...' : 'SEND INQUIRY →'}
                  </button>

                  {status === 'error' && (
                    <p className="text-danger small mt-2">Could not submit. Please try again or WhatsApp us directly.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
