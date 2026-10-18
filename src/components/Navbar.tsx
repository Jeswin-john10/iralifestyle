'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { useCart } from '@/context/CartWishlistContext';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen, setIsSearchOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'HOME', href: '/' },
    {
      label: 'SHOP',
      href: '/shop',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Collections', href: '/shop' },
        { name: 'Dresses', href: '/shop?category=Dresses' },
        { name: 'Kurtis', href: '/shop?category=Kurtis' },
        { name: 'Sarees', href: '/shop?category=Sarees' },
        { name: 'Co-ord Sets', href: '/shop?category=Co-ord Sets' },
        { name: 'New Arrivals', href: '/shop?category=New Arrivals' },
      ],
    },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#EDE5D8] text-[11px] py-1.5 px-4 md:px-12 text-[#686057] flex justify-between items-center tracking-wider">
        <div className="mx-auto md:mx-0 flex items-center space-x-2 font-medium">
          <span>FREE SHIPPING ON ORDERS ABOVE ₹999</span>
          <span className="opacity-40">|</span>
          <span className="hidden sm:inline">ELEGANCE IN EVERY THREAD</span>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <span className="text-[10px] tracking-widest text-[#8F867C]">Follow us</span>
          <div className="flex items-center space-x-2.5 text-[#5A524A]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B68D56] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B68D56] transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B68D56] transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full px-4 md:px-12 py-3 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-[#EDE5D8]'
            : 'bg-[#FAF7F2] border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/ira-logo.png"
                alt="IRA Lifestyle Monogram"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl md:text-[26px] font-semibold tracking-[0.2em] leading-none text-[#231F1C] uppercase"
              >
                IRA
              </span>
              <span className="text-[9px] tracking-[0.32em] text-[#8F867C] uppercase font-medium mt-0.5">
                LIFESTYLE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-9 text-[13px] tracking-[0.14em] font-medium text-[#2E2925]">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative group py-2"
                  onMouseEnter={() => setShopDropdownOpen(true)}
                  onMouseLeave={() => setShopDropdownOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center space-x-1 hover:text-[#B68D56] transition-colors ${
                      pathname.startsWith('/shop') ? 'text-[#B68D56]' : ''
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-[#8F867C]" />
                  </Link>

                  {/* Dropdown Menu */}
                  {shopDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-[#FCFAF7] border border-[#EDE5D8] shadow-xl py-2 rounded-sm z-50 animate-fadeIn">
                      {link.dropdownItems?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2.5 text-xs text-[#4A423A] hover:bg-[#F2ECE0] hover:text-[#B68D56] tracking-wider transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-[#B68D56] transition-colors relative py-2 ${
                    pathname === link.href ? 'text-[#B68D56]' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B68D56]" />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 text-[#2A2623]">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-[#B68D56] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 stroke-[1.7]" />
            </button>

            {/* Admin / Account Shortcut */}
            <Link
              href="/admin/ira/login"
              className="p-1.5 hover:text-[#B68D56] transition-colors relative group"
              aria-label="Admin Portal"
              title="Admin Portal (/admin/ira/login)"
            >
              <User className="w-5 h-5 stroke-[1.7]" />
            </Link>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-1.5 hover:text-[#B68D56] transition-colors relative"
              aria-label="Open Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.7]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B68D56] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:text-[#B68D56] transition-colors relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.7]" />
              <span className="absolute -top-1 -right-1 bg-[#231F1C] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#2A2623]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-4 border-t border-[#EDE5D8] flex flex-col space-y-3 pb-4">
            {navLinks.map((link) => (
              <div key={link.label} className="px-2">
                <Link
                  href={link.href}
                  className="block text-sm font-medium tracking-wider text-[#3D3731] hover:text-[#B68D56] py-1"
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-4 mt-1 border-l border-[#EDE5D8] space-y-2 py-1">
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-xs text-[#6F665C] hover:text-[#B68D56]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 px-2 border-t border-[#EDE5D8]/70 flex items-center justify-between text-xs text-[#8F867C]">
              <Link href="/admin/ira/login" className="hover:text-[#B68D56]">
                IRA Admin Portal →
              </Link>
              <span>Elegance in Every Thread</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
