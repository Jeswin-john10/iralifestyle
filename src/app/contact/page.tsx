'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, Check } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bridal & Custom Styling',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Bridal & Custom Styling',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] tracking-[0.25em] text-[#8F867C] uppercase font-semibold block mb-2">
            CONCIERGE &bull; SUPPORT
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-4xl md:text-5xl font-normal text-[#231F1C] tracking-tight mb-4"
          >
            We Are At Your Service
          </h1>
          <p className="text-sm text-[#6F665C] font-light">
            Whether you need assistance with custom measurements, urgent wedding orders, or fabric inquiries, our dedicated stylists are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Contact Info & Boutiques */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#EDE5D8]">
              <h3
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl text-[#231F1C] font-normal mb-5"
              >
                Direct Concierge
              </h3>

              <div className="space-y-4 text-xs text-[#5A524A]">
                <div className="flex items-start space-x-3.5">
                  <Phone className="w-4 h-4 text-[#B68D56] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#231F1C]">Phone &amp; WhatsApp:</span>
                    <span>+91 98200 12345 (10:00 AM – 7:30 PM IST)</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Mail className="w-4 h-4 text-[#B68D56] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#231F1C]">Customer Care Email:</span>
                    <span>concierge@iralifestyle.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <Clock className="w-4 h-4 text-[#B68D56] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#231F1C]">Atelier Hours:</span>
                    <span>Monday to Saturday: 10:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutiques */}
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-xs border border-[#EDE5D8]">
              <h3
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl text-[#231F1C] font-normal mb-4"
              >
                Flagship Boutiques
              </h3>
              <div className="space-y-4 text-xs text-[#6F665C]">
                <div>
                  <h4 className="font-semibold text-[#231F1C] text-sm">New Delhi Flagship</h4>
                  <p>No. 18, Mehrauli Heritage Courtyard, Qutub Complex, New Delhi 110030</p>
                </div>
                <div className="pt-3 border-t border-[#EDE5D8]">
                  <h4 className="font-semibold text-[#231F1C] text-sm">Mumbai Boutique</h4>
                  <p>Kala Ghoda Art District, Fort, Mumbai 400001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xs border border-[#EDE5D8] shadow-xs">
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#231F1C] font-normal mb-2"
            >
              Send Us A Message
            </h3>
            <p className="text-xs text-[#8F867C] mb-8 font-light">
              Fill out the form below and an IRA lifestyle stylist will respond within 4 hours.
            </p>

            {sent ? (
              <div className="p-8 text-center bg-[#EAF2EC] text-[#2F5A35] rounded-xs border border-[#CDE0D2]">
                <Check className="w-8 h-8 mx-auto text-[#3F6A44] mb-3" />
                <h4 className="text-lg font-semibold mb-1">Message Received with Gratitude</h4>
                <p className="text-xs text-[#4E7654]">
                  Our styling concierge has received your request and will reach out to you promptly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 gold-btn px-6 py-2.5 text-xs rounded-xs uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Roy"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. radhika@example.com"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56] cursor-pointer"
                    >
                      <option value="Bridal & Custom Styling">Bridal &amp; Custom Styling</option>
                      <option value="Order Tracking & Delivery">Order Tracking &amp; Delivery</option>
                      <option value="Size Consultation">Size &amp; Fit Consultation</option>
                      <option value="Wholesale & Boutiques">Wholesale &amp; International</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are looking for..."
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="gold-btn w-full py-4 text-xs tracking-[0.2em] uppercase rounded-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{loading ? 'SENDING INQUIRY...' : 'SUBMIT INQUIRY'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
