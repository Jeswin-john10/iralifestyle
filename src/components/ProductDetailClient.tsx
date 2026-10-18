'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';
import { initialProducts } from '@/lib/data';
import { Product } from '@/types';

export default function ProductDetailClient({ id }: { id: string }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
          if (data.product.sizes?.length) setSelectedSize(data.product.sizes[0]);
          return;
        }
      } catch {
        // Fallback
      }
      const found = initialProducts.find((p) => p.id === id || p.slug === id) || initialProducts[0];
      setProduct(found);
      setSelectedImage(found.image);
      if (found.sizes?.length) setSelectedSize(found.sizes[0]);
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-sm text-[#8F867C]">
        Loading product details...
      </div>
    );
  }

  const relatedProducts = initialProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-14">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231F1C] text-white px-5 py-3 rounded-sm shadow-xl flex items-center space-x-2 text-xs tracking-wider animate-fadeIn">
          <Check className="w-4 h-4 text-[#B68D56]" />
          <span>Added {quantity}x &ldquo;{product.name}&rdquo; ({selectedSize}) to bag!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Breadcrumb */}
        <div className="text-xs text-[#8F867C] flex items-center space-x-2 mb-8">
          <Link href="/" className="hover:text-[#B68D56] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#B68D56] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#B68D56] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#231F1C] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 flex-shrink-0">
              {[product.image, ...(product.images || [])]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 md:w-full aspect-[3/4] rounded-xs overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-[#B68D56] shadow-sm'
                        : 'border-[#EDE5D8] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
            </div>

            {/* Large Main Image */}
            <div className="flex-1 relative aspect-[3/4] rounded-xs overflow-hidden bg-[#EDE5D8] border border-[#EDE5D8] shadow-sm">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-[#231F1C] hover:text-[#B68D56] transition-all hover:scale-110 shadow-sm"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.id) ? 'text-[#B68D56] fill-[#B68D56]' : 'stroke-[1.6]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right: Product Buy Info */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8F867C] mb-2">
              IRA LUXURY &bull; {product.category}
            </span>

            <h1
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-3xl sm:text-4xl text-[#231F1C] font-normal leading-tight mb-3"
            >
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center space-x-2 mb-5">
              <div className="flex text-[#B68D56]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-[#B68D56]' : 'text-[#DCD2C4]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#8F867C]">
                {product.rating} ({product.reviewsCount} verified customer reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-6 pb-6 border-b border-[#EDE5D8]">
              <span className="text-2xl sm:text-3xl font-semibold text-[#231F1C]">
                ₹ {product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-[#A69C90] line-through">
                    ₹ {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-[#3F6A44] bg-[#EAF2EC] px-2 py-0.5 rounded-xs">
                    SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#3D3731]">
                    Select Size
                  </span>
                  <button className="text-xs text-[#B68D56] hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-12 h-10 px-3 text-xs tracking-wider rounded-xs font-medium border transition-all ${
                        selectedSize === s
                          ? 'border-[#231F1C] bg-[#231F1C] text-white shadow-xs'
                          : 'border-[#EDE5D8] bg-white text-[#4A423A] hover:border-[#B68D56]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#EDE5D8] rounded-xs bg-white h-12 px-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#7B7268] hover:text-[#231F1C] px-2"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold px-2 min-w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#7B7268] hover:text-[#231F1C] px-2"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="gold-btn flex-1 h-12 text-xs tracking-widest rounded-xs uppercase flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
              </div>

              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="w-full h-12 bg-[#231F1C] hover:bg-[#38322D] text-white text-xs tracking-widest uppercase font-semibold rounded-xs flex items-center justify-center space-x-2 transition-colors"
              >
                <span>BUY IT NOW &rarr;</span>
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#EDE5D8] text-center text-[10px] text-[#6F665C]">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#B68D56] mb-1" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex flex-col items-center border-x border-[#EDE5D8]">
                <RotateCcw className="w-4 h-4 text-[#B68D56] mb-1" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#B68D56] mb-1" />
                <span>100% Authentic Handcraft</span>
              </div>
            </div>

            {/* Tabs Accordion */}
            <div className="mt-6 border-b border-[#EDE5D8]">
              <div className="flex space-x-6 text-xs uppercase tracking-wider font-semibold border-b border-[#EDE5D8]">
                {(['details', 'fabric', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 transition-colors relative ${
                      activeTab === tab ? 'text-[#B68D56]' : 'text-[#8F867C] hover:text-[#231F1C]'
                    }`}
                  >
                    {tab === 'details' && 'Description'}
                    {tab === 'fabric' && 'Fabric & Care'}
                    {tab === 'shipping' && 'Shipping & Returns'}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B68D56]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="py-4 text-xs text-[#6F665C] leading-relaxed">
                {activeTab === 'details' && <p>{product.description}</p>}
                {activeTab === 'fabric' && (
                  <div className="space-y-1.5">
                    <p>
                      <strong>Fabric:</strong> {product.fabric}
                    </p>
                    <p>
                      <strong>Care:</strong> {product.care}
                    </p>
                    <p>
                      <strong>Craft:</strong> Hand-embellished zari and resham threadwork by generational Indian artisans.
                    </p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-1.5">
                    <p>&bull; Dispatches within 24-48 business hours from our boutique atelier.</p>
                    <p>&bull; Complimentary insured doorstep express delivery across India on orders above ₹999.</p>
                    <p>&bull; Hassle-free 7-day pickup exchange service.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Love */}
        <div className="mt-20 pt-12 border-t border-[#EDE5D8]">
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8F867C] font-semibold block mb-1">
              CURATED FOR YOU
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl text-[#231F1C] font-normal">
              You May Also Admire
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/product/${rel.id}`}
                className="group bg-[#FAF7F2] rounded-xs border border-[#EDE5D8] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-[#D8C6AB]"
              >
                <div className="relative aspect-[3/4] bg-[#EDE5D8] overflow-hidden">
                  <Image
                    src={rel.image}
                    alt={rel.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                </div>
                <div className="p-3">
                  <span className="text-[9px] uppercase tracking-wider text-[#8F867C] block mb-0.5">
                    {rel.category}
                  </span>
                  <div className="text-xs font-medium text-[#2E2824] group-hover:text-[#B68D56] transition-colors line-clamp-1">
                    {rel.name}
                  </div>
                  <div className="text-xs font-semibold text-[#231F1C] mt-1">
                    ₹ {rel.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
