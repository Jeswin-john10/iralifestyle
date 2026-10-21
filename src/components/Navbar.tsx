'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname() || '/';

  // Do not render storefront navbar inside the admin portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const { user, openAuthModal, openProfileDrawer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdown(false);
  }, [pathname]);

  const [categoriesList, setCategoriesList] = useState<Array<{ label: string; href: string }>>([
    { label: 'Set saree', href: '/shop/set-saree' },
    { label: 'Set mund', href: '/shop/set-mund' },
    { label: 'Cream Double Mund', href: '/shop/cream-double-mund' },
    { label: 'White Double mund', href: '/shop/white-double-mund' },
    { label: 'Frock', href: '/shop/frock' },
    { label: 'Churidar set', href: '/shop/churidar-set' },
    { label: 'cotton handkerchief', href: '/shop/cotton-handkerchief' },
    { label: 'Bath towels', href: '/shop/bath-towels' },
    { label: 'Inner wears for men and women', href: '/shop/inner-wears' },
    { label: 'Bedsheets', href: '/shop/bedsheets' },
    { label: 'Pillow covers', href: '/shop/pillow-covers' },
    { label: 'Colour saree', href: '/shop/colour-saree' },
    { label: 'Davani set', href: '/shop/davani-set' },
    { label: 'Blouse materials', href: '/shop/blouse-materials' },
  ]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategoriesList(
            data.categories.map((c: any) => ({
              label: c.name,
              href: `/shop/${c.slug}`,
            }))
          );
        }
      })
      .catch((err) => console.warn('Failed to load categories in navbar', err));
  }, []);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { 
      label: 'SHOP', 
      href: '/shop',
      hasDropdown: true,
      subcategories: categoriesList,
    },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-bar">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-none d-md-block" style={{ width: '120px' }}></div>
          <div className="text-center flex-grow-1 fw-medium">
            FREE SHIPPING &nbsp;|&nbsp; ELEGANCE IN EVERY THREAD
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-lg-inline text-muted" style={{ fontSize: '0.68rem' }}>Follow us</span>
            <div className="d-flex align-items-center gap-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-secondary hover-gold" aria-label="Instagram">
                <InstagramIcon size={13} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-secondary hover-gold" aria-label="Facebook">
                <FacebookIcon size={13} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-secondary hover-gold" aria-label="YouTube">
                <YoutubeIcon size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className={`luxury-navbar ${isScrolled ? 'shadow-sm py-2' : 'py-3'}`}>
        <div className="container d-flex align-items-center justify-content-between">
          {/* Mobile menu trigger */}
          <button 
            className="btn btn-link text-dark p-0 d-lg-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>

          {/* Brand Logo with Monogram */}
          <Link href="/" className="brand-logo-container" aria-label="IRA Lifestyle Home">
            <div className="brand-logo-mark">
              <Image 
                src="/logo.png" 
                alt="IRA Lifestyle Monogram Logo" 
                fill 
                sizes="48px" 
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-title fs-4">IRA</span>
              <span className="brand-subtitle">LIFESTYLE</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              
              if (link.hasDropdown) {
                return (
                  <div 
                    key={link.label}
                    className="position-relative"
                    onMouseEnter={() => setShopDropdown(true)}
                    onMouseLeave={() => setShopDropdown(false)}
                  >
                    <Link 
                      href={link.href} 
                      className={`nav-link-ira d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                      <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: shopDropdown ? 'rotate(180deg)' : 'none' }} />
                    </Link>

                    {/* Dropdown Menu - 2 Column Luxury Grid */}
                    {shopDropdown && (
                      <div 
                        className="position-absolute shadow-lg bg-white border p-3 rounded"
                        style={{
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '460px',
                          borderColor: '#E8E2D7',
                          zIndex: 1100,
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                          <span className="text-uppercase fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.14em', color: 'var(--gold-primary)' }}>
                            Boutique Collections
                          </span>
                          <Link href="/shop" className="text-decoration-none small text-muted hover-gold" style={{ fontSize: '0.72rem' }}>
                            View All Products →
                          </Link>
                        </div>
                        <div className="row g-1">
                          {categoriesList.map((sub) => (
                            <div key={sub.label} className="col-6">
                              <Link
                                href={sub.href}
                                className="dropdown-item px-2.5 py-1.5 text-dark rounded d-flex align-items-center"
                                style={{ fontSize: '0.78rem', letterSpacing: '0.03em' }}
                              >
                                <span className="me-2" style={{ color: 'var(--gold-primary)', fontSize: '0.9rem' }}>•</span>
                                <span className="text-truncate">{sub.label}</span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={`nav-link-ira ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Icon Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Trigger */}
            <button 
              className="btn btn-link p-1 text-dark" 
              onClick={() => setSearchOpen(true)}
              aria-label="Search collection"
            >
              <Search size={19} />
            </button>

            {/* Customer Account & Profile Trigger */}
            <button 
              type="button"
              onClick={() => {
                if (user) {
                  openProfileDrawer();
                } else {
                  openAuthModal();
                }
              }}
              className="btn btn-link p-1 text-dark position-relative d-flex align-items-center"
              title={user ? `Signed in as ${user.name}` : 'Sign In with Google / Account'}
              aria-label="Customer Account"
            >
              {user?.avatar ? (
                <div 
                  className="rounded-circle overflow-hidden position-relative border"
                  style={{ width: '26px', height: '26px', borderColor: 'var(--gold-primary)' }}
                >
                  <Image src={user.avatar} alt={user.name} fill sizes="26px" style={{ objectFit: 'cover' }} />
                </div>
              ) : user ? (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: '26px', height: '26px', backgroundColor: 'var(--gold-primary)', fontSize: '0.72rem' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <User size={19} />
              )}
              {user && (
                <span 
                  className="position-absolute bottom-0 end-0 rounded-circle"
                  style={{ width: '7px', height: '7px', backgroundColor: '#34A853', border: '1px solid #fff' }}
                  title="Verified Customer Session"
                />
              )}
            </button>

            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              className="btn btn-link p-1 text-dark position-relative"
              aria-label="View Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    backgroundColor: 'var(--gold-primary)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    padding: '2px 5px'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button 
              className="btn btn-link p-1 text-dark position-relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{
                  backgroundColor: 'var(--gold-primary)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  padding: '2px 5.5px'
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white h-100 p-4 d-flex flex-column"
            style={{ width: '82%', maxWidth: '340px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className="brand-logo-container"
              >
                <div className="brand-logo-mark" style={{ width: '36px', height: '42px' }}>
                  <Image src="/logo.png" alt="IRA" fill sizes="36px" style={{ objectFit: 'contain' }} />
                </div>
                <div className="brand-text-block">
                  <span className="brand-title fs-5">IRA</span>
                  <span className="brand-subtitle" style={{ fontSize: '0.55rem' }}>LIFESTYLE</span>
                </div>
              </Link>
              <button 
                className="btn btn-link text-dark p-0"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="d-flex flex-column gap-3 flex-grow-1">
              <Link href="/" className="fs-6 fw-semibold text-dark text-decoration-none">HOME</Link>
              <div className="d-flex justify-content-between align-items-center">
                <Link href="/shop" className="fs-6 fw-semibold text-dark text-decoration-none">SHOP BY CATEGORY</Link>
                <Link href="/shop" className="small text-muted text-decoration-none" style={{ fontSize: '0.75rem' }}>View All →</Link>
              </div>
              <div className="ps-2 pe-1 d-flex flex-column gap-1 text-muted" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {categoriesList.map((cat) => (
                  <Link key={cat.label} href={cat.href} className="text-decoration-none text-muted py-1 small border-bottom border-light">
                    • {cat.label}
                  </Link>
                ))}
              </div>
              <Link href="/collections" className="fs-6 fw-semibold text-dark text-decoration-none">COLLECTIONS</Link>
              <Link href="/about" className="fs-6 fw-semibold text-dark text-decoration-none">ABOUT IRA</Link>
              <Link href="/contact" className="fs-6 fw-semibold text-dark text-decoration-none">CONTACT US</Link>
              <button 
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    openProfileDrawer();
                  } else {
                    openAuthModal();
                  }
                }}
                className="btn btn-link text-start p-0 fs-6 fw-semibold text-decoration-none pt-3 border-top d-flex align-items-center justify-content-between" 
                style={{ color: 'var(--gold-primary)' }}
              >
                <span>{user ? `MY ACCOUNT (${user.name.split(' ')[0].toUpperCase()})` : 'SIGN IN WITH GOOGLE'}</span>
                <User size={18} />
              </button>
            </div>

            <div className="pt-3 border-top text-center text-muted" style={{ fontSize: '0.75rem' }}>
              <p className="mb-2">Elegance In Every Thread</p>
              <div className="d-flex justify-content-center gap-3">
                <InstagramIcon size={16} />
                <FacebookIcon size={16} />
                <YoutubeIcon size={16} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
