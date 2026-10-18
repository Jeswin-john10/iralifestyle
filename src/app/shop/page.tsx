'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Heart, Star, ShoppingBag, Filter, ArrowUpDown } from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';
import { initialProducts, categories } from '@/lib/data';
import { Product } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  // Fetch from API (connects to MongoDB if available, otherwise data)
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = selectedCategory === 'All'
          ? '/api/products'
          : `/api/products?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          setProducts(initialProducts);
        }
      } catch {
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory === 'All') return true;
      return p.category.toLowerCase() === selectedCategory.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Header Breadcrumbs & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] tracking-[0.25em] text-[#8F867C] uppercase font-semibold mb-2">
            THE CATALOGUE
          </div>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-4xl md:text-5xl font-normal text-[#231F1C] tracking-tight mb-3"
          >
            {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#6F665C] font-light">
            Discover bespoke ethnic silhouettes crafted in the finest silks, breathable linens, and rich handwork.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 mb-8 border-b border-[#EDE5D8] gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xs transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-[#231F1C] text-white font-medium'
                  : 'bg-[#F2ECE0] text-[#4A423A] hover:bg-[#E8DFCة hover:text-[#231F1C]'
              }`}
            >
              All Pieces
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xs transition-colors ${
                  selectedCategory.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-[#B68D56] text-white font-medium'
                    : 'bg-[#F2ECE0] text-[#4A423A] hover:bg-[#E8DFD0] hover:text-[#231F1C]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center space-x-4 text-xs text-[#6F665C] w-full md:w-auto justify-between md:justify-end">
            <span>
              Showing <strong className="text-[#231F1C]">{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center space-x-1.5 border border-[#EDE5D8] rounded-xs bg-white px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8F867C]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-[#231F1C] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-sm text-[#8F867C]">
            Curating IRA Lifestyle catalogue...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 style={{ fontFamily: 'var(--font-serif)' }} className="text-2xl text-[#231F1C] mb-2">
              No pieces found in this category
            </h3>
            <button
              onClick={() => setSelectedCategory('All')}
              className="gold-btn px-6 py-2.5 text-xs rounded-xs uppercase tracking-wider mt-2"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-[#FAF7F2] rounded-xs border border-[#EDE5D8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#D8C6AB]"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-[#EDE5D8] overflow-hidden">
                  <Link href={`/product/${product.id}`} className="relative block w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                  </Link>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#231F1C] hover:text-[#B68D56] transition-all hover:scale-110 shadow-xs"
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

                  {/* Add to Bag on Hover */}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-0 inset-x-0 bg-[#231F1C]/90 text-white text-[11px] tracking-widest uppercase py-3 flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#B68D56]" />
                    <span>Quick Add</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <span className="text-[10px] tracking-wider uppercase text-[#8F867C] font-semibold block mb-1">
                    {product.category}
                  </span>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm font-medium text-[#2E2824] hover:text-[#B68D56] transition-colors line-clamp-1 block"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm font-semibold text-[#231F1C]">
                      ₹ {product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#A69C90] line-through">
                        ₹ {product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 mt-2 text-[10px] text-[#8F867C]">
                    <div className="flex text-[#B68D56]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-[#B68D56]'
                              : 'text-[#DCD2C4]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono">({product.rating})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen py-24 text-center text-sm text-[#8F867C]">
          Loading catalogue...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
