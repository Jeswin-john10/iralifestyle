import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gem, Heart, Leaf } from 'lucide-react';

export const metadata = {
  title: 'About Our Heritage | IRA LIFESTYLE',
  description: 'The story behind IRA Lifestyle — celebrating traditional Indian artisanal mastery and modern grace.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] tracking-[0.3em] text-[#8F867C] uppercase font-semibold block mb-2">
            OUR HERITAGE &bull; PHILOSOPHY
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#231F1C] tracking-tight mb-6"
          >
            The Spirit of IRA Lifestyle
          </h1>
          <p className="text-sm sm:text-base text-[#6F665C] font-light leading-relaxed">
            In Sanskrit, <em className="text-[#B68D56] font-normal not-italic font-semibold">IRA</em> signifies wisdom, pure earth, and the divine muse of artistic grace. We were born out of a desire to create clothing that honors generational Indian textile artistry while offering effortless comfort for the contemporary global woman.
          </p>
        </div>

        {/* Big Dual-panel Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20">
          <div className="lg:col-span-6 relative aspect-[4/5] rounded-xs overflow-hidden shadow-sm bg-[#EDE5D8]">
            <Image
              src="/images/story-model.jpg"
              alt="IRA Lifestyle Philosophy"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F867C]">
              BORN IN HERITAGE
            </span>
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-3xl sm:text-4xl text-[#231F1C] font-normal leading-snug"
            >
              Every Thread Carries A Legacy
            </h2>
            <p className="text-sm text-[#686057] leading-relaxed font-light">
              From the historic looms of Chanderi and Varanasi to hand-guided zardozi embroidery workshops in Old Delhi and Lucknow, each IRA creation is touched by master artisans who have perfected their discipline over decades.
            </p>
            <p className="text-sm text-[#686057] leading-relaxed font-light">
              We reject fleeting, disposable trends. Instead, our silhouettes are designed to be heirloom staples in your wardrobe — garments that you wear with pride at grand celebrations and cherish for years to come.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="gold-btn px-6 py-3 text-xs tracking-widest rounded-xs uppercase inline-flex items-center space-x-2"
              >
                <span>EXPLORE CREATIONS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-14 border-t border-b border-[#EDE5D8] mb-20">
          <div className="bg-[#F4EFE6] p-8 rounded-xs border border-[#EDE5D8]/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D2] flex items-center justify-center text-[#B68D56] mb-5">
              <Gem className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl text-[#231F1C] font-normal mb-3"
            >
              Artisanal Nobility
            </h3>
            <p className="text-xs text-[#6F665C] leading-relaxed font-light">
              We exclusively use pure handloom silks, fine Belgian linens, organic cotton shantoons, and micro-chiffons treated with natural vegetable dyes whenever possible.
            </p>
          </div>

          <div className="bg-[#F4EFE6] p-8 rounded-xs border border-[#EDE5D8]/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D2] flex items-center justify-center text-[#B68D56] mb-5">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl text-[#231F1C] font-normal mb-3"
            >
              The Modern Silhouette
            </h3>
            <p className="text-xs text-[#6F665C] leading-relaxed font-light">
              Indian ethnic clothing should flatter without restricting. Every cut is engineered with ergonomic armholes, discreet pockets, and adjustable waist sashes.
            </p>
          </div>

          <div className="bg-[#F4EFE6] p-8 rounded-xs border border-[#EDE5D8]/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#EAE2D2] flex items-center justify-center text-[#B68D56] mb-5">
              <Leaf className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl text-[#231F1C] font-normal mb-3"
            >
              Ethical Atelier
            </h3>
            <p className="text-xs text-[#6F665C] leading-relaxed font-light">
              Our partner weavers and karigars receive transparent fair wages, safe studio environments, and healthcare support for their families.
            </p>
          </div>
        </div>

        {/* Monogram Seal Quote */}
        <div className="text-center max-w-2xl mx-auto py-8">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <Image
              src="/images/ira-logo.png"
              alt="IRA Seal"
              fill
              className="object-contain"
            />
          </div>
          <blockquote
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-2xl sm:text-3xl text-[#231F1C] italic font-normal leading-relaxed mb-3"
          >
            &ldquo;Crafted for the modern woman — graceful, confident and effortlessly stylish.&rdquo;
          </blockquote>
          <span className="text-xs tracking-[0.3em] font-semibold text-[#B68D56] uppercase">
            IRA LIFESTYLE &bull; EST. 2025
          </span>
        </div>
      </div>
    </div>
  );
}
