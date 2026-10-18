import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF7F2] border-t border-[#EDE5D8] pt-14 pb-10 px-4 md:px-12 text-[#4A423A]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Brand Monogram & Name */}
        <Link href="/" className="flex items-center space-x-3 mb-6 group">
          <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/ira-logo.png"
              alt="IRA Lifestyle Monogram"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl font-semibold tracking-[0.2em] leading-none text-[#231F1C] uppercase"
            >
              IRA
            </span>
            <span className="text-[9px] tracking-[0.34em] text-[#8F867C] uppercase font-medium mt-0.5">
              LIFESTYLE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs tracking-[0.14em] font-medium text-[#50473F] mb-7">
          <Link href="/" className="hover:text-[#B68D56] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#B68D56] transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-[#B68D56] transition-colors">
            About
          </Link>
          <Link href="/collections" className="hover:text-[#B68D56] transition-colors">
            Collections
          </Link>
          <Link href="/contact" className="hover:text-[#B68D56] transition-colors">
            Contact
          </Link>
          <Link href="/admin/ira/login" className="hover:text-[#B68D56] transition-colors opacity-60">
            Admin Portal
          </Link>
        </div>

        {/* Social Icons & Motto */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-xs text-[#7B7268]">
          <div className="flex items-center space-x-4 text-[#4A423A]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-[#EDE5D8] flex items-center justify-center hover:bg-[#B68D56] hover:text-white hover:border-[#B68D56] transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-[#EDE5D8] flex items-center justify-center hover:bg-[#B68D56] hover:text-white hover:border-[#B68D56] transition-all"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-[#EDE5D8] flex items-center justify-center hover:bg-[#B68D56] hover:text-white hover:border-[#B68D56] transition-all"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="hidden sm:inline text-[#D3C7B6]">|</span>

          <span className="tracking-[0.2em] uppercase font-light text-[11px] text-[#6E655B]">
            Style &bull; Elegance &bull; You
          </span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#9E948A] tracking-wider pt-6 border-t border-[#EDE5D8]/80 w-full">
          &copy; 2025 IRA Lifestyle. All rights reserved. Craftsmanship and Modern Grace.
        </div>
      </div>
    </footer>
  );
}
