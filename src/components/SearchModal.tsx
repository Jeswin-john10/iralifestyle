'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartWishlistContext';
import { initialProducts } from '@/lib/data';
import { Product } from '@/types';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = initialProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(matches);
  }, [query]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-md shadow-2xl border border-[#EDE5D8] overflow-hidden z-10 animate-fadeIn">
        <div className="p-4 sm:p-6 border-b border-[#EDE5D8] flex items-center bg-white">
          <Search className="w-5 h-5 text-[#B68D56] mr-3 stroke-[2]" />
          <input
            type="text"
            placeholder="Search dresses, kurtis, sarees, co-ord sets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#231F1C] placeholder-[#9E948A] text-base focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#9E948A] hover:text-[#231F1C] ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8F867C] mb-3 font-semibold">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Anarkali', 'Silk Kurti', 'Wine Saree', 'Linen Co-ord', 'Velvet Evening'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-[#F2ECE0] text-[#4A423A] text-xs rounded-full hover:bg-[#B68D56] hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-[#8F867C]">
              <p className="text-sm">No pieces found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#A89F95] mt-1">
                Try searching for sarees, kurtis, or dresses.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EDE5D8]">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="py-3 flex items-center gap-4 hover:bg-[#F4EFE6]/60 px-2 rounded-sm transition-colors group"
                >
                  <div className="relative w-14 h-18 bg-[#EDE5D8] rounded-xs overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#231F1C] group-hover:text-[#B68D56] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs text-[#8F867C]">{product.category}</span>
                    <div className="text-xs font-semibold text-[#B68D56] mt-0.5">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C5BBAF] group-hover:text-[#B68D56] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
