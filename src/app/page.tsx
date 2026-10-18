'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Star,
  Gem,
  ShieldCheck,
  Truck,
  Headphones,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';
import { categories, initialProducts } from '@/lib/data';

export default function HomePage() {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [heroIndex, setHeroIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const heroSlides = [
    {
      image: '/images/hero-model.jpg',
      subtitle: 'IRA LIFESTYLE',
      title: 'Timeless Elegance For Every You',
      description:
        'Crafted for the modern woman — graceful, confident and effortlessly stylish. Discover our latest collection of ethnic and contemporary wear.',
      script: 'Grace in every thread',
    },
    {
      image: '/images/cat-dresses.jpg',
      subtitle: 'FESTIVE COLLECTION',
      title: 'Royal Silks & Zari Wonders',
      description:
        'Indulge in royal silhouettes woven from rich Chanderi silk and intricate antique gold needlework made for life’s grand celebrations.',
      script: 'Elegance redefined',
    },
    {
      image: '/images/cat-coord.jpg',
      subtitle: 'NEW CONTEMPORARY',
      title: 'Modern Grace, Classic Roots',
      description:
        'Impeccably tailored luxury co-ord sets designed to elevate your everyday sophistication with understated Indian craftsmanship.',
      script: 'Pure artisan luxury',
    },
  ];

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch {
      setSubscribed(true);
    } finally {
      setSubscribing(false);
    }
  };

  const handleQuickAdd = (product: (typeof initialProducts)[0]) => {
    addToCart(product);
    setNotification(`Added "${product.name}" to your bag!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="w-full relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231F1C] text-white px-5 py-3 rounded-sm shadow-xl flex items-center space-x-2 text-xs tracking-wider animate-fadeIn">
          <Check className="w-4 h-4 text-[#B68D56]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#FAF7F2] overflow-hidden pt-2 pb-12 md:pb-16 border-b border-[#EDE5D8]/60">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
            {/* Left Content */}
            <div className="lg:col-span-5 z-10 flex flex-col justify-center py-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-7 h-[1px] bg-[#B68D56]" />
                <span className="text-[11px] tracking-[0.3em] font-semibold text-[#8F867C] uppercase">
                  {currentSlide.subtitle}
                </span>
                <span className="w-7 h-[1px] bg-[#B68D56]" />
              </div>

              <h1
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.12] text-[#231F1C] mb-5 tracking-tight"
              >
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-base text-[#686057] leading-relaxed font-light mb-8 max-w-lg">
                {currentSlide.description}
              </p>

              <div>
                <Link
                  href="/shop"
                  className="gold-btn px-8 py-4 text-xs tracking-[0.2em] rounded-xs font-semibold inline-flex items-center space-x-2.5 shadow-sm"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center space-x-6 mt-10 text-xs text-[#7B7268] tracking-widest font-mono">
                <span className="font-semibold text-[#231F1C]">
                  0{heroIndex + 1} <span className="text-[#B68D56] font-normal">/</span> 0{heroSlides.length}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePrevHero}
                    className="p-2 border border-[#EDE5D8] rounded-full hover:bg-[#F2ECE0] text-[#3D3731] transition-colors"
                    aria-label="Previous Slide"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNextHero}
                    className="p-2 border border-[#EDE5D8] rounded-full hover:bg-[#F2ECE0] text-[#3D3731] transition-colors"
                    aria-label="Next Slide"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Hero Visual with Script Callout */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] lg:h-[560px] w-full rounded-sm overflow-hidden shadow-sm">
              <Image
                src={currentSlide.image}
                alt="IRA Lifestyle Editorial Collection"
                fill
                priority
                className="object-cover object-center transition-all duration-700"
              />

              {/* Delicate Warm Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Script Callout Overlay */}
              <div className="absolute top-8 right-8 text-right z-10 pointer-events-none drop-shadow-md">
                <span
                  style={{ fontFamily: 'var(--font-script)' }}
                  className="text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-wide block"
                >
                  {currentSlide.script}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="w-full py-16 md:py-20 bg-[#FAF7F2] relative">
        {/* Subtle Decorative Floral Line-art SVGs */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden xl:block">
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
            <path
              d="M30 10C30 40 10 50 10 70C10 90 30 100 30 110M30 35C45 35 50 45 45 55C40 65 30 55 30 55M30 75C15 75 10 85 15 95C20 105 30 95 30 95"
              stroke="#B68D56"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none hidden xl:block">
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
            <path
              d="M30 10C30 40 50 50 50 70C50 90 30 100 30 110M30 35C15 35 10 45 15 55C20 65 30 55 30 55M30 75C45 75 50 85 45 95C40 105 30 95 30 95"
              stroke="#B68D56"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="w-6 h-[1px] bg-[#B68D56]" />
            <span className="text-[11px] tracking-[0.25em] font-semibold text-[#8F867C] uppercase">
              SHOP BY CATEGORY
            </span>
            <span className="w-6 h-[1px] bg-[#B68D56]" />
          </div>

          <h2
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-3xl sm:text-4xl font-normal text-[#231F1C] mb-12 tracking-tight"
          >
            Find Your Style
          </h2>

          {/* Arched Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center"
              >
                {/* Arched Container */}
                <div className="w-full aspect-[3/4.2] rounded-t-[100px] overflow-hidden bg-[#EDE5D8] relative shadow-sm border border-[#EDE5D8] transition-all duration-500 group-hover:shadow-md group-hover:border-[#B68D56]/50">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                <div className="mt-4 flex items-center space-x-1 text-xs tracking-[0.16em] uppercase font-semibold text-[#2E2824] group-hover:text-[#B68D56] transition-colors">
                  <span>{cat.name}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION SECTION */}
      <section className="w-full py-16 md:py-20 bg-[#F7F2EB] border-t border-b border-[#EDE5D8]">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Promotional Block */}
            <div className="lg:col-span-3 flex flex-col justify-between self-stretch pr-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] font-semibold text-[#8F867C] uppercase block mb-3">
                  FEATURED COLLECTION
                </span>
                <h3
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="text-3xl sm:text-4xl text-[#231F1C] font-normal leading-snug mb-4"
                >
                  Designer Ethnic Wear
                </h3>
                <p className="text-xs sm:text-sm text-[#6F665C] leading-relaxed mb-6 font-light">
                  Elegant pieces for your most special moments. Tradition meets modern grace.
                </p>
                <Link
                  href="/shop"
                  className="gold-btn px-6 py-3 text-[11px] tracking-widest rounded-xs inline-flex items-center space-x-2"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Decorative Subtle Branch Watermark */}
              <div className="mt-12 hidden lg:block opacity-20">
                <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
                  <path
                    d="M10 100C40 90 60 70 70 20M35 85C45 75 55 80 50 90M55 55C65 45 75 50 70 60"
                    stroke="#B68D56"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* Right Product Grid */}
            <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {initialProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="group bg-[#FAF7F2] rounded-xs border border-[#EDE5D8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#D8C6AB]"
                >
                  {/* Image Container with Wishlist */}
                  <div className="relative aspect-[3/4] bg-[#EDE5D8] overflow-hidden">
                    <Link href={`/product/${product.id}`} className="relative block w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#231F1C] hover:text-[#B68D56] transition-all hover:scale-110 shadow-xs"
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(product.id)
                            ? 'text-[#B68D56] fill-[#B68D56]'
                            : 'stroke-[1.5]'
                        }`}
                      />
                    </button>

                    {/* Quick Add Overlay on hover */}
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="absolute bottom-0 inset-x-0 bg-[#231F1C]/90 text-white text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B68D56]" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-xs font-medium text-[#2E2824] hover:text-[#B68D56] transition-colors line-clamp-1 block"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center space-x-1.5 mt-1.5">
                      <span className="text-xs font-semibold text-[#231F1C]">
                        ₹ {product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-[#A69C90] line-through">
                          ₹ {product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1 mt-2 text-[10px] text-[#8F867C]">
                      <div className="flex text-[#B68D56]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#B68D56]'
                                : 'text-[#DCD2C4]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[9px]">({product.rating})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR STORY SECTION */}
      <section className="w-full py-16 md:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Model with Jasmine In Hair */}
            <div className="md:col-span-4 relative aspect-[4/5] rounded-xs overflow-hidden shadow-sm bg-[#EDE5D8]">
              <Image
                src="/images/story-model.jpg"
                alt="IRA Lifestyle Heritage Craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Middle: Brand Story Copy */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.28em] font-semibold text-[#8F867C] uppercase mb-3">
                OUR STORY
              </span>
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-3xl sm:text-4xl text-[#231F1C] font-normal leading-snug mb-5"
              >
                More Than Just Clothing
              </h2>
              <p className="text-sm text-[#686057] leading-relaxed font-light mb-6">
                At IRA Lifestyle, we believe in the power of fashion to express your true self. Our
                collections are crafted with elegance, comfort and a touch of modern charm —
                because you deserve to feel beautiful, always.
              </p>
              <div>
                <Link
                  href="/about"
                  className="gold-btn px-6 py-3 text-xs tracking-widest rounded-xs inline-flex items-center space-x-2"
                >
                  <span>KNOW MORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: 4 Luxury Service Badges */}
            <div className="md:col-span-3 flex flex-col space-y-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#EDE5D8] md:pl-8">
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xs bg-[#F2ECE0] text-[#B68D56] flex-shrink-0">
                  <Gem className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#231F1C] tracking-wide">
                    Premium Quality Fabrics
                  </h4>
                  <p className="text-[11px] text-[#8F867C] mt-0.5 font-light">
                    Pure hand-picked silks, linens &amp; georgettes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xs bg-[#F2ECE0] text-[#B68D56] flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#231F1C] tracking-wide">
                    Secure Payments &amp; Easy Returns
                  </h4>
                  <p className="text-[11px] text-[#8F867C] mt-0.5 font-light">
                    Safe checkout &amp; hassle-free 7-day returns
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xs bg-[#F2ECE0] text-[#B68D56] flex-shrink-0">
                  <Truck className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#231F1C] tracking-wide">
                    Fast &amp; Reliable Delivery
                  </h4>
                  <p className="text-[11px] text-[#8F867C] mt-0.5 font-light">
                    Complimentary express dispatch across India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xs bg-[#F2ECE0] text-[#B68D56] flex-shrink-0">
                  <Headphones className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#231F1C] tracking-wide">
                    Customer Support Always Here
                  </h4>
                  <p className="text-[11px] text-[#8F867C] mt-0.5 font-light">
                    Personal styling &amp; order assistance via WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. QUOTE & NEWSLETTER SECTION */}
      <section className="w-full bg-[#FAF7F2] border-t border-[#EDE5D8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
          {/* Left Quote with Silk Fabric Background */}
          <div className="lg:col-span-6 relative flex items-center justify-center p-8 sm:p-12 overflow-hidden bg-[#EDE5D8]">
            <Image
              src="/images/quote-bg.jpg"
              alt="IRA Silk Texture"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#F4EFE6]/70 backdrop-blur-[1px]" />

            <div className="relative z-10 text-center max-w-md px-4">
              <blockquote
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl sm:text-3xl text-[#231F1C] italic font-normal leading-relaxed mb-3"
              >
                &ldquo;Style is a way of saying who you are without speaking.&rdquo;
              </blockquote>
              <span className="text-xs tracking-[0.3em] font-medium text-[#B68D56] uppercase">
                — IRA
              </span>
            </div>
          </div>

          {/* Right Newsletter Form */}
          <div className="lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 bg-[#F9F5EE]">
            <span className="text-[10px] tracking-[0.28em] font-semibold text-[#8F867C] uppercase mb-2">
              JOIN OUR STYLE JOURNEY
            </span>
            <h3
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-3xl text-[#231F1C] font-normal mb-2"
            >
              Get Exclusive Updates
            </h3>
            <p className="text-xs text-[#6F665C] mb-6 font-light max-w-sm">
              Be the first to know about new arrivals, special offers and style tips.
            </p>

            {subscribed ? (
              <div className="p-4 bg-[#EAF2EC] text-[#2F5A35] rounded-xs text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#3F6A44]" />
                <span>Thank you! You are now subscribed to IRA exclusive updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] placeholder-[#9E948A] focus:outline-none focus:border-[#B68D56]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="gold-btn px-6 py-3 text-xs tracking-widest rounded-xs uppercase flex items-center justify-center space-x-2 flex-shrink-0"
                >
                  <span>{subscribing ? 'SENDING...' : 'SUBSCRIBE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
